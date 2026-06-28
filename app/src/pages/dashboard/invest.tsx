import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TrendingUp, Clock, Loader2, CheckCircle2, AlertTriangle, BarChart3 } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    minAmount: 50,
    maxAmount: 499,
    dailyRoi: 1.2,
    period: 30,
    color: "from-cbx-cyan/20 to-cbx-cyan/5",
    border: "border-cbx-cyan/20",
    features: ["Daily payouts", "Principal return", "1.2% daily ROI"],
  },
  {
    id: "pro",
    name: "Pro",
    minAmount: 500,
    maxAmount: 1999,
    dailyRoi: 1.8,
    period: 45,
    color: "from-cbx-purple/20 to-cbx-purple/5",
    border: "border-cbx-purple/20",
    features: ["Daily payouts", "Principal return", "1.8% daily ROI", "Priority support"],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    minAmount: 2000,
    maxAmount: 10000,
    dailyRoi: 2.5,
    period: 60,
    color: "from-cbx-gold/20 to-cbx-gold/5",
    border: "border-cbx-gold/20",
    features: ["Daily payouts", "Principal return", "2.5% daily ROI", "VIP support", "Referral boost"],
  },
];

export function InvestPage() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const balance = (profile?.balance_cents ?? 0) / 100;

  const { data: investments } = useQuery({
    queryKey: ["investments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
    enabled: !!user,
  });

  const investMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const plan = PLANS.find((p) => p.id === selectedPlan);
      if (!plan) throw new Error("Select a plan");
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt < plan.minAmount || amt > plan.maxAmount) {
        throw new Error(`Amount must be between $${plan.minAmount} and $${plan.maxAmount}`);
      }
      if (amt > balance) throw new Error("Insufficient balance");

      const { error } = await supabase.from("investments").insert({
        user_id: user.id,
        amount_cents: Math.round(amt * 100),
        asset: "USDT",
        asset_name: `${plan.name} Plan`,
        return_percent: plan.dailyRoi,
        status: "active",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Investment created successfully!");
      setSelectedPlan(null);
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const activeInvestments = investments?.filter((i) => i.status === "active") ?? [];
  const totalInvested = activeInvestments.reduce((sum, i) => sum + i.amount_cents, 0);

  const statusColors: Record<string, string> = {
    active: "status-pending",
    completed: "status-approved",
    cancelled: "status-rejected",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Invest</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Earn daily returns on your investments</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <p className="text-xs text-cbx-text-secondary">Total Invested</p>
            <p className="text-xl font-bold">${(totalInvested / 100).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <p className="text-xs text-cbx-text-secondary">Active Plans</p>
            <p className="text-xl font-bold">{activeInvestments.length}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <p className="text-xs text-cbx-text-secondary">Available</p>
            <p className="text-xl font-bold">${balance.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg font-semibold mb-4">Investment Plans</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`glass-card cursor-pointer transition-all ${
                selectedPlan === plan.id ? `${plan.border} ring-1 ring-white/10` : ""
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardContent className="p-5">
                {plan.popular && (
                  <Badge className="mb-3 bg-cbx-purple/20 text-cbx-purple border-cbx-purple/20">Most Popular</Badge>
                )}
                <div className={`h-24 rounded-xl bg-gradient-to-b ${plan.color} flex items-center justify-center mb-4`}>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{plan.dailyRoi}%</p>
                    <p className="text-xs text-cbx-text-secondary">Daily ROI</p>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-cbx-text-secondary mb-3">
                  ${plan.minAmount} - ${plan.maxAmount.toLocaleString()}
                </p>
                <ul className="space-y-1 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-cbx-text-secondary">
                      <CheckCircle2 className="h-3 w-3 text-cbx-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-cbx-text-secondary">{plan.period} days period</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Investment Form */}
      {selectedPlan && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">
                Invest in {PLANS.find((p) => p.id === selectedPlan)?.name} Plan
              </h3>
              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-dark h-12"
                />
                <p className="text-xs text-cbx-text-secondary">
                  Balance: ${balance.toFixed(2)} | Min: ${PLANS.find((p) => p.id === selectedPlan)?.minAmount}
                </p>
              </div>
              <Button
                onClick={() => investMutation.mutate()}
                disabled={investMutation.isPending}
                className="w-full h-12 bg-cbx-purple hover:bg-cbx-purple/90"
              >
                {investMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Investment"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Investment History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cbx-cyan" />
              Investment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {investments && investments.length > 0 ? (
              <div className="space-y-2">
                {investments.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-medium">{inv.asset_name}</p>
                      <p className="text-xs text-cbx-text-secondary">
                        ${(inv.amount_cents / 100).toFixed(2)} at {inv.return_percent}% daily
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={statusColors[inv.status] || "status-pending"}>{inv.status}</span>
                      <p className="text-xs text-cbx-text-secondary mt-1">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-cbx-text-secondary py-8">No investments yet</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
