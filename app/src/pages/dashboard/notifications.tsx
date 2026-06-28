import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell, CheckCircle2, Loader2, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Gift, AlertTriangle } from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  deposit: ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
  investment: TrendingUp,
  reward: Gift,
  alert: AlertTriangle,
};

const typeColors: Record<string, string> = {
  deposit: "text-cbx-success",
  withdrawal: "text-cbx-danger",
  investment: "text-cbx-purple",
  reward: "text-cbx-gold",
  alert: "text-cbx-warning",
};

export function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
    enabled: !!user,
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-cbx-text-secondary mt-1">Stay updated on your account</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()} className="border-white/10">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Mark all read
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-cbx-purple" />
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="divide-y divide-white/[0.04]">
                {notifications.map((n) => {
                  const Icon = typeIcons[n.type] || Bell;
                  const color = typeColors[n.type] || "text-cbx-text-secondary";
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors ${
                        !n.read ? "bg-cbx-purple/[0.02]" : ""
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.replace("text-", "bg-")}/10`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${!n.read ? "text-white" : ""}`}>{n.title}</p>
                        {n.body && <p className="text-sm text-cbx-text-secondary mt-0.5">{n.body}</p>}
                        <p className="text-xs text-cbx-text-secondary mt-1">
                          {new Date(n.created_at).toLocaleDateString()} at{" "}
                          {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-cbx-purple shrink-0 mt-2" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-10 w-10 text-cbx-text-secondary mx-auto mb-3" />
                <p className="text-sm text-cbx-text-secondary">No notifications yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
