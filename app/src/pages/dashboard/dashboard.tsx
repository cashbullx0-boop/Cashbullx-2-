import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Award,
  Clock,
  Zap,
  Crown,
  ChevronRight,
  Sparkles,
  BarChart3,
  Target,
  Wallet,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export function DashboardPage() {
  const { user, profile } = useAuth();

  const { data: recentTxns } = useQuery({
    queryKey: ["recent-transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: activeInvestments } = useQuery({
    queryKey: ["active-investments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: unreadNotifs } = useQuery({
    queryKey: ["unread-notifications", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      return count ?? 0;
    },
    enabled: !!user,
  });

  // Mock chart data - in production this would come from the database
  const chartData = [
    { name: "Mon", earnings: 12 },
    { name: "Tue", earnings: 19 },
    { name: "Wed", earnings: 15 },
    { name: "Thu", earnings: 25 },
    { name: "Fri", earnings: 32 },
    { name: "Sat", earnings: 28 },
    { name: "Sun", earnings: 35 },
  ];

  const balance = (profile?.balance_cents ?? 0) / 100;
  const totalEarned = (profile?.total_earned_cents ?? 0) / 100;
  const level = profile?.level ?? 1;
  const xp = profile?.xp ?? 0;
  const nextLevelXp = level * 1000;
  const xpProgress = Math.min((xp / nextLevelXp) * 100, 100);

  const stats = [
    {
      title: "Wallet Balance",
      value: `$${balance.toFixed(2)}`,
      icon: Wallet,
      color: "text-cbx-purple",
      bg: "bg-cbx-purple/10",
      link: "/wallet",
    },
    {
      title: "Total Earned",
      value: `$${totalEarned.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-cbx-success",
      bg: "bg-cbx-success/10",
      link: "/earn",
    },
    {
      title: "Active Investments",
      value: `${activeInvestments?.length ?? 0}`,
      icon: BarChart3,
      color: "text-cbx-gold",
      bg: "bg-cbx-gold/10",
      link: "/invest",
    },
    {
      title: "Level",
      value: `${level}`,
      icon: Crown,
      color: "text-cbx-cyan",
      bg: "bg-cbx-cyan/10",
      link: "/levels",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div {...fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {profile?.full_name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-sm text-cbx-text-secondary mt-1">
            Here's what's happening with your account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/deposit">
            <Button size="sm" className="bg-cbx-success hover:bg-cbx-success/90 text-white">
              <ArrowDownToLine className="mr-1 h-4 w-4" />
              Deposit
            </Button>
          </Link>
          <Link to="/withdraw">
            <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
              <ArrowUpFromLine className="mr-1 h-4 w-4" />
              Withdraw
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div key={stat.title} variants={fadeInUp} transition={{ delay: i * 0.1 }}>
            <Link to={stat.link}>
              <Card className="glass-card-hover cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-cbx-text-secondary" />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-cbx-text-secondary mt-1">{stat.title}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Level Progress */}
      <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cbx-gold/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-cbx-gold" />
                </div>
                <div>
                  <p className="font-semibold">Level {level}</p>
                  <p className="text-xs text-cbx-text-secondary">{xp} / {nextLevelXp} XP</p>
                </div>
              </div>
              <Link to="/levels">
                <Button variant="ghost" size="sm" className="text-cbx-gold hover:text-cbx-gold/80 hover:bg-cbx-gold/10">
                  View All
                </Button>
              </Link>
            </div>
            <Progress value={xpProgress} className="h-2 bg-white/10" />
            <p className="text-xs text-cbx-text-secondary mt-2">
              {nextLevelXp - xp} XP needed for Level {level + 1}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts & Quick Actions Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cbx-purple" />
                  Weekly Earnings
                </CardTitle>
                <Badge variant="outline" className="border-cbx-success/30 text-cbx-success text-xs">
                  +12.5% this week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6D28D9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#A7B0C0" fontSize={12} />
                  <YAxis stroke="#A7B0C0" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#6D28D9"
                    fillOpacity={1}
                    fill="url(#earningsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-cbx-cyan" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { to: "/tasks", icon: Target, label: "Complete Tasks", desc: "Earn from available tasks" },
                { to: "/earn", icon: Sparkles, label: "Take Surveys", desc: "High-paying CPX surveys" },
                { to: "/invest", icon: TrendingUp, label: "Invest Now", desc: "Daily ROI returns" },
                { to: "/referrals", icon: Users, label: "Invite Friends", desc: "Earn commissions" },
              ].map((action) => (
                <Link key={action.to} to={action.to}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-cbx-purple/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <action.icon className="h-4 w-4 text-cbx-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-cbx-text-secondary">{action.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-cbx-text-secondary shrink-0" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Investments & Recent Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Investments */}
        <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cbx-success" />
                  Active Investments
                </CardTitle>
                <Link to="/invest">
                  <Button variant="ghost" size="sm" className="text-cbx-text-secondary hover:text-white">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {activeInvestments && activeInvestments.length > 0 ? (
                <div className="space-y-3">
                  {activeInvestments.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                      <div>
                        <p className="text-sm font-medium">{inv.asset_name}</p>
                        <p className="text-xs text-cbx-text-secondary">
                          ${(inv.amount_cents / 100).toFixed(2)} invested
                        </p>
                      </div>
                      <Badge className="bg-cbx-success/10 text-cbx-success border-cbx-success/20">
                        +{inv.return_percent}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-10 w-10 text-cbx-text-secondary mx-auto mb-3" />
                  <p className="text-sm text-cbx-text-secondary">No active investments</p>
                  <Link to="/invest">
                    <Button size="sm" className="mt-3 bg-cbx-purple hover:bg-cbx-purple/90">
                      Start Investing
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cbx-cyan" />
                  Recent Activity
                </CardTitle>
                <Link to="/wallet">
                  <Button variant="ghost" size="sm" className="text-cbx-text-secondary hover:text-white">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentTxns && recentTxns.length > 0 ? (
                <div className="space-y-2">
                  {recentTxns.slice(0, 5).map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          txn.amount_cents > 0 ? "bg-cbx-success/10" : "bg-cbx-danger/10"
                        }`}>
                          {txn.amount_cents > 0 ? (
                            <ArrowDownToLine className="h-3.5 w-3.5 text-cbx-success" />
                          ) : (
                            <ArrowUpFromLine className="h-3.5 w-3.5 text-cbx-danger" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">{txn.type.replace(/_/g, " ")}</p>
                          <p className="text-xs text-cbx-text-secondary">
                            {new Date(txn.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${txn.amount_cents > 0 ? "text-cbx-success" : "text-cbx-danger"}`}>
                        {txn.amount_cents > 0 ? "+" : ""}${(txn.amount_cents / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-10 w-10 text-cbx-text-secondary mx-auto mb-3" />
                  <p className="text-sm text-cbx-text-secondary">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


