import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Crown, Medal, TrendingUp } from "lucide-react";

export function LeaderboardPage() {
  const { data: leaders } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, total_earned_cents, level")
        .order("total_earned_cents", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-cbx-gold" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm text-cbx-text-secondary w-5 text-center">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-cbx-gold/10 to-transparent border-cbx-gold/20";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/5 to-transparent border-white/[0.04]";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/10 to-transparent border-amber-600/20";
    return "border-white/[0.04]";
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Top earners this month</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-cbx-gold" />
              Top Earners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaders && leaders.length > 0 ? (
              leaders.map((leader, i) => {
                const rank = i + 1;
                return (
                  <motion.div
                    key={leader.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-4 p-3 rounded-xl border ${getRankBg(rank)}`}
                  >
                    <div className="w-8 flex items-center justify-center">{getRankIcon(rank)}</div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={leader.avatar_url || undefined} />
                      <AvatarFallback className="bg-cbx-purple/20 text-cbx-purple text-sm">
                        {(leader.full_name || "U").slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{leader.full_name || "Anonymous"}</p>
                      <p className="text-xs text-cbx-text-secondary">Level {leader.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-cbx-success">
                        ${((leader.total_earned_cents ?? 0) / 100).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-10 w-10 text-cbx-text-secondary mx-auto mb-3" />
                <p className="text-sm text-cbx-text-secondary">No data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
