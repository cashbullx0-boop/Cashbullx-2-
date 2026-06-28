import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function AMLPage() {
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
              <ShieldCheck className="h-5 w-5 text-cbx-purple" />
            </div>
            <h1 className="text-2xl font-bold">Anti-Money Laundering Policy</h1>
          </div>

          <div className="space-y-4 text-sm text-cbx-text-secondary leading-relaxed">
            <h3 className="text-white font-semibold text-base mt-6">1. Compliance</h3>
            <p>CashBullX is committed to preventing money laundering and terrorist financing. We comply with all applicable laws and regulations.</p>

            <h3 className="text-white font-semibold text-base mt-6">2. Customer Identification</h3>
            <p>All users must complete identity verification (KYC) before using certain platform features. We verify identity using government-issued documents.</p>

            <h3 className="text-white font-semibold text-base mt-6">3. Transaction Monitoring</h3>
            <p>We monitor transactions for suspicious activity. Unusual patterns may be flagged for review.</p>

            <h3 className="text-white font-semibold text-base mt-6">4. Record Keeping</h3>
            <p>We maintain records of all transactions and identification documents as required by law.</p>

            <h3 className="text-white font-semibold text-base mt-6">5. Reporting</h3>
            <p>We report suspicious activities to relevant authorities as required by law.</p>

            <h3 className="text-white font-semibold text-base mt-6">6. Prohibited Activities</h3>
            <p>Users may not use the platform for illegal activities, including money laundering, terrorist financing, or sanctions evasion.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
