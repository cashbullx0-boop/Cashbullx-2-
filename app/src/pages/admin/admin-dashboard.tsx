import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldCheck,
  TrendingUp,
  LifeBuoy,
  DollarSign,
  BarChart3,
  ChevronRight,
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

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: pendingDeposits },
        { count: pendingWithdrawals },
        { count: pendingKyc },
        { count: openTickets },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("deposits").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("withdrawals").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("kyc_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
      ]);
      return { totalUsers, pendingDeposits, pendingWithdrawals, pendingKyc, openTickets };
    },
  });

  const chartData = [
    { name: "Mon", deposits: 1200, withdrawals: 800 },
    { name: "Tue", deposits: 1900, withdrawals: 1200 },
    { name: "Wed", deposits: 1500, withdrawals: 900 },
    { name: "Thu", deposits: 2500, withdrawals: 1400 },
    { name: "Fri", deposits: 3200, withdrawals: 1800 },
    { name: "Sat", deposits: 2800, withdrawals: 1600 },
    { name: "Sun", deposits: 3500, withdrawals: 2000 },
  ];

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-cbx-cyan", bg: "bg-cbx-cyan/10", link: "/admin/users" },
    { title: "Pending Deposits", value: stats?.pendingDeposits ?? 0, icon: ArrowDownToLine, color: "text-cbx-success", bg: "bg-cbx-success/10", link: "/admin/deposits" },
    { title: "Pending Withdrawals", value: stats?.pendingWithdrawals ?? 0, icon: ArrowUpFromLine, color: "text-cbx-warning", bg: "bg-cbx-warning/10", link: "/admin/withdrawals" },
    { title: "Pending KYC", value: stats?.pendingKyc ?? 0, icon: ShieldCheck, color: "text-cbx-purple", bg: "bg-cbx-purple/10", link: "/admin/kyc" },
    { title: "Open Tickets", value: stats?.openTickets ?? 0, icon: LifeBuoy, color: "text-cbx-danger", bg: "bg-cbx-danger/10", link: "/admin/support" },
  ];

  const quickLinks = [
    { to: "/admin/users", label: "User Management", icon: Users, desc: "View and manage users" },
    { to: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine, desc: "Review deposit requests" },
    { to: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine, desc: "Process withdrawals" },
    { to: "/admin/kyc", label: "KYC Review", icon: ShieldCheck, desc: "Verify user identities" },
    { to: "/admin/investments", label: "Investments", icon: TrendingUp, desc: "Monitor investments" },
    { to: "/admin/support", label: "Support Tickets", icon: LifeBuoy, desc: "Handle support requests" },
    { to: "/admin/referrals", label: "Referrals", icon: Users, desc: "View referral network" },
  ];

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn}>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Platform overview and management</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.title} {...fadeIn} transition={{ delay: i * 0.05 }}>
            <Link to={stat.link}>
              <Card className="glass-card-hover cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-cbx-text-secondary">{stat.title}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cbx-purple" />
              Weekly Deposits vs Withdrawals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="depositGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="withdrawGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#A7B0C0" fontSize={12} />
                <YAxis stroke="#A7B0C0" fontSize={12} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff" }} />
                <Area type="monotone" dataKey="deposits" stroke="#10B981" fill="url(#depositGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="withdrawals" stroke="#EF4444" fill="url(#withdrawGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Card className="glass-card-hover group cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cbx-purple/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <link.icon className="h-5 w-5 text-cbx-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{link.label}</p>
                    <p className="text-xs text-cbx-text-secondary">{link.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-cbx-text-secondary shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
