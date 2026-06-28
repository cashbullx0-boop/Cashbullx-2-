import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import { queryClient } from "@/lib/query-client";
import { AppLayout } from "@/components/layout/app-layout";
import { LandingPage } from "@/pages/marketing/landing-page";
import { LoginPage } from "@/pages/auth/login";
import { SignupPage } from "@/pages/auth/signup";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password";
import { ResetPasswordPage } from "@/pages/auth/reset-password";
import { DashboardPage } from "@/pages/dashboard/dashboard";
import { WalletPage } from "@/pages/dashboard/wallet";
import { DepositPage } from "@/pages/dashboard/deposit";
import { WithdrawPage } from "@/pages/dashboard/withdraw";
import { EarnPage } from "@/pages/dashboard/earn";
import { TasksPage } from "@/pages/dashboard/tasks";
import { InvestPage } from "@/pages/dashboard/invest";
import { ReferralsPage } from "@/pages/dashboard/referrals";
import { KycPage } from "@/pages/dashboard/kyc";
import { SupportPage } from "@/pages/dashboard/support";
import { NotificationsPage } from "@/pages/dashboard/notifications";
import { ProfilePage } from "@/pages/dashboard/profile";
import { AchievementsPage } from "@/pages/dashboard/achievements";
import { LeaderboardPage } from "@/pages/dashboard/leaderboard";
import { LevelsPage } from "@/pages/dashboard/levels";
import { AdminDashboard } from "@/pages/admin/admin-dashboard";
import { AdminUsers } from "@/pages/admin/admin-users";
import { AdminDeposits } from "@/pages/admin/admin-deposits";
import { AdminWithdrawals } from "@/pages/admin/admin-withdrawals";
import { AdminKyc } from "@/pages/admin/admin-kyc";
import { AdminInvestments } from "@/pages/admin/admin-investments";
import { AdminSupport } from "@/pages/admin/admin-support";
import { AdminReferrals } from "@/pages/admin/admin-referrals";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { AdminRoute } from "@/components/layout/admin-route";
import { RefRedirectPage } from "@/pages/marketing/ref-redirect";
import { TermsPage } from "@/pages/marketing/terms";
import { PrivacyPage } from "@/pages/marketing/privacy";
import { FAQPage } from "@/pages/marketing/faq";
import { AMLPage } from "@/pages/marketing/aml";
import { RefundPage } from "@/pages/marketing/refund";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/ref/:username" element={<RefRedirectPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/aml" element={<AMLPage />} />
            <Route path="/refund" element={<RefundPage />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/deposit" element={<DepositPage />} />
                <Route path="/withdraw" element={<WithdrawPage />} />
                <Route path="/earn" element={<EarnPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/invest" element={<InvestPage />} />
                <Route path="/referrals" element={<ReferralsPage />} />
                <Route path="/kyc" element={<KycPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/levels" element={<LevelsPage />} />

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/deposits" element={<AdminDeposits />} />
                  <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
                  <Route path="/admin/kyc" element={<AdminKyc />} />
                  <Route path="/admin/investments" element={<AdminInvestments />} />
                  <Route path="/admin/support" element={<AdminSupport />} />
                  <Route path="/admin/referrals" element={<AdminReferrals />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
