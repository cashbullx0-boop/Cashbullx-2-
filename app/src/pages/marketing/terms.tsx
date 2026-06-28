import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-cbx-dark bg-gradient-mesh">
      <div className="section-container py-8 max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-cbx-text-secondary hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cbx-purple/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-cbx-purple" />
            </div>
            <h1 className="text-2xl font-bold">Terms of Service</h1>
          </div>

          <div className="space-y-4 text-sm text-cbx-text-secondary leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h3 className="text-white font-semibold text-base mt-6">1. Acceptance of Terms</h3>
            <p>By accessing and using CashBullX, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>

            <h3 className="text-white font-semibold text-base mt-6">2. Eligibility</h3>
            <p>You must be at least 18 years old to use CashBullX. By using the platform, you represent that you meet this requirement.</p>

            <h3 className="text-white font-semibold text-base mt-6">3. Account Registration</h3>
            <p>You must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials.</p>

            <h3 className="text-white font-semibold text-base mt-6">4. Earnings and Withdrawals</h3>
            <p>All earnings are subject to verification. Withdrawals require KYC completion. Minimum withdrawal is $10. We reserve the right to review any transaction.</p>

            <h3 className="text-white font-semibold text-base mt-6">5. Prohibited Activities</h3>
            <p>Users may not use bots, create multiple accounts, or engage in fraudulent activities. Violations will result in account termination.</p>

            <h3 className="text-white font-semibold text-base mt-6">6. Investment Risk</h3>
            <p>All investments carry risk. Past performance does not guarantee future returns. Only invest what you can afford to lose.</p>

            <h3 className="text-white font-semibold text-base mt-6">7. Modifications</h3>
            <p>We may modify these terms at any time. Continued use constitutes acceptance of changes.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
