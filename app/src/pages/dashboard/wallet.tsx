import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownToLine, ArrowUpFromLine, Clock, Wallet } from "lucide-react";

export function WalletPage() {
  const { user, profile } = useAuth();
  const balance = (profile?.balance_cents ?? 0) / 100;

  const { data: transactions } = useQuery({
    queryKey: ["wallet-transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
    enabled: !!user,
  });

  const txnTypeColors: Record<string, string> = {
    deposit: "text-cbx-success",
    withdrawal: "text-cbx-danger",
    task_reward: "text-cbx-cyan",
    referral_bonus: "text-cbx-gold",
    investment_profit: "text-cbx-purple",
    trade_profit: "text-cbx-purple",
    checkin: "text-cbx-success",
    survey: "text-cbx-cyan",
    adjustment: "text-cbx-warning",
  };

  const txnTypeLabels: Record<string, string> = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    task_reward: "Task Reward",
    referral_bonus: "Referral Bonus",
    investment_profit: "Investment Profit",
    trade_profit: "Trade Profit",
    checkin: "Daily Check-in",
    survey: "Survey",
    adjustment: "Adjustment",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Manage your balance and view history</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card gradient-border">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cbx-purple/10 flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-cbx-purple" />
            </div>
            <p className="text-sm text-cbx-text-secondary mb-1">Available Balance</p>
            <p className="text-5xl font-bold mb-6">${balance.toFixed(2)}</p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/deposit">
                <Button className="bg-cbx-success hover:bg-cbx-success/90">
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Deposit
                </Button>
              </Link>
              <Link to="/withdraw">
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-cbx-cyan" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        txn.amount_cents >= 0 ? "bg-cbx-success/10" : "bg-cbx-danger/10"
                      }`}>
                        {txn.amount_cents >= 0 ? (
                          <ArrowDownToLine className="h-5 w-5 text-cbx-success" />
                        ) : (
                          <ArrowUpFromLine className="h-5 w-5 text-cbx-danger" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{txnTypeLabels[txn.type] || txn.type}</p>
                        <p className="text-xs text-cbx-text-secondary">
                          {new Date(txn.created_at).toLocaleDateString()} at{" "}
                          {new Date(txn.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${txn.amount_cents >= 0 ? "text-cbx-success" : "text-cbx-danger"}`}>
                        {txn.amount_cents >= 0 ? "+" : "-"}${Math.abs(txn.amount_cents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-cbx-text-secondary mx-auto mb-3" />
                <p className="text-cbx-text-secondary">No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
