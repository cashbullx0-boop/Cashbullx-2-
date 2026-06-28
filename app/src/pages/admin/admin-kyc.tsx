import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export function AdminKyc() {
  const queryClient = useQueryClient();

  const { data: submissions } = useQuery({
    queryKey: ["admin-kyc"],
    queryFn: async () => {
      const { data } = await supabase
        .from("kyc_submissions")
        .select("*")
        .order("submitted_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: string; status: string; rejection_reason?: string }) => {
      const { error } = await supabase
        .from("kyc_submissions")
        .update({ status: status as any, rejection_reason: rejection_reason || null, reviewed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("KYC updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-kyc"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const statusColors: Record<string, string> = {
    pending: "status-pending",
    approved: "status-approved",
    rejected: "status-rejected",
  };

  const pending = submissions?.filter((s) => s.status === "pending") ?? [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">KYC Review</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Verify user identities</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-cbx-warning/20">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cbx-warning" />
              Pending ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.length > 0 ? (
              pending.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{s.full_legal_name}</p>
                    <span className={statusColors[s.status]}>{s.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-cbx-text-secondary mb-3">
                    <p>ID Type: {s.id_type}</p>
                    <p>ID Number: {s.id_number}</p>
                    <p>Country: {s.country}</p>
                    <p>DOB: {new Date(s.date_of_birth).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateStatus.mutate({ id: s.id, status: "approved" })} className="bg-cbx-success hover:bg-cbx-success/90">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: s.id, status: "rejected", rejection_reason: "Documents unclear" })} className="border-cbx-danger/30 text-cbx-danger hover:bg-cbx-danger/10">
                      <XCircle className="mr-1 h-3 w-3" /> Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-cbx-text-secondary py-4">No pending KYC</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">All Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(submissions ?? []).filter((s) => s.status !== "pending").map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-medium">{s.full_legal_name}</p>
                    <p className="text-xs text-cbx-text-secondary">{s.id_type} | {s.country}</p>
                  </div>
                  <span className={statusColors[s.status]}>{s.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
