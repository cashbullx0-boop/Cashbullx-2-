import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowUpFromLine, CheckCircle2, XCircle } from "lucide-react";

export function AdminWithdrawals() {
  const queryClient = useQueryClient();

  const { data: withdrawals } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: async () => {
      const { data } = await supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: string; status: string; rejection_reason?: string }) => {
      const { error } = await supabase
        .from("withdrawals")
        .update({ status: status as any, rejection_reason: rejection_reason || null, processed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Withdrawal updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const statusColors: Record<string, string> = {
    pending: "status-pending",
    processing: "status-pending",
    approved: "status-approved",
    rejected: "status-rejected",
  };

  const pending = withdrawals?.filter((w) => w.status === "pending") ?? [];
  const others = withdrawals?.filter((w) => w.status !== "pending") ?? [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Withdrawals</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Review withdrawal requests</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-cbx-warning/20">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ArrowUpFromLine className="h-4 w-4 text-cbx-warning" />
              Pending ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.length > 0 ? (
              pending.map((w) => (
                <div key={w.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">${(w.amount_cents / 100).toFixed(2)}</p>
                    <span className={statusColors[w.status]}>{w.status}</span>
                  </div>
                  <p className="text-xs text-cbx-text-secondary font-mono mb-1">{w.wallet_address}</p>
                  <p className="text-xs text-cbx-text-secondary mb-3">{new Date(w.created_at).toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateStatus.mutate({ id: w.id, status: "approved" })} className="bg-cbx-success hover:bg-cbx-success/90">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: w.id, status: "rejected", rejection_reason: "Invalid request" })} className="border-cbx-danger/30 text-cbx-danger hover:bg-cbx-danger/10">
                      <XCircle className="mr-1 h-3 w-3" /> Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-cbx-text-secondary py-4">No pending withdrawals</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {others.map((w) => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-medium">${(w.amount_cents / 100).toFixed(2)}</p>
                    <p className="text-xs text-cbx-text-secondary">{new Date(w.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={statusColors[w.status]}>{w.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
