import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown, Star, Target, Zap, Shield, Trophy, Flame } from "lucide-react";

const LEVELS = [
  { level: 1, name: "Rookie", minXp: 0, color: "text-gray-400", icon: Star },
  { level: 2, name: "Beginner", minXp: 1000, color: "text-cbx-cyan", icon: Target },
  { level: 3, name: "Explorer", minXp: 2500, color: "text-cbx-cyan", icon: Zap },
  { level: 4, name: "Trader", minXp: 5000, color: "text-cbx-purple", icon: TrendingUp },
  { level: 5, name: "Investor", minXp: 10000, color: "text-cbx-purple", icon: Shield },
  { level: 6, name: "Pro", minXp: 20000, color: "text-cbx-gold", icon: Crown },
  { level: 7, name: "Elite", minXp: 50000, color: "text-cbx-gold", icon: Trophy },
  { level: 8, name: "Legend", minXp: 100000, color: "text-orange-500", icon: Flame },
];

function TrendingUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export function LevelsPage() {
  const { profile } = useAuth();
  const currentLevel = profile?.level ?? 1;
  const currentXp = profile?.xp ?? 0;
  const nextLevel = LEVELS.find((l) => l.level === currentLevel + 1);
  const nextLevelXp = nextLevel ? nextLevel.minXp : LEVELS[LEVELS.length - 1].minXp;
  const progress = nextLevel ? ((currentXp - (LEVELS.find((l) => l.level === currentLevel)?.minXp ?? 0)) / (nextLevelXp - (LEVELS.find((l) => l.level === currentLevel)?.minXp ?? 0))) * 100 : 100;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Levels</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Level up to unlock rewards</p>
      </motion.div>

      {/* Current Level */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card gradient-border">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cbx-gold/20 to-cbx-warning/10 flex items-center justify-center mx-auto mb-4">
              <Crown className="h-10 w-10 text-cbx-gold" />
            </div>
            <h2 className="text-3xl font-bold mb-1">Level {currentLevel}</h2>
            <p className="text-lg text-cbx-gold mb-2">{LEVELS.find((l) => l.level === currentLevel)?.name || "Rookie"}</p>
            <div className="max-w-md mx-auto">
              <Progress value={Math.max(0, Math.min(100, progress))} className="h-3 bg-white/10" />
              <div className="flex items-center justify-between mt-2 text-xs text-cbx-text-secondary">
                <span>{currentXp} XP</span>
                <span>{nextLevelXp} XP</span>
              </div>
            </div>
            {nextLevel && (
              <p className="text-sm text-cbx-text-secondary mt-3">
                {nextLevelXp - currentXp} XP needed for Level {nextLevel.level} - {nextLevel.name}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Level List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-3"
      >
        {LEVELS.map((level, i) => {
          const Icon = level.icon;
          const isUnlocked = currentLevel >= level.level;
          const isCurrent = currentLevel === level.level;
          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`glass-card ${isCurrent ? "border-cbx-gold/30" : ""}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isUnlocked
                        ? level.color.replace("text-", "bg-") + "/10"
                        : "bg-white/[0.04]"
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isUnlocked ? level.color : "text-cbx-text-secondary"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${isCurrent ? "text-cbx-gold" : ""}`}>
                        Level {level.level} - {level.name}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] bg-cbx-gold/20 text-cbx-gold px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-cbx-text-secondary">{level.minXp.toLocaleString()} XP required</p>
                  </div>
                  {isUnlocked ? (
                    <Star className="h-5 w-5 text-cbx-gold fill-cbx-gold" />
                  ) : (
                    <Star className="h-5 w-5 text-cbx-text-secondary" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
