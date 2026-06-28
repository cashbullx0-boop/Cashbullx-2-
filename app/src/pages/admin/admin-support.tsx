import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LifeBuoy, Send, CheckCircle2, Loader2 } from "lucide-react";

export function AdminSupport() {
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const { data: tickets } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const { error } = await supabase
        .from("support_tickets")
        .update({ admin_reply: reply, status: "resolved", updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Reply sent!");
      setReplyingTo(null);
      setReply("");
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const statusColors: Record<string, string> = {
    open: "status-pending",
    "in-progress": "status-pending",
    resolved: "status-approved",
    closed: "status-rejected",
  };

  const openTickets = tickets?.filter((t) => t.status === "open") ?? [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Manage user support requests</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-cbx-warning/20">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-cbx-warning" />
              Open Tickets ({openTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {openTickets.length > 0 ? (
              openTickets.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{t.subject}</p>
                    <span className={statusColors[t.status]}>{t.status}</span>
                  </div>
                  <p className="text-sm text-cbx-text-secondary mb-3">{t.message}</p>
                  {replyingTo === t.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type your reply..."
                        className="input-dark"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)} className="border-white/10">
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => replyMutation.mutate({ id: t.id, reply })}
                          disabled={replyMutation.isPending}
                          className="bg-cbx-purple hover:bg-cbx-purple/90"
                        >
                          {replyMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Send className="mr-1 h-3 w-3" />Send Reply</>}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setReplyingTo(t.id)} className="border-white/10">
                      Reply
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-cbx-text-secondary py-4">No open tickets</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">All Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(tickets ?? []).filter((t) => t.status !== "open").map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-medium">{t.subject}</p>
                    {t.admin_reply && <p className="text-xs text-cbx-purple">Replied</p>}
                  </div>
                  <span className={statusColors[t.status]}>{t.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
