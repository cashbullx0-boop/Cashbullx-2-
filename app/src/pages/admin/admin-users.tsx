import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Shield } from "lucide-react";

export function AdminUsers() {
  const [search, setSearch] = useState("");

  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  const filtered = (users ?? []).filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search)
  );

  const statusColors: Record<string, string> = {
    active: "bg-cbx-success/10 text-cbx-success",
    banned: "bg-cbx-danger/10 text-cbx-danger",
    suspended: "bg-cbx-warning/10 text-cbx-warning",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Manage platform users</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 text-cbx-text-secondary" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-dark border-0"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filtered.map((u) => (
                <div key={u.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-cbx-purple/20 text-cbx-purple text-sm">
                      {(u.full_name || "U").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.full_name || "Anonymous"}</p>
                    <p className="text-xs text-cbx-text-secondary">@{u.username || "no-username"}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[u.status] || "bg-white/5 text-cbx-text-secondary"}`}>
                      {u.status}
                    </span>
                    <p className="text-xs text-cbx-text-secondary mt-1">
                      ${((u.balance_cents ?? 0) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-sm text-cbx-text-secondary py-8">No users found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
