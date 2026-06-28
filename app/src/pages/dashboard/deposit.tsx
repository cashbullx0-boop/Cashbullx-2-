import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowDownToLine, Copy, CheckCircle2, Loader2, Clock, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const NETWORKS = {
  USDT_TRC20: {
    label: "USDT (TRC20)",
    chain: "Tron Network",
    symbol: "USDT",
    address: "TB66zHLC4xwRUhsr3gDdJLWs9ZUCzS1x5Z",
    minAmount: 50,
    estTime: "~3 min",
    fee: "~1 USDT",
    color: "from-red-500/20 to-orange-500/10",
    borderColor: "border-red-500/20",
  },
  USDT_BEP20: {
    label: "USDT (BEP20)",
    chain: "BNB Smart Chain",
    symbol: "USDT",
    address: "0xAbCdEf0123456789AbCdEf0123456789AbCdEf01",
    minAmount: 50,
    estTime: "~1 min",
    fee: "~0.3 USDT",
    color: "from-yellow-500/20 to-amber-500/10",
    borderColor: "border-yellow-500/20",
    disabled: true,
  },
};

export function DepositPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedNetwork, setSelectedNetwork] = useState<"USDT_TRC20" | "USDT_BEP20">("USDT_TRC20");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"input" | "payment" | "success">("input");
  const [depositId, setDepositId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState("");

  const { data: deposits } = useQuery({
    queryKey: ["deposits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
    enabled: !!user,
  });

  const createDeposit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt < 50) throw new Error("Minimum deposit is $50");

      const net = NETWORKS[selectedNetwork];
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("deposits")
        .insert({
          user_id: user.id,
          amount_usd: amt,
          network: selectedNetwork,
          wallet_address: net.address,
          status: "pending",
          provider: "manual",
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setDepositId(data.id);
      setStep("payment");
      toast.success("Deposit request created!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const submitTxHash = useMutation({
    mutationFn: async () => {
      if (!depositId || !txHash.trim()) throw new Error("Enter transaction hash");
      const { error } = await (supabase as any).rpc("submit_deposit_tx_hash", {
        _deposit_id: depositId,
        _tx_hash: txHash.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setStep("success");
      toast.success("Transaction submitted for review!");
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const net = NETWORKS[selectedNetwork] as any;

  const handleCopy = () => {
    navigator.clipboard.writeText(net.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Address copied!");
  };

  const statusColors: Record<string, string> = {
    pending: "status-pending",
    confirming: "status-pending",
    approved: "status-approved",
    completed: "status-approved",
    failed: "status-rejected",
    expired: "status-rejected",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Deposit</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Add funds to your wallet</p>
      </motion.div>

      {step === "input" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-6">
              {/* Network Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Network</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.entries(NETWORKS) as [string, typeof net][]).map(([key, network]) => (
                    <button
                      key={key}
                      onClick={() => !network.disabled && setSelectedNetwork(key as typeof selectedNetwork)}
                      disabled={network.disabled}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedNetwork === key
                          ? `${network.borderColor} bg-gradient-to-br ${network.color} ring-1 ring-white/10`
                          : "border-white/[0.06] hover:border-white/[0.1]"
                      } ${network.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{network.label}</span>
                        {selectedNetwork === key && <CheckCircle2 className="h-4 w-4 text-cbx-success" />}
                      </div>
                      <p className="text-xs text-cbx-text-secondary">{network.chain}</p>
                      {network.disabled && <p className="text-xs text-cbx-warning mt-1">Coming soon</p>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount (USD)</Label>
                <Input
                  type="number"
                  placeholder={`Minimum $${net.minAmount}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-dark h-12 text-lg"
                  min={net.minAmount}
                />
                <p className="text-xs text-cbx-text-secondary">Fee: {net.fee}</p>
              </div>

              <Button
                onClick={() => createDeposit.mutate()}
                disabled={createDeposit.isPending || !amount || parseFloat(amount) < net.minAmount}
                className="w-full h-12 bg-cbx-success hover:bg-cbx-success/90 text-white font-medium"
              >
                {createDeposit.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === "payment" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-sm text-cbx-text-secondary mb-1">Send exactly</p>
                <p className="text-3xl font-bold">${parseFloat(amount).toFixed(2)} USDT</p>
                <p className="text-xs text-cbx-text-secondary mt-1">Network: {net.label}</p>
              </div>

              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-xl">
                  <QRCodeSVG value={net.address} size={180} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Deposit Address</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 rounded-xl bg-white/[0.04] text-xs font-mono break-all border border-white/[0.06]">
                    {net.address}
                  </code>
                  <Button size="icon" variant="outline" onClick={handleCopy} className="shrink-0 h-12 w-12 border-white/10">
                    {copied ? <CheckCircle2 className="h-4 w-4 text-cbx-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Transaction Hash (optional)</Label>
                <Input
                  placeholder="Paste tx hash after sending"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="input-dark h-12"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("input")} className="flex-1 border-white/10">
                  Back
                </Button>
                <Button
                  onClick={() => submitTxHash.mutate()}
                  disabled={submitTxHash.isPending}
                  className="flex-1 h-12 bg-cbx-purple hover:bg-cbx-purple/90"
                >
                  {submitTxHash.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "I've Paid"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === "success" && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="glass-card p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-cbx-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Deposit Submitted!</h2>
            <p className="text-cbx-text-secondary mb-6">
              Your deposit is being reviewed. You'll be notified once it's approved.
            </p>
            <Button onClick={() => { setStep("input"); setAmount(""); setTxHash(""); }} className="bg-cbx-purple hover:bg-cbx-purple/90">
              Make Another Deposit
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Deposit History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-cbx-cyan" />
              Deposit History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deposits && deposits.length > 0 ? (
              <div className="space-y-2">
                {deposits.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-medium">${d.amount_usd.toFixed(2)} {d.network}</p>
                      <p className="text-xs text-cbx-text-secondary">
                        {new Date(d.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={statusColors[d.status] || "status-pending"}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-cbx-text-secondary py-8">No deposits yet</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
