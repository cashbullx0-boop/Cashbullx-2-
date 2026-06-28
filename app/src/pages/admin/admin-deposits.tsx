import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowDownToLine, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function AdminDeposits() {
  const queryClient = useQueryClient();

  const { data: deposits } = useQuery({
    queryKey: ["admin-deposits"],
    queryFn: async () => {
      const { data } = await supabase
        .from("deposits")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: string; status: string; rejection_reason?: string }) => {
      const { error } = await supabase
        .from("deposits")
        .update({ status: status as any, rejection_reason: rejection_reason || null, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deposit updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-deposits"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const statusColors: Record<string, string> = {
    pending: "status-pending",
    confirming: "status-pending",
    approved: "status-approved",
    completed: "status-approved",
    failed: "status-rejected",
    expired: "status-rejected",
  };

  const pendingDeposits = deposits?.filter((d) => d.status === "pending") ?? [];
  const otherDeposits = deposits?.filter((d) => d.status !== "pending") ?? [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Deposits</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Review and manage deposit requests</p>
      </motion.div>

      {/* Pending Deposits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-cbx-warning/20">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4 text-cbx-warning" />
              Pending Review ({pendingDeposits.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingDeposits.length > 0 ? (
              pendingDeposits.map((d) => (
                <div key={d.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">${d.amount_usd.toFixed(2)} {d.network}</p>
                      <p className="text-xs text-cbx-text-secondary font-mono">{d.user_id.slice(0, 8)}...</p>
                    </div>
                    <span className={statusColors[d.status]}>{d.status}</span>
                  </div>
                  <p className="text-xs text-cbx-text-secondary mb-3">{new Date(d.created_at).toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateStatus.mutate({ id: d.id, status: "approved" })}
                      disabled={updateStatus.isPending}
                      className="bg-cbx-success hover:bg-cbx-success/90"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus.mutate({ id: d.id, status: "failed", rejection_reason: "Invalid transaction" })}
                      disabled={updateStatus.isPending}
                      className="border-cbx-danger/30 text-cbx-danger hover:bg-cbx-danger/10"
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-cbx-text-secondary py-4">No pending deposits</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* All Deposits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">All Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {otherDeposits.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-medium">${d.amount_usd.toFixed(2)} {d.network}</p>
                    <p className="text-xs text-cbx-text-secondary">{new Date(d.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={statusColors[d.status]}>{d.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
