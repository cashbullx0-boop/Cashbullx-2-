import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShieldCheck, Upload, Loader2, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

export function KycPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [idType, setIdType] = useState("passport");
  const [idNumber, setIdNumber] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState("");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const { data: kyc } = useQuery({
    queryKey: ["kyc", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("kyc_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false })
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const submitKyc = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      if (!fullName.trim() || !idNumber.trim() || !country.trim() || !dob) {
        throw new Error("Please fill in all required fields");
      }
      if (!idFront || !selfie) throw new Error("Please upload ID front and selfie");

      // Upload files
      const uploadFile = async (file: File, path: string) => {
        const { error: upErr } = await supabase.storage
          .from("kyc-documents")
          .upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        return path;
      };

      const idFrontPath = await uploadFile(idFront, `${user.id}/id-front-${Date.now()}.${idFront.name.split(".").pop()}`);
      const idBackPath = idBack ? await uploadFile(idBack, `${user.id}/id-back-${Date.now()}.${idBack.name.split(".").pop()}`) : null;
      const selfiePath = await uploadFile(selfie, `${user.id}/selfie-${Date.now()}.${selfie.name.split(".").pop()}`);

      const { error } = await supabase.from("kyc_submissions").insert({
        user_id: user.id,
        full_legal_name: fullName.trim(),
        id_type: idType,
        id_number: idNumber.trim(),
        country: country.trim(),
        date_of_birth: dob,
        id_front_path: idFrontPath,
        id_back_path: idBackPath,
        selfie_path: selfiePath,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("KYC submitted for review!");
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const statusConfig: Record<string, { color: string; icon: React.ElementType; text: string }> = {
    pending: { color: "text-cbx-warning", icon: AlertTriangle, text: "Under Review" },
    approved: { color: "text-cbx-success", icon: CheckCircle2, text: "Verified" },
    rejected: { color: "text-cbx-danger", icon: AlertTriangle, text: "Rejected" },
  };

  const currentStatus = kyc ? statusConfig[kyc.status] : null;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Verify your identity to unlock all features</p>
      </motion.div>

      {/* Status */}
      {kyc && currentStatus && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentStatus.color.replace("text-", "bg-")}/10`}>
                <currentStatus.icon className={`h-6 w-6 ${currentStatus.color}`} />
              </div>
              <div>
                <p className="font-semibold">{currentStatus.text}</p>
                <p className="text-sm text-cbx-text-secondary">
                  Submitted on {new Date(kyc.submitted_at).toLocaleDateString()}
                </p>
                {kyc.rejection_reason && (
                  <p className="text-sm text-cbx-danger mt-1">Reason: {kyc.rejection_reason}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* KYC Form */}
      {(!kyc || kyc.status === "rejected") && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Submit KYC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Legal Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-dark h-11" placeholder="As on ID" />
                </div>
                <div className="space-y-2">
                  <Label>ID Type</Label>
                  <Select value={idType} onValueChange={setIdType}>
                    <SelectTrigger className="input-dark h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-cbx-card border-white/[0.08]">
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ID Number</Label>
                  <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="input-dark h-11" placeholder="ID number" />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={country} onChange={(e) => setCountry(e.target.value)} className="input-dark h-11" placeholder="Your country" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input-dark h-11" />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "ID Front", file: idFront, setFile: setIdFront },
                  { label: "ID Back (optional)", file: idBack, setFile: setIdBack },
                  { label: "Selfie with ID", file: selfie, setFile: setSelfie },
                ].map((upload) => (
                  <div key={upload.label} className="space-y-2">
                    <Label>{upload.label}</Label>
                    <label className="flex flex-col items-center justify-center h-24 rounded-xl border border-dashed border-white/[0.1] hover:border-cbx-purple/40 cursor-pointer transition-colors bg-white/[0.02]">
                      {upload.file ? (
                        <CheckCircle2 className="h-6 w-6 text-cbx-success mb-1" />
                      ) : (
                        <Upload className="h-6 w-6 text-cbx-text-secondary mb-1" />
                      )}
                      <span className="text-xs text-cbx-text-secondary">
                        {upload.file ? upload.file.name.slice(0, 15) : "Click to upload"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => upload.setFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => submitKyc.mutate()}
                disabled={submitKyc.isPending}
                className="w-full h-12 bg-cbx-purple hover:bg-cbx-purple/90"
              >
                {submitKyc.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit KYC"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
