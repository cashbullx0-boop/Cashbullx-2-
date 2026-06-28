export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          title: string
          xp_reward: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          title: string
          xp_reward?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      banned_documents: {
        Row: {
          banned_at: string
          email: string | null
          id: string
          id_number: string | null
          phone: string | null
          reason: string
          user_id: string
        }
        Insert: {
          banned_at?: string
          email?: string | null
          id?: string
          id_number?: string | null
          phone?: string | null
          reason?: string
          user_id: string
        }
        Update: {
          banned_at?: string
          email?: string | null
          id?: string
          id_number?: string | null
          phone?: string | null
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_checkins: {
        Row: {
          checkin_date: string
          created_at: string
          id: string
          reward_cents: number
          streak_day: number
          user_id: string
        }
        Insert: {
          checkin_date?: string
          created_at?: string
          id?: string
          reward_cents?: number
          streak_day?: number
          user_id: string
        }
        Update: {
          checkin_date?: string
          created_at?: string
          id?: string
          reward_cents?: number
          streak_day?: number
          user_id?: string
        }
        Relationships: []
      }
      deposits: {
        Row: {
          amount_usd: number
          confirmations: number
          confirmed_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          network: Database["public"]["Enums"]["deposit_network"]
          notes: string | null
          provider: string
          provider_payment_id: string | null
          rejection_reason: string | null
          sender_wallet_address: string | null
          slip_attempt: number
          slip_path: string | null
          status: Database["public"]["Enums"]["deposit_status"]
          tx_hash: string | null
          updated_at: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          amount_usd: number
          confirmations?: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          network: Database["public"]["Enums"]["deposit_network"]
          notes?: string | null
          provider?: string
          provider_payment_id?: string | null
          rejection_reason?: string | null
          sender_wallet_address?: string | null
          slip_attempt?: number
          slip_path?: string | null
          status?: Database["public"]["Enums"]["deposit_status"]
          tx_hash?: string | null
          updated_at?: string
          user_id: string
          wallet_address: string
        }
        Update: {
          amount_usd?: number
          confirmations?: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          network?: Database["public"]["Enums"]["deposit_network"]
          notes?: string | null
          provider?: string
          provider_payment_id?: string | null
          rejection_reason?: string | null
          sender_wallet_address?: string | null
          slip_attempt?: number
          slip_path?: string | null
          status?: Database["public"]["Enums"]["deposit_status"]
          tx_hash?: string | null
          updated_at?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      investment_levels: {
        Row: {
          color: string
          created_at: string
          daily_profit_cents: number
          icon: string
          id: string
          level: number
          min_deposit_cents: number
          name: string
          perks: string[] | null
          tier: string
        }
        Insert: {
          color: string
          created_at?: string
          daily_profit_cents: number
          icon: string
          id?: string
          level: number
          min_deposit_cents: number
          name: string
          perks?: string[] | null
          tier: string
        }
        Update: {
          color?: string
          created_at?: string
          daily_profit_cents?: number
          icon?: string
          id?: string
          level?: number
          min_deposit_cents?: number
          name?: string
          perks?: string[] | null
          tier?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount_cents: number
          asset: string
          asset_name: string
          completed_at: string | null
          created_at: string
          entry_price: number
          id: string
          return_percent: number
          status: Database["public"]["Enums"]["investment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          asset: string
          asset_name: string
          completed_at?: string | null
          created_at?: string
          entry_price?: number
          id?: string
          return_percent?: number
          status?: Database["public"]["Enums"]["investment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          asset?: string
          asset_name?: string
          completed_at?: string | null
          created_at?: string
          entry_price?: number
          id?: string
          return_percent?: number
          status?: Database["public"]["Enums"]["investment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kyc_submissions: {
        Row: {
          country: string
          created_at: string
          date_of_birth: string
          full_legal_name: string
          id: string
          id_back_path: string | null
          id_front_path: string
          id_number: string
          id_type: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_path: string
          status: Database["public"]["Enums"]["kyc_status"]
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          country: string
          created_at?: string
          date_of_birth: string
          full_legal_name: string
          id?: string
          id_back_path?: string | null
          id_front_path: string
          id_number: string
          id_type: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_path: string
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string
          date_of_birth?: string
          full_legal_name?: string
          id?: string
          id_back_path?: string | null
          id_front_path?: string
          id_number?: string
          id_type?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_path?: string
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      password_reset_requests: {
        Row: {
          admin_note: string | null
          approved_at: string | null
          expires_at: string
          id: string
          otp_hash: string | null
          otp_verified: boolean
          requested_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          approved_at?: string | null
          expires_at?: string
          id?: string
          otp_hash?: string | null
          otp_verified?: boolean
          requested_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          approved_at?: string | null
          expires_at?: string
          id?: string
          otp_hash?: string | null
          otp_verified?: boolean
          requested_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance_cents: number
          ban_reason: string | null
          bio: string | null
          created_at: string
          current_streak: number
          deposit_deadline: string | null
          full_name: string | null
          id: string
          kyc_approved_at: string | null
          last_checkin_date: string | null
          level: number
          longest_streak: number
          okx_wallet: string | null
          okx_wallet_locked: boolean
          phone: string | null
          phone_country_code: string | null
          phone_verified: boolean
          referral_code: string
          referred_by: string | null
          status: string
          total_earned_cents: number
          two_factor_enabled: boolean
          updated_at: string
          username: string | null
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          balance_cents?: number
          ban_reason?: string | null
          bio?: string | null
          created_at?: string
          current_streak?: number
          deposit_deadline?: string | null
          full_name?: string | null
          id: string
          kyc_approved_at?: string | null
          last_checkin_date?: string | null
          level?: number
          longest_streak?: number
          okx_wallet?: string | null
          okx_wallet_locked?: boolean
          phone?: string | null
          phone_country_code?: string | null
          phone_verified?: boolean
          referral_code: string
          referred_by?: string | null
          status?: string
          total_earned_cents?: number
          two_factor_enabled?: boolean
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          balance_cents?: number
          ban_reason?: string | null
          bio?: string | null
          created_at?: string
          current_streak?: number
          deposit_deadline?: string | null
          full_name?: string | null
          id?: string
          kyc_approved_at?: string | null
          last_checkin_date?: string | null
          level?: number
          longest_streak?: number
          okx_wallet?: string | null
          okx_wallet_locked?: boolean
          phone?: string | null
          phone_country_code?: string | null
          phone_verified?: boolean
          referral_code?: string
          referred_by?: string | null
          status?: string
          total_earned_cents?: number
          two_factor_enabled?: boolean
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      referrals: {
        Row: {
          bonus_cents: number
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          bonus_cents?: number
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          bonus_cents?: number
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_reply: string | null
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      task_completions: {
        Row: {
          created_at: string
          id: string
          reviewed_at: string | null
          reward_cents: number
          status: Database["public"]["Enums"]["completion_status"]
          task_id: string
          user_id: string
          watched_seconds: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reward_cents: number
          status?: Database["public"]["Enums"]["completion_status"]
          task_id: string
          user_id: string
          watched_seconds?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reward_cents?: number
          status?: Database["public"]["Enums"]["completion_status"]
          task_id?: string
          user_id?: string
          watched_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          category: Database["public"]["Enums"]["task_category"]
          created_at: string
          description: string | null
          estimated_minutes: number | null
          id: string
          image_url: string | null
          is_active: boolean
          reward_cents: number
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["task_category"]
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          reward_cents: number
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["task_category"]
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          reward_cents?: number
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          amount_cents: number
          created_at: string
          duration_hours: number
          expires_at: string
          id: string
          profit_amount_cents: number
          profit_cents: number | null
          profit_rate: number
          settled_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          duration_hours: number
          expires_at: string
          id?: string
          profit_amount_cents: number
          profit_cents?: number | null
          profit_rate: number
          settled_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          duration_hours?: number
          expires_at?: string
          id?: string
          profit_amount_cents?: number
          profit_cents?: number | null
          profit_rate?: number
          settled_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_cents: number
          created_at: string
          description: string | null
          id: string
          related_id: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          description?: string | null
          id?: string
          related_id?: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          description?: string | null
          id?: string
          related_id?: string | null
          type?: Database["public"]["Enums"]["txn_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_change_requests: {
        Row: {
          admin_note: string | null
          approved_at: string | null
          expires_at: string
          id: string
          new_wallet: string
          old_wallet: string | null
          otp_hash: string | null
          otp_verified: boolean
          requested_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          approved_at?: string | null
          expires_at?: string
          id?: string
          new_wallet: string
          old_wallet?: string | null
          otp_hash?: string | null
          otp_verified?: boolean
          requested_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          approved_at?: string | null
          expires_at?: string
          id?: string
          new_wallet?: string
          old_wallet?: string | null
          otp_hash?: string | null
          otp_verified?: boolean
          requested_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_otps: {
        Row: {
          created_at: string
          email_verified: boolean
          expires_at: string
          id: string
          otp_code: string
          user_id: string
          used: boolean
          withdrawal_id: string
        }
        Insert: {
          created_at?: string
          email_verified?: boolean
          expires_at?: string
          id?: string
          otp_code: string
          user_id: string
          used?: boolean
          withdrawal_id: string
        }
        Update: {
          created_at?: string
          email_verified?: boolean
          expires_at?: string
          id?: string
          otp_code?: string
          user_id?: string
          used?: boolean
          withdrawal_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount_cents: number
          created_at: string
          fee_cents: number
          id: string
          notes: string | null
          processed_at: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["withdrawal_status"]
          updated_at: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          fee_cents?: number
          id?: string
          notes?: string | null
          processed_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
          user_id: string
          wallet_address: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          fee_cents?: number
          id?: string
          notes?: string | null
          processed_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user" | "moderator"
      completion_status: "pending" | "approved" | "rejected"
      deposit_network: "USDT_TRC20" | "USDT_BEP20"
      deposit_status: "pending" | "confirming" | "approved" | "completed" | "failed" | "expired"
      investment_status: "active" | "completed" | "cancelled"
      kyc_status: "pending" | "approved" | "rejected"
      task_category: "daily" | "weekly" | "video" | "bonus"
      txn_type: "deposit" | "withdrawal" | "task_reward" | "referral_bonus" | "investment_profit" | "trade_profit" | "checkin" | "survey" | "adjustment"
      withdrawal_status: "pending" | "processing" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]
export type InsertTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type UpdateTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
