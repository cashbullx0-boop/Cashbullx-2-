import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Users } from "lucide-react";

export function RefRedirectPage() {
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      try {
        sessionStorage.setItem("cbx_ref", username);
      } catch {}
    }
    const timer = setTimeout(() => {
      navigate("/signup");
    }, 2000);
    return () => clearTimeout(timer);
  }, [username, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cbx-dark bg-gradient-mesh px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-cbx-purple/10 flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-cbx-purple" />
        </div>
        <h1 className="text-2xl font-bold mb-2">You've been invited!</h1>
        <p className="text-cbx-text-secondary mb-6">Redirecting you to sign up...</p>
        <Loader2 className="h-6 w-6 animate-spin text-cbx-purple mx-auto" />
      </motion.div>
    </div>
  );
}
