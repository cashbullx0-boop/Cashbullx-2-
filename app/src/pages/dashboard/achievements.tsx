import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Lock, Star, Target, Zap, Trophy, TrendingUp, Users, Shield, Flame } from "lucide-react";

const DEFAULT_ACHIEVEMENTS = [
  { code: "first_deposit", title: "First Deposit", description: "Make your first deposit", icon: Target, xp: 100 },
  { code: "first_withdrawal", title: "First Withdrawal", description: "Complete your first withdrawal", icon: Zap, xp: 150 },
  { code: "task_master", title: "Task Master", description: "Complete 10 tasks", icon: Star, xp: 200 },
  { code: "investor", title: "Investor", description: "Make your first investment", icon: TrendingUp, xp: 250 },
  { code: "referral_pro", title: "Referral Pro", description: "Refer 5 friends", icon: Users, xp: 300 },
  { code: "kyc_verified", title: "Verified", description: "Complete KYC verification", icon: Shield, xp: 200 },
  { code: "streak_7", title: "Week Warrior", description: "7-day check-in streak", icon: Flame, xp: 350 },
  { code: "big_earner", title: "Big Earner", description: "Earn $100 total", icon: Trophy, xp: 500 },
];

export function AchievementsPage() {
  const { user } = useAuth();

  const { data: userAchievements } = useQuery({
    queryKey: ["user-achievements", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("user_achievements")
        .select("*, achievement:achievement_id(*)")
        .eq("user_id", user.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const unlockedCodes = new Set((userAchievements ?? []).map((ua: any) => ua.achievement?.code));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">
          Unlock achievements to earn XP and rewards
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {DEFAULT_ACHIEVEMENTS.map((ach, i) => {
          const unlocked = unlockedCodes.has(ach.code);
          const Icon = ach.icon;
          return (
            <motion.div
              key={ach.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card
                className={`h-full transition-all ${
                  unlocked ? "glass-card gradient-border" : "glass-card opacity-60"
                }`}
              >
                <CardContent className="p-5 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                      unlocked
                        ? "bg-gradient-to-br from-cbx-gold/20 to-cbx-warning/10"
                        : "bg-white/[0.04]"
                    }`}
                  >
                    {unlocked ? (
                      <Icon className="h-7 w-7 text-cbx-gold" />
                    ) : (
                      <Lock className="h-7 w-7 text-cbx-text-secondary" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{ach.title}</h3>
                  <p className="text-xs text-cbx-text-secondary mb-3">{ach.description}</p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      unlocked
                        ? "border-cbx-gold/30 text-cbx-gold"
                        : "border-white/10 text-cbx-text-secondary"
                    }`}
                  >
                    {unlocked ? "Unlocked" : `${ach.xp} XP`}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
