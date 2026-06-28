import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle } from "lucide-react";

export function FAQPage() {
  const faqs = [
    { q: "How do I start earning?", a: "Create an account, verify your email, and start completing tasks, surveys, or making investments." },
    { q: "What is the minimum withdrawal?", a: "The minimum withdrawal is $10 in USDT (TRC20)." },
    { q: "How does the referral program work?", a: "Share your referral link. Earn $1 per signup plus commissions on their earnings." },
    { q: "Is KYC required?", a: "KYC is required for withdrawals and full platform access." },
    { q: "How long do withdrawals take?", a: "Withdrawals are processed within 24-48 hours after admin approval." },
    { q: "What payment methods are accepted?", a: "We accept USDT deposits via TRC20 and BEP20 networks." },
    { q: "Is there a deposit minimum?", a: "Yes, the minimum deposit is $50." },
    { q: "How do investments work?", a: "Choose a plan, deposit funds, and receive daily ROI automatically." },
  ];

  return (
    <div className="min-h-screen bg-cbx-dark bg-gradient-mesh">
      <div className="section-container py-8 max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-cbx-text-secondary hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cbx-purple/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-cbx-purple" />
              </div>
              <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
            </div>
            <p className="text-cbx-text-secondary">Find answers to common questions</p>
          </div>

          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-sm text-cbx-text-secondary">{faq.a}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
