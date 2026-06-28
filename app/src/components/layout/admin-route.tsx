import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cbx-dark">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 border-2 border-cbx-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-cbx-text-secondary text-sm">Verifying access...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cbx-dark">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-md text-center"
        >
          <ShieldAlert className="h-12 w-12 text-cbx-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-cbx-text-secondary mb-4">
            You don't have permission to access the admin panel. This area is restricted to administrators only.
          </p>
          <Navigate to="/dashboard" replace />
        </motion.div>
      </div>
    );
  }

  return <Outlet />;
}
