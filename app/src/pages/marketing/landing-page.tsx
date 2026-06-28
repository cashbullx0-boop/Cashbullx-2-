import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Award,
  Globe,
  ChevronDown,
  Sparkles,
  BarChart3,
  Lock,
  ListChecks,
  Wallet,
  CheckCircle2,
  Star,
  Play,
} from "lucide-react";
import { useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: {},
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-cbx-dark overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-white/[0.06]">
        <div className="section-container flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold brand-text">
            CashBullX
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Features</a>
            <a href="#invest" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Invest</a>
            <a href="#referral" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Referral</a>
            <a href="#faq" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-cbx-text-secondary hover:text-white">
                Sign in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-cbx-purple hover:bg-cbx-purple/90 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cbx-purple/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cbx-cyan/10 rounded-full blur-[128px]" />

        <div className="relative section-container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cbx-purple/10 border border-cbx-purple/20 text-cbx-purple text-sm mb-8"
            >
              <Sparkles className="h-4 w-4" />
              <span>The Future of Earning is Here</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-white">Earn. Invest.</span>
              <br />
              <span className="brand-text">Grow Wealth.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-cbx-text-secondary max-w-2xl mx-auto mb-10"
            >
              CashBullX is the premier earning platform where you can complete tasks,
              take surveys, invest with daily ROI, and build passive income through
              our powerful referral system.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-cbx-purple hover:bg-cbx-purple/90 text-white px-8 h-14 text-lg rounded-2xl shadow-glow"
                >
                  Start Earning Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 text-white px-8 h-14 text-lg rounded-2xl"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {[
                { label: "Active Users", value: "50K+", suffix: "" },
                { label: "Total Paid Out", value: "$2.5", suffix: "M+" },
                { label: "Daily ROI", value: "up to 2.5", suffix: "%" },
                { label: "Countries", value: "120+", suffix: "" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}{stat.suffix}</p>
                  <p className="text-xs text-cbx-text-secondary mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 text-cbx-text-secondary" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cbx-purple/30 to-transparent" />
        <div className="section-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-cbx-cyan text-sm font-medium uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
              Everything You Need to <span className="text-gradient-purple">Earn & Grow</span>
            </h2>
            <p className="text-cbx-text-secondary max-w-2xl mx-auto">
              A complete ecosystem designed to maximize your earnings through multiple income streams.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: ListChecks,
                title: "Complete Tasks",
                description: "Earn money by completing daily, weekly, video, and bonus tasks. Simple actions, real rewards.",
                color: "text-cbx-cyan",
                bg: "bg-cbx-cyan/10",
              },
              {
                icon: BarChart3,
                title: "Take Surveys",
                description: "Share your opinion and get paid. Our CPX Research integration offers high-paying surveys.",
                color: "text-cbx-purple",
                bg: "bg-cbx-purple/10",
              },
              {
                icon: TrendingUp,
                title: "Smart Investments",
                description: "Invest with daily ROI returns. Choose from multiple plans with transparent profit tracking.",
                color: "text-cbx-success",
                bg: "bg-cbx-success/10",
              },
              {
                icon: Users,
                title: "Referral System",
                description: "Build your network and earn commissions. Multi-level referral tree with bonus rewards.",
                color: "text-cbx-gold",
                bg: "bg-cbx-gold/10",
              },
              {
                icon: Shield,
                title: "Bank-Grade Security",
                description: "Your funds and data are protected with enterprise-level security, KYC verification, and fraud detection.",
                color: "text-cbx-purple",
                bg: "bg-cbx-purple/10",
              },
              {
                icon: Award,
                title: "Achievement Rewards",
                description: "Unlock achievements, level up, and earn bonus rewards. Gamified earning experience.",
                color: "text-cbx-cyan",
                bg: "bg-cbx-cyan/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-cbx-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section id="invest" className="py-24 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cbx-gold/30 to-transparent" />
        <div className="section-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-cbx-gold text-sm font-medium uppercase tracking-wider">Investment Plans</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
              Invest Smarter, <span className="text-gradient">Earn Daily</span>
            </h2>
            <p className="text-cbx-text-secondary max-w-2xl mx-auto">
              Choose from our carefully designed investment plans with competitive daily returns.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                name: "Starter",
                min: "$50",
                dailyRoi: "1.2%",
                period: "30 days",
                features: ["Daily payouts", "Principal return", "Email support"],
                popular: false,
                color: "from-cbx-cyan/20 to-cbx-cyan/5",
              },
              {
                name: "Pro",
                min: "$500",
                dailyRoi: "1.8%",
                period: "45 days",
                features: ["Daily payouts", "Principal return", "Priority support", "Achievement bonus"],
                popular: true,
                color: "from-cbx-purple/20 to-cbx-purple/5",
              },
              {
                name: "Elite",
                min: "$2,000",
                dailyRoi: "2.5%",
                period: "60 days",
                features: ["Daily payouts", "Principal return", "VIP support", "Referral boost", "Exclusive rewards"],
                popular: false,
                color: "from-cbx-gold/20 to-cbx-gold/5",
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={staggerItem}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass-card p-6 ${plan.popular ? "border-cbx-purple/30" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-cbx-purple text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`h-32 rounded-xl bg-gradient-to-b ${plan.color} flex items-center justify-center mb-6`}>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{plan.dailyRoi}</p>
                    <p className="text-sm text-cbx-text-secondary">Daily ROI</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold">{plan.min}</span>
                  <span className="text-sm text-cbx-text-secondary">minimum</span>
                </div>
                <p className="text-sm text-cbx-text-secondary mb-4">{plan.period} investment period</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-cbx-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="block">
                  <Button className={`w-full ${plan.popular ? "bg-cbx-purple hover:bg-cbx-purple/90" : "bg-white/10 hover:bg-white/20"}`}>
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Referral Section */}
      <section id="referral" className="py-24 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cbx-cyan/30 to-transparent" />
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div {...fadeInUp}>
              <span className="text-cbx-cyan text-sm font-medium uppercase tracking-wider">Referral Program</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
                Earn <span className="text-gradient">Together</span>
              </h2>
              <p className="text-cbx-text-secondary mb-6 leading-relaxed">
                Invite friends and earn commissions on their activity. Our multi-level referral system
                rewards you for building a strong network. The more active your referrals, the more you earn.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Users, text: "Earn $1 bonus per referral signup" },
                  { icon: TrendingUp, text: "Commission on referral earnings" },
                  { icon: Award, text: "Level up with referral achievements" },
                  { icon: Globe, text: "No limit on number of referrals" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cbx-cyan/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-cbx-cyan" />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup">
                <Button className="bg-cbx-cyan hover:bg-cbx-cyan/90 text-cbx-dark font-semibold">
                  Join the Program
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="glass-card p-8"
            >
              <h3 className="text-xl font-bold mb-6 text-center">Referral Commission Structure</h3>
              <div className="space-y-4">
                {[
                  { level: "Level 1", desc: "Direct referrals", rate: "10%" },
                  { level: "Level 2", desc: "Referrals of referrals", rate: "5%" },
                  { level: "Level 3", desc: "Extended network", rate: "2%" },
                ].map((tier) => (
                  <div key={tier.level} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="font-semibold">{tier.level}</p>
                      <p className="text-xs text-cbx-text-secondary">{tier.desc}</p>
                    </div>
                    <span className="text-2xl font-bold text-cbx-gold">{tier.rate}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cbx-purple/30 to-transparent" />
        <div className="section-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-cbx-purple text-sm font-medium uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Start Earning in <span className="text-gradient-purple">3 Steps</span>
            </h2>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                step: "01",
                icon: Lock,
                title: "Create Account",
                description: "Sign up in seconds. Verify your email and complete KYC for full access.",
              },
              {
                step: "02",
                icon: Zap,
                title: "Start Earning",
                description: "Complete tasks, take surveys, or invest. Multiple ways to earn daily.",
              },
              {
                step: "03",
                icon: Wallet,
                title: "Withdraw",
                description: "Request withdrawals anytime. Fast processing with crypto payments.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={staggerItem}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cbx-purple/20 to-cbx-cyan/10 flex items-center justify-center border border-cbx-purple/20">
                    <item.icon className="h-8 w-8 text-cbx-purple" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-cbx-gold text-cbx-dark text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-cbx-text-secondary">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cbx-gold/30 to-transparent" />
        <div className="section-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-cbx-gold text-sm font-medium uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Trusted by <span className="text-gradient">Thousands</span>
            </h2>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                name: "Michael R.",
                role: "Active Investor",
                text: "I've earned over $3,000 in my first 3 months. The daily ROI on investments is consistent and withdrawals are processed fast.",
                rating: 5,
              },
              {
                name: "Sarah K.",
                role: "Task Earner",
                text: "The task system is straightforward and pays well. I complete surveys during my commute and earn extra income effortlessly.",
                rating: 5,
              },
              {
                name: "David L.",
                role: "Referral Leader",
                text: "Built a network of 200+ referrals. The commission structure is generous and the dashboard makes tracking earnings easy.",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                variants={staggerItem}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-cbx-gold fill-cbx-gold" />
                  ))}
                </div>
                <p className="text-sm text-cbx-text-secondary leading-relaxed mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cbx-purple/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-cbx-purple">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-cbx-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cbx-cyan/30 to-transparent" />
        <div className="section-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-cbx-cyan text-sm font-medium uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Common <span className="text-gradient-purple">Questions</span>
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "How do I start earning on CashBullX?",
                a: "Create an account, complete your profile and KYC verification, then start with tasks, surveys, or investments. You can begin earning immediately after signup.",
              },
              {
                q: "What is the minimum withdrawal amount?",
                a: "The minimum withdrawal is $10. All withdrawals are processed in USDT (TRC20) for fast and low-fee transactions.",
              },
              {
                q: "How does the investment ROI work?",
                a: "Choose an investment plan, deposit funds, and receive daily ROI payouts automatically credited to your balance. Returns vary from 1.2% to 2.5% daily depending on your plan.",
              },
              {
                q: "Is CashBullX secure?",
                a: "Yes. We use bank-grade encryption, KYC verification, two-factor authentication, and all financial operations are logged and audited for your protection.",
              },
              {
                q: "How does the referral program work?",
                a: "Share your referral link. When someone signs up, you earn a $1 bonus plus ongoing commissions on their earnings. Commissions extend up to 3 referral levels.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept USDT deposits via TRC20 and BEP20 networks. Withdrawals are processed in USDT (TRC20) for speed and low fees.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-cbx-text-secondary shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-cbx-text-secondary leading-relaxed">{faq.a}</p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cbx-purple/30 to-transparent" />
        <div className="section-container">
          <motion.div
            {...fadeInUp}
            className="glass-card p-12 text-center max-w-3xl mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cbx-purple/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cbx-cyan/10 rounded-full blur-[80px]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start <span className="brand-text">Earning?</span>
              </h2>
              <p className="text-cbx-text-secondary mb-8 max-w-lg mx-auto">
                Join thousands of users already earning daily. Sign up takes less than a minute.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-cbx-purple hover:bg-cbx-purple/90 text-white px-8 h-14 text-lg rounded-2xl shadow-glow"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <Link to="/" className="text-xl font-bold brand-text block mb-4">
                CashBullX
              </Link>
              <p className="text-sm text-cbx-text-secondary">
                The premier earning platform. Complete tasks, invest, and grow your wealth with daily returns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/signup" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Get Started</Link></li>
                <li><a href="#features" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Features</a></li>
                <li><a href="#invest" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Invest</a></li>
                <li><a href="#referral" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Referral</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/support" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/aml" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">AML Policy</Link></li>
                <li><Link to="/refund" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-sm text-cbx-text-secondary hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-cbx-text-secondary">
              &copy; {new Date().getFullYear()} CashBullX. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Globe className="h-4 w-4 text-cbx-text-secondary" />
              <span className="text-sm text-cbx-text-secondary">Global Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
