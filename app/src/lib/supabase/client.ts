import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = "https://adpjfmrsrkintsjcdnxf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcGpmbXJzcmtpbnRzamNkbnhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDQ4NzAsImV4cCI6MjA5ODA4MDg3MH0.r9JxnUYKoP_Bz-o1_v0CmQrJcLY03Hy46XkMw5bTsY4";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type SupabaseClient = typeof supabase;
