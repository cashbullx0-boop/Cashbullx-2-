import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, Copy, CheckCircle2, TrendingUp, Award, Link2 } from "lucide-react";
import { useState } from "react";

export function ReferralsPage() {
  const { user, profile } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/ref/${profile?.username || profile?.referral_code || user?.id}`;
  const referralCode = profile?.referral_code || "";

  const { data: referrals } = useQuery({
    queryKey: ["referrals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("referrals")
        .select("*, referred:referred_id(full_name, username, created_at)")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: referralEarnings } = useQuery({
    queryKey: ["referral-earnings", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data } = await supabase
        .from("referrals")
        .select("bonus_cents")
        .eq("referrer_id", user.id);
      return (data ?? []).reduce((sum, r) => sum + r.bonus_cents, 0);
    },
    enabled: !!user,
  });

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral link copied!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
  };

  const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn}>
        <h1 className="text-2xl font-bold">Referrals</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Invite friends and earn commissions</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <Users className="h-5 w-5 text-cbx-purple mb-2" />
            <p className="text-2xl font-bold">{referrals?.length ?? 0}</p>
            <p className="text-xs text-cbx-text-secondary">Total Referrals</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <Award className="h-5 w-5 text-cbx-gold mb-2" />
            <p className="text-2xl font-bold">${((referralEarnings ?? 0) / 100).toFixed(2)}</p>
            <p className="text-xs text-cbx-text-secondary">Bonus Earned</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <TrendingUp className="h-5 w-5 text-cbx-success mb-2" />
            <p className="text-2xl font-bold">$1.00</p>
            <p className="text-xs text-cbx-text-secondary">Per Referral</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card className="glass-card gradient-border">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">Your Referral Link</h3>
            <div className="flex items-center gap-2">
              <Input value={referralLink} readOnly className="input-dark h-12 text-sm" />
              <Button onClick={copyLink} className="h-12 px-4 bg-cbx-purple hover:bg-cbx-purple/90">
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-cbx-text-secondary">Code:</span>
                <code className="text-sm font-mono bg-white/[0.04] px-2 py-1 rounded">{referralCode}</code>
              </div>
              <Button variant="ghost" size="sm" onClick={copyCode} className="text-cbx-cyan hover:text-cbx-cyan/80">
                <Copy className="h-3 w-3 mr-1" />
                Copy Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Commission Structure */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold mb-4">Commission Structure</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { level: "Level 1", rate: "10%", desc: "Direct referrals" },
            { level: "Level 2", rate: "5%", desc: "Their referrals" },
            { level: "Level 3", rate: "2%", desc: "Extended network" },
          ].map((tier) => (
            <Card key={tier.level} className="glass-card">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-cbx-text-secondary mb-1">{tier.level}</p>
                <p className="text-2xl font-bold text-cbx-gold">{tier.rate}</p>
                <p className="text-xs text-cbx-text-secondary">{tier.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Referral List */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-cbx-cyan" />
              Your Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {referrals && referrals.length > 0 ? (
              <div className="space-y-2">
                {referrals.map((ref: any) => (
                  <div key={ref.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-medium">{ref.referred?.full_name || "Anonymous"}</p>
                      <p className="text-xs text-cbx-text-secondary">
                        Joined {new Date(ref.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-cbx-success">+${(ref.bonus_cents / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-cbx-text-secondary mx-auto mb-3" />
                <p className="text-sm text-cbx-text-secondary">No referrals yet</p>
                <p className="text-xs text-cbx-text-secondary mt-1">Share your link to start earning</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
