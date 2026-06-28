import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";

export function PrivacyPage() {
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
              <Shield className="h-5 w-5 text-cbx-purple" />
            </div>
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
          </div>

          <div className="space-y-4 text-sm text-cbx-text-secondary leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h3 className="text-white font-semibold text-base mt-6">1. Information We Collect</h3>
            <p>We collect personal information you provide during registration, including name, email, and wallet addresses. We also collect usage data and device information.</p>

            <h3 className="text-white font-semibold text-base mt-6">2. How We Use Information</h3>
            <p>Your information is used to provide services, process transactions, verify identity (KYC), and improve the platform.</p>

            <h3 className="text-white font-semibold text-base mt-6">3. Data Security</h3>
            <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits.</p>

            <h3 className="text-white font-semibold text-base mt-6">4. Information Sharing</h3>
            <p>We do not sell your personal data. Information is only shared with service providers necessary for platform operation or when legally required.</p>

            <h3 className="text-white font-semibold text-base mt-6">5. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal information. Contact support for data requests.</p>

            <h3 className="text-white font-semibold text-base mt-6">6. Cookies</h3>
            <p>We use cookies to enhance user experience. You can disable cookies in your browser settings.</p>

            <h3 className="text-white font-semibold text-base mt-6">7. Contact</h3>
            <p>For privacy-related questions, contact us at support@cashbullx.com.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
