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
import { ArrowUpFromLine, Loader2, Clock, AlertTriangle } from "lucide-react";

export function WithdrawPage() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState(profile?.okx_wallet || "");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"input" | "otp" | "success">("input");

  const balance = (profile?.balance_cents ?? 0) / 100;
  const minWithdrawal = 10;

  const { data: withdrawals } = useQuery({
    queryKey: ["withdrawals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
    enabled: !!user,
  });

  const requestOtp = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt < minWithdrawal) throw new Error(`Minimum withdrawal is $${minWithdrawal}`);
      if (amt > balance) throw new Error("Insufficient balance");
      if (!walletAddress.trim()) throw new Error("Enter wallet address");

      // In production: call edge function to send OTP
      // For now, simulate
      toast.success("OTP sent to your email!");
      setStep("otp");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const submitWithdrawal = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      if (!otpCode.trim()) throw new Error("Enter OTP code");

      const { error } = await supabase.from("withdrawals").insert({
        user_id: user.id,
        amount_cents: Math.round(parseFloat(amount) * 100),
        wallet_address: walletAddress.trim(),
        fee_cents: 0,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setStep("success");
      toast.success("Withdrawal request submitted!");
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const statusColors: Record<string, string> = {
    pending: "status-pending",
    processing: "status-pending",
    approved: "status-approved",
    rejected: "status-rejected",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Withdraw</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Request a withdrawal to your wallet</p>
      </motion.div>

      {/* Balance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-cbx-text-secondary">Available Balance</p>
              <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cbx-purple/10 flex items-center justify-center">
              <ArrowUpFromLine className="h-6 w-6 text-cbx-purple" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {step === "input" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount (USD)</Label>
                <Input
                  type="number"
                  placeholder={`Minimum $${minWithdrawal}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-dark h-12"
                  min={minWithdrawal}
                />
                <p className="text-xs text-cbx-text-secondary">Min: ${minWithdrawal} | Fee: $0</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">USDT TRC20 Wallet Address</Label>
                <Input
                  placeholder="Enter your TRC20 wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="input-dark h-12"
                />
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-cbx-warning/5 border border-cbx-warning/10">
                <AlertTriangle className="h-4 w-4 text-cbx-warning shrink-0 mt-0.5" />
                <p className="text-xs text-cbx-text-secondary">
                  Double-check your wallet address. Transactions cannot be reversed once processed.
                </p>
              </div>

              <Button
                onClick={() => requestOtp.mutate()}
                disabled={requestOtp.isPending}
                className="w-full h-12 bg-cbx-purple hover:bg-cbx-purple/90 text-white font-medium"
              >
                {requestOtp.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request OTP"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === "otp" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">Enter OTP</h3>
                <p className="text-sm text-cbx-text-secondary">Enter the code sent to your email</p>
              </div>
              <Input
                placeholder="6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="input-dark h-12 text-center text-2xl tracking-[0.5em]"
                maxLength={6}
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("input")} className="flex-1 border-white/10">
                  Back
                </Button>
                <Button
                  onClick={() => submitWithdrawal.mutate()}
                  disabled={submitWithdrawal.isPending}
                  className="flex-1 h-12 bg-cbx-purple hover:bg-cbx-purple/90"
                >
                  {submitWithdrawal.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === "success" && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-cbx-success/20 flex items-center justify-center mx-auto mb-4">
              <ArrowUpFromLine className="h-8 w-8 text-cbx-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Withdrawal Requested!</h2>
            <p className="text-cbx-text-secondary mb-6">
              Your withdrawal request has been submitted and is pending admin approval.
            </p>
            <Button onClick={() => { setStep("input"); setAmount(""); setOtpCode(""); }} className="bg-cbx-purple hover:bg-cbx-purple/90">
              New Withdrawal
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Withdrawal History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-cbx-cyan" />
              Withdrawal History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawals && withdrawals.length > 0 ? (
              <div className="space-y-2">
                {withdrawals.map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-medium">${(w.amount_cents / 100).toFixed(2)}</p>
                      <p className="text-xs text-cbx-text-secondary font-mono truncate max-w-[200px]">
                        {w.wallet_address}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={statusColors[w.status] || "status-pending"}>{w.status}</span>
                      <p className="text-xs text-cbx-text-secondary mt-1">
                        {new Date(w.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-cbx-text-secondary py-8">No withdrawals yet</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
