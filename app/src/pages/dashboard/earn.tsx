import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Sparkles, CheckCircle2, Clock, ExternalLink, BarChart3, Gift, Calendar } from "lucide-react";

export function EarnPage() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: dailyCheckin } = useQuery({
    queryKey: ["daily-checkin", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user.id)
        .eq("checkin_date", today)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const checkinMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await (supabase as any).rpc("daily_checkin", { p_user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Daily check-in completed!");
      queryClient.invalidateQueries({ queryKey: ["daily-checkin"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => toast.error(err.message || "Already checked in today"),
  });

  const canCheckin = !dailyCheckin;
  const streak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;

  // CPX Survey config
  const CPX_APP_ID = 33442;
  const cpxUrl = `https://offers.cpx-research.com/?appid=${CPX_APP_ID}&uid=${user?.id}`;

  const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn}>
        <h1 className="text-2xl font-bold">Earn</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Multiple ways to earn rewards</p>
      </motion.div>

      {/* Daily Check-in */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card className="glass-card gradient-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cbx-gold/20 to-cbx-warning/10 flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-cbx-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Daily Check-in</h3>
                  <p className="text-sm text-cbx-text-secondary">
                    Current streak: <span className="text-cbx-gold font-semibold">{streak} days</span>
                    {" "}(Best: {longestStreak})
                  </p>
                </div>
              </div>
              <Button
                onClick={() => checkinMutation.mutate()}
                disabled={!canCheckin || checkinMutation.isPending}
                className={`h-12 px-6 ${
                  canCheckin
                    ? "bg-cbx-gold hover:bg-cbx-gold/90 text-cbx-dark font-semibold"
                    : "bg-white/5 text-cbx-text-secondary"
                }`}
              >
                {checkinMutation.isPending ? (
                  "Checking..."
                ) : canCheckin ? (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Check In
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-cbx-success" />
                    Checked In
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* CPX Surveys */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card className="glass-card gradient-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cbx-purple/20 to-cbx-cyan/10 flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-cbx-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">CPX Research Surveys</h3>
                  <p className="text-sm text-cbx-text-secondary">
                    Complete surveys and earn up to $5 per survey
                  </p>
                </div>
              </div>
              <a href={cpxUrl} target="_blank" rel="noopener noreferrer">
                <Button className="h-12 px-6 bg-cbx-purple hover:bg-cbx-purple/90">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Start Surveys
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Earn Categories */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Sparkles,
              title: "Complete Tasks",
              desc: "Daily, weekly, and bonus tasks",
              reward: "$0.10 - $5.00",
              link: "/tasks",
              color: "text-cbx-cyan",
              bg: "bg-cbx-cyan/10",
            },
            {
              icon: Gift,
              title: "Achievement Rewards",
              desc: "Unlock achievements for bonuses",
              reward: "Up to $50",
              link: "/achievements",
              color: "text-cbx-gold",
              bg: "bg-cbx-gold/10",
            },
            {
              icon: BarChart3,
              title: "Investment Returns",
              desc: "Daily ROI on your investments",
              reward: "1.2% - 2.5% daily",
              link: "/invest",
              color: "text-cbx-success",
              bg: "bg-cbx-success/10",
            },
          ].map((item) => (
            <a key={item.title} href={item.link}>
              <Card className="glass-card-hover h-full cursor-pointer">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-cbx-text-secondary mb-3">{item.desc}</p>
                  <Badge variant="outline" className="border-cbx-success/30 text-cbx-success">
                    {item.reward}
                  </Badge>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
