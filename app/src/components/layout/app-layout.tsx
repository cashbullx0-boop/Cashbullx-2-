import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ListChecks,
  Sparkles,
  Crown,
  Trophy,
  Award,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Users,
  Bell,
  User,
  LifeBuoy,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Shield,
  KeyRound,
  Smartphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const mainNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/earn", label: "Earn", icon: Sparkles },
  { to: "/levels", label: "Levels", icon: Crown },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/achievements", label: "Achievements", icon: Award },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/deposit", label: "Deposit", icon: ArrowDownToLine },
  { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/invest", label: "Invest", icon: TrendingUp },
  { to: "/referrals", label: "Referrals", icon: Users },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/kyc", label: "KYC", icon: ShieldCheck },
  { to: "/support", label: "Support", icon: LifeBuoy },
];

const adminNavItems = [
  { to: "/admin", label: "Overview", icon: Shield },
  { to: "/admin/kyc", label: "KYC Review", icon: ShieldCheck },
  { to: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine },
  { to: "/admin/investments", label: "Investments", icon: TrendingUp },
  { to: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/support", label: "Support", icon: LifeBuoy },
  { to: "/admin/referrals", label: "Referrals", icon: Users },
];

export function AppLayout() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const loadUnread = () =>
      supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false)
        .then(({ count }) => setUnreadCount(count ?? 0));

    loadUnread();
    const ch = supabase
      .channel(`notif:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        loadUnread
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setUnreadCount(0);
  };

  const isActive = (path: string) => location.pathname === path;

  const sidebarWidth = sidebarCollapsed ? "w-20" : "w-64";

  return (
    <div className="min-h-screen flex bg-cbx-dark">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex ${sidebarWidth} shrink-0 flex-col glass-strong border-r border-white/[0.06] transition-all duration-300 fixed h-screen z-30`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold brand-text"
              >
                CashBullX
              </motion.span>
            )}
            {sidebarCollapsed && <span className="text-xl font-bold brand-text mx-auto">CBX</span>}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-lg hover:bg-white/5 text-cbx-text-secondary"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User Profile Mini */}
        <div className="px-3 pb-3 mb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-9 w-9 ring-2 ring-cbx-purple/30 shrink-0">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-cbx-purple/20 text-cbx-purple text-sm font-medium">
                {(profile?.full_name ?? user?.email ?? "U").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                <p className="text-sm font-medium truncate">{profile?.full_name ?? "User"}</p>
                <p className="text-[10px] text-cbx-text-secondary truncate">{user?.email}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto custom-scrollbar px-2 py-2">
          {mainNavItems.map((item) => {
            const active = isActive(item.to);
            const isNotif = item.to === "/notifications";
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (isNotif) markAllRead();
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 group ${
                  active
                    ? "bg-cbx-purple/15 text-cbx-purple shadow-[inset_0_0_0_1px] shadow-cbx-purple/20"
                    : "text-cbx-text-secondary hover:bg-white/5 hover:text-white"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-cbx-purple" : ""}`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {isNotif && unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5 text-[10px]">
                        {unreadCount}
                      </Badge>
                    )}
                  </>
                )}
                {sidebarCollapsed && isNotif && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cbx-danger" />
                )}
              </Link>
            );
          })}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className={`px-3 pt-4 pb-1 ${sidebarCollapsed ? "text-center" : ""}`}>
                {!sidebarCollapsed && (
                  <span className="text-[10px] uppercase tracking-wider text-cbx-gold/70 font-semibold">
                    Admin Panel
                  </span>
                )}
                {sidebarCollapsed && <div className="h-px bg-cbx-gold/20 mx-2" />}
              </div>
              {adminNavItems.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                      active
                        ? "bg-cbx-gold/15 text-cbx-gold"
                        : "text-cbx-text-secondary hover:bg-white/5 hover:text-white"
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-cbx-gold" : ""}`} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="px-2 py-2 mb-2">
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-cbx-text-secondary">Balance</p>
                  <p className="text-sm font-semibold text-white">
                    ${((profile?.balance_cents ?? 0) / 100).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-cbx-text-secondary">Level</p>
                  <p className="text-sm font-semibold text-cbx-gold">{profile?.level ?? 1}</p>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start text-cbx-text-secondary hover:text-cbx-danger hover:bg-cbx-danger/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!sidebarCollapsed && "Sign out"}
          </Button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 glass-strong border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-lg font-bold brand-text">
          CashBullX
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="relative p-2">
            <Bell className="h-5 w-5 text-cbx-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-cbx-danger text-[9px] flex items-center justify-center text-white font-bold">
                {unreadCount}
              </span>
            )}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[85vw] max-w-xs glass-strong border-r border-white/[0.06] flex flex-col overflow-y-auto z-50"
            >
              <div className="flex items-center justify-between p-4">
                <span className="text-xl font-bold brand-text">CashBullX</span>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="px-4 pb-3 mb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-cbx-purple/30">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-cbx-purple/20 text-cbx-purple">
                      {(profile?.full_name ?? user?.email ?? "U").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{profile?.full_name ?? "User"}</p>
                    <p className="text-xs text-cbx-text-secondary">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 px-1">
                  <div>
                    <p className="text-[10px] text-cbx-text-secondary">Balance</p>
                    <p className="text-sm font-semibold">${((profile?.balance_cents ?? 0) / 100).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-cbx-text-secondary">Level</p>
                    <p className="text-sm font-semibold text-cbx-gold">{profile?.level ?? 1}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 space-y-0.5 px-3 py-2">
                {mainNavItems.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        setSidebarOpen(false);
                        if (item.to === "/notifications") markAllRead();
                      }}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                        active
                          ? "bg-cbx-purple/15 text-cbx-purple"
                          : "text-cbx-text-secondary hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      <span className="flex-1">{item.label}</span>
                      {item.to === "/notifications" && unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5 text-[10px]">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}

                {isAdmin && (
                  <>
                    <div className="px-3 pt-4 pb-1">
                      <span className="text-[10px] uppercase tracking-wider text-cbx-gold/70 font-semibold">
                        Admin Panel
                      </span>
                    </div>
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                          isActive(item.to)
                            ? "bg-cbx-gold/15 text-cbx-gold"
                            : "text-cbx-text-secondary hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-[18px] w-[18px]" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </>
                )}
              </nav>

              <div className="border-t border-white/[0.06] p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSidebarOpen(false);
                    signOut();
                  }}
                  className="w-full justify-start text-cbx-text-secondary hover:text-cbx-danger"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"} transition-all duration-300`}>
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-8 pb-24 lg:pb-8 bg-gradient-mesh">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
