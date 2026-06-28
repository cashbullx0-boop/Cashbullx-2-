import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LifeBuoy, Send, Loader2, Clock, MessageCircle, CheckCircle2 } from "lucide-react";

export function SupportPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { data: tickets } = useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const createTicket = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      if (!subject.trim() || !message.trim()) throw new Error("Fill in all fields");
      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
        status: "open",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Ticket created!");
      setSubject("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const statusColors: Record<string, string> = {
    open: "status-pending",
    "in-progress": "status-pending",
    resolved: "status-approved",
    closed: "status-rejected",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Get help from our team</p>
      </motion.div>

      {/* Create Ticket */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-cbx-cyan" />
              New Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="input-dark h-11" placeholder="Brief description of your issue" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input-dark min-h-[100px]" placeholder="Describe your issue in detail..." />
            </div>
            <Button
              onClick={() => createTicket.mutate()}
              disabled={createTicket.isPending}
              className="bg-cbx-purple hover:bg-cbx-purple/90"
            >
              {createTicket.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="mr-2 h-4 w-4" />Submit Ticket</>}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ticket History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Your Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {tickets && tickets.length > 0 ? (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{t.subject}</p>
                      <span className={statusColors[t.status] || "status-pending"}>{t.status}</span>
                    </div>
                    <p className="text-sm text-cbx-text-secondary mb-2">{t.message}</p>
                    {t.admin_reply && (
                      <div className="p-3 rounded-lg bg-cbx-purple/5 border border-cbx-purple/10 mt-2">
                        <p className="text-xs text-cbx-purple font-medium mb-1">Admin Reply:</p>
                        <p className="text-sm text-cbx-text-secondary">{t.admin_reply}</p>
                      </div>
                    )}
                    <p className="text-xs text-cbx-text-secondary mt-2">
                      {new Date(t.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <LifeBuoy className="h-10 w-10 text-cbx-text-secondary mx-auto mb-3" />
                <p className="text-sm text-cbx-text-secondary">No tickets yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
