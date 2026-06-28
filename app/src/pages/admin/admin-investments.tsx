import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export function AdminInvestments() {
  const { data: investments } = useQuery({
    queryKey: ["admin-investments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  const statusColors: Record<string, string> = {
    active: "status-pending",
    completed: "status-approved",
    cancelled: "status-rejected",
  };

  const totalActive = (investments ?? []).filter((i) => i.status === "active").reduce((sum, i) => sum + i.amount_cents, 0);
  const totalProfit = (investments ?? []).filter((i) => i.status === "completed").reduce((sum, i) => sum + ((i as any).profit_cents || 0), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Investments</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Monitor all investments</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <p className="text-xs text-cbx-text-secondary">Total Active</p>
            <p className="text-2xl font-bold">${(totalActive / 100).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <p className="text-xs text-cbx-text-secondary">Total Profit Paid</p>
            <p className="text-2xl font-bold text-cbx-success">${(totalProfit / 100).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <p className="text-xs text-cbx-text-secondary">Active Count</p>
            <p className="text-2xl font-bold">{(investments ?? []).filter((i) => i.status === "active").length}</p>
          </CardContent>
        </Card>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">All Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {investments && investments.length > 0 ? (
                investments.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-medium">{inv.asset_name}</p>
                      <p className="text-xs text-cbx-text-secondary">
                        ${(inv.amount_cents / 100).toFixed(2)} at {inv.return_percent}% ROI
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={statusColors[inv.status]}>{inv.status}</span>
                      <p className="text-xs text-cbx-text-secondary">{new Date(inv.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-cbx-text-secondary py-8">No investments yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
