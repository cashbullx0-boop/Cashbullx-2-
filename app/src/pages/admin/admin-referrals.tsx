import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Award } from "lucide-react";

export function AdminReferrals() {
  const { data: referrals } = useQuery({
    queryKey: ["admin-referrals"],
    queryFn: async () => {
      const { data } = await supabase
        .from("referrals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  const { data: topReferrers } = useQuery({
    queryKey: ["top-referrers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, username, referral_code, total_earned_cents")
        .order("total_earned_cents", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const totalBonus = (referrals ?? []).reduce((sum, r) => sum + r.bonus_cents, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Referrals</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Manage referral program</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <Users className="h-5 w-5 text-cbx-cyan mb-2" />
            <p className="text-2xl font-bold">{referrals?.length ?? 0}</p>
            <p className="text-xs text-cbx-text-secondary">Total Referrals</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <Award className="h-5 w-5 text-cbx-gold mb-2" />
            <p className="text-2xl font-bold">${(totalBonus / 100).toFixed(2)}</p>
            <p className="text-xs text-cbx-text-secondary">Total Bonuses Paid</p>
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topReferrers && topReferrers.length > 0 ? (
                topReferrers.map((u, i) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-cbx-text-secondary w-6">#{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{u.full_name || "Anonymous"}</p>
                        <p className="text-xs text-cbx-text-secondary font-mono">{u.referral_code}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">${((u.total_earned_cents ?? 0) / 100).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-cbx-text-secondary py-8">No data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {referrals && referrals.length > 0 ? (
                referrals.slice(0, 20).map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02]">
                    <div>
                      <p className="text-xs text-cbx-text-secondary font-mono">{r.referrer_id.slice(0, 8)}... referred {r.referred_id.slice(0, 8)}...</p>
                      <p className="text-xs text-cbx-text-secondary">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm text-cbx-success font-medium">+${(r.bonus_cents / 100).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-cbx-text-secondary py-8">No referrals yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
