import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCcw } from "lucide-react";

export function RefundPage() {
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
              <RefreshCcw className="h-5 w-5 text-cbx-purple" />
            </div>
            <h1 className="text-2xl font-bold">Refund Policy</h1>
          </div>

          <div className="space-y-4 text-sm text-cbx-text-secondary leading-relaxed">
            <h3 className="text-white font-semibold text-base mt-6">1. General Policy</h3>
            <p>All deposits and investments are final. Refunds are only granted in exceptional circumstances at our discretion.</p>

            <h3 className="text-white font-semibold text-base mt-6">2. Investment Refunds</h3>
            <p>Investment plans cannot be cancelled once activated. Principal is returned at the end of the investment period as specified in the plan terms.</p>

            <h3 className="text-white font-semibold text-base mt-6">3. Technical Errors</h3>
            <p>If a technical error results in an incorrect charge, contact support within 48 hours for review.</p>

            <h3 className="text-white font-semibold text-base mt-6">4. Fraudulent Activity</h3>
            <p>Accounts involved in fraudulent activity will be terminated without refund.</p>

            <h3 className="text-white font-semibold text-base mt-6">5. Processing Time</h3>
            <p>Approved refunds are processed within 5-7 business days to the original payment method.</p>

            <h3 className="text-white font-semibold text-base mt-6">6. Contact</h3>
            <p>For refund requests, contact support@cashbullx.com with your transaction details.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
