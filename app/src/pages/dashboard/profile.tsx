import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Loader2, Upload, Wallet } from "lucide-react";

export function ProfilePage() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      let avatarUrl = profile?.avatar_url;

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `${user.id}/avatar-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          username: username.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const balance = (profile?.balance_cents ?? 0) / 100;
  const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn}>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Manage your account settings</p>
      </motion.div>

      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-2 ring-cbx-purple/30">
                  <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-cbx-purple/20 text-cbx-purple text-2xl">
                    {(profile?.full_name ?? user?.email ?? "U").slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-cbx-purple flex items-center justify-center cursor-pointer">
                  <Upload className="h-4 w-4 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold">{profile?.full_name || "User"}</h2>
                <p className="text-sm text-cbx-text-secondary">{user?.email}</p>
                <div className="flex items-center gap-4 mt-2 justify-center sm:justify-start">
                  <span className="text-sm">Level {profile?.level ?? 1}</span>
                  <span className="text-sm text-cbx-text-secondary">{profile?.xp ?? 0} XP</span>
                  <span className="text-sm text-cbx-success font-medium">${balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-dark h-11" />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} className="input-dark h-11" placeholder="Unique username" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-dark" placeholder="Tell us about yourself" rows={3} />
            </div>
            <Button
              onClick={() => updateProfile.mutate()}
              disabled={updateProfile.isPending}
              className="bg-cbx-purple hover:bg-cbx-purple/90"
            >
              {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet Info */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-cbx-cyan" />
              Wallet Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02]">
              <div>
                <p className="text-sm text-cbx-text-secondary">USDT TRC20 Withdrawal Address</p>
                <p className="text-sm font-mono mt-1">{profile?.okx_wallet || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
