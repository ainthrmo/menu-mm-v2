export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          name_mm: string | null
          restaurant_id: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          name_mm?: string | null
          restaurant_id?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          name_mm?: string | null
          restaurant_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      category_translations: {
        Row: {
          category_id: string
          created_at: string
          id: string
          lang_code: string
          name: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          lang_code: string
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          lang_code?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      dish_translations: {
        Row: {
          created_at: string
          description: string | null
          dish_id: string
          id: string
          lang_code: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dish_id: string
          id?: string
          lang_code: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dish_id?: string
          id?: string
          lang_code?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dish_translations_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          available: boolean
          category_id: string | null
          created_at: string
          id: string
          image_url: string | null
          is_popular: boolean
          is_spicy: boolean
          legacy_menu_item_id: string | null
          menu_id: string
          price: number | null
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          available?: boolean
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_popular?: boolean
          is_spicy?: boolean
          legacy_menu_item_id?: string | null
          menu_id: string
          price?: number | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          available?: boolean
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_popular?: boolean
          is_spicy?: boolean
          legacy_menu_item_id?: string | null
          menu_id?: string
          price?: number | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "dishes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dishes_legacy_menu_item_id_fkey"
            columns: ["legacy_menu_item_id"]
            isOneToOne: true
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dishes_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          city: string | null
          contact_name: string
          created_at: string
          id: string
          notes: string | null
          onboarded_restaurant_id: string | null
          phone: string
          restaurant_name: string
          status: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          contact_name: string
          created_at?: string
          id?: string
          notes?: string | null
          onboarded_restaurant_id?: string | null
          phone: string
          restaurant_name: string
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          contact_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          onboarded_restaurant_id?: string | null
          phone?: string
          restaurant_name?: string
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_onboarded_restaurant_id_fkey"
            columns: ["onboarded_restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          org_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          org_id: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          org_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          description_mm: string | null
          id: string
          image: string | null
          is_available: boolean | null
          is_popular: boolean
          name: string
          name_mm: string | null
          price: number
          restaurant_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          description_mm?: string | null
          id?: string
          image?: string | null
          is_available?: boolean | null
          is_popular?: boolean
          name: string
          name_mm?: string | null
          price: number
          restaurant_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          description_mm?: string | null
          id?: string
          image?: string | null
          is_available?: boolean | null
          is_popular?: boolean
          name?: string
          name_mm?: string | null
          price?: number
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
          venue_id: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          venue_id: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          venue_id?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "menus_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          items: Json
          restaurant_id: string | null
          status: string | null
          table_number: string
          total_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          items: Json
          restaurant_id?: string | null
          status?: string | null
          table_number: string
          total_price: number
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          restaurant_id?: string | null
          status?: string | null
          table_number?: string
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          legacy_restaurant_id: string | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          legacy_restaurant_id?: string | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          legacy_restaurant_id?: string | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_legacy_restaurant_id_fkey"
            columns: ["legacy_restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          billing_interval: string
          created_at: string
          features: Json
          id: string
          is_active: boolean
          max_menu_items: number
          name: string
          price_mmk: number
          price_usd: number
        }
        Insert: {
          billing_interval?: string
          created_at?: string
          features?: Json
          id: string
          is_active?: boolean
          max_menu_items?: number
          name: string
          price_mmk?: number
          price_usd?: number
        }
        Update: {
          billing_interval?: string
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          max_menu_items?: number
          name?: string
          price_mmk?: number
          price_usd?: number
        }
        Relationships: []
      }
      platform_admins: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          created_at: string
          id: string
          is_legacy: boolean
          label: string | null
          legacy_restaurant_id: string | null
          menu_id: string | null
          scan_count: number
          updated_at: string
          url_path: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_legacy?: boolean
          label?: string | null
          legacy_restaurant_id?: string | null
          menu_id?: string | null
          scan_count?: number
          updated_at?: string
          url_path: string
          venue_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_legacy?: boolean
          label?: string | null
          legacy_restaurant_id?: string | null
          menu_id?: string | null
          scan_count?: number
          updated_at?: string
          url_path?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_legacy_restaurant_id_fkey"
            columns: ["legacy_restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string | null
          scan_count: number
          social_facebook: string | null
          social_instagram: string | null
          social_messenger: string | null
          social_phone: string | null
          social_tiktok: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id?: string | null
          scan_count?: number
          social_facebook?: string | null
          social_instagram?: string | null
          social_messenger?: string | null
          social_phone?: string | null
          social_tiktok?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string | null
          scan_count?: number
          social_facebook?: string | null
          social_instagram?: string | null
          social_messenger?: string | null
          social_phone?: string | null
          social_tiktok?: string | null
          status?: string
        }
        Relationships: []
      }
      restaurant_tables: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string | null
          qr_token: string | null
          restaurant_id: string
          table_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          qr_token?: string | null
          restaurant_id: string
          table_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          qr_token?: string | null
          restaurant_id?: string
          table_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_events: {
        Row: {
          id: string
          ip_hash: string | null
          restaurant_id: string
          scanned_at: string
          user_agent: string | null
        }
        Insert: {
          id?: string
          ip_hash?: string | null
          restaurant_id: string
          scanned_at?: string
          user_agent?: string | null
        }
        Update: {
          id?: string
          ip_hash?: string | null
          restaurant_id?: string
          scanned_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_events_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          request_type: "call_waiter" | "request_bill"
          restaurant_id: string
          status: "pending" | "completed" | "cancelled"
          table_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          request_type: "call_waiter" | "request_bill"
          restaurant_id: string
          status?: "pending" | "completed" | "cancelled"
          table_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          request_type?: "call_waiter" | "request_bill"
          restaurant_id?: string
          status?: "pending" | "completed" | "cancelled"
          table_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      store_profile: {
        Row: {
          cover_url: string | null
          id: string
          logo_url: string | null
          restaurant_id: string | null
          show_wifi: boolean
          social_facebook: string | null
          social_instagram: string | null
          social_messenger: string | null
          social_phone: string | null
          social_tiktok: string | null
          store_name: string | null
          updated_at: string | null
          wifi_name: string | null
          wifi_password: string | null
        }
        Insert: {
          cover_url?: string | null
          id?: string
          logo_url?: string | null
          restaurant_id?: string | null
          show_wifi?: boolean
          social_facebook?: string | null
          social_instagram?: string | null
          social_messenger?: string | null
          social_phone?: string | null
          social_tiktok?: string | null
          store_name?: string | null
          updated_at?: string | null
          wifi_name?: string | null
          wifi_password?: string | null
        }
        Update: {
          cover_url?: string | null
          id?: string
          logo_url?: string | null
          restaurant_id?: string | null
          show_wifi?: boolean
          social_facebook?: string | null
          social_instagram?: string | null
          social_messenger?: string | null
          social_phone?: string | null
          social_tiktok?: string | null
          store_name?: string | null
          updated_at?: string | null
          wifi_name?: string | null
          wifi_password?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_profile_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string
          current_period_start: string | null
          id: string
          plan: string
          plan_id: string | null
          restaurant_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string | null
          id?: string
          plan?: string
          plan_id?: string | null
          restaurant_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string | null
          id?: string
          plan?: string
          plan_id?: string | null
          restaurant_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          created_at: string
          currency: string
          id: string
          legacy_restaurant_id: string | null
          name: string
          org_id: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          legacy_restaurant_id?: string | null
          name: string
          org_id: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          legacy_restaurant_id?: string | null
          name?: string
          org_id?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "venues_legacy_restaurant_id_fkey"
            columns: ["legacy_restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assert_restaurant_write_access: {
        Args: { p_restaurant_id: string }
        Returns: string
      }
      create_dish_legacy_bridge: {
        Args: {
          p_category_id: string
          p_category_name: string
          p_description_en: string
          p_description_mm: string
          p_image_url: string
          p_is_popular?: boolean
          p_name_en: string
          p_name_mm: string
          p_price: number
          p_restaurant_id: string
        }
        Returns: string
      }
      create_organization_venue_for_current_user: {
        Args: { p_name: string }
        Returns: {
          menu_id: string
          organization_id: string
          restaurant_id: string
          venue_id: string
          venue_slug: string
        }[]
      }
      delete_dish_legacy_bridge: {
        Args: { p_legacy_menu_item_id: string; p_restaurant_id: string }
        Returns: undefined
      }
      generate_slug: { Args: { p_text: string }; Returns: string }
      generate_unique_venue_slug: {
        Args: { p_exclude_id?: string; p_name: string }
        Returns: string
      }
      get_my_org_role: { Args: { p_org_id: string }; Returns: string }
      get_restaurant_plan_id: {
        Args: { p_restaurant_id: string }
        Returns: string
      }
      is_admin_or_staff: { Args: never; Returns: boolean }
      is_org_manager_or_owner: { Args: { p_org_id: string }; Returns: boolean }
      is_platform_admin: { Args: never; Returns: boolean }
      record_restaurant_scan: {
        Args: {
          p_ip_hash?: string
          p_restaurant_id: string
          p_user_agent?: string
        }
        Returns: undefined
      }
      staff_toggle_dish_availability: {
        Args: { p_available: boolean; p_dish_id: string }
        Returns: undefined
      }
      update_dish_legacy_bridge: {
        Args: {
          p_category_id: string
          p_category_name: string
          p_description_en: string
          p_description_mm: string
          p_image_url: string
          p_is_popular: boolean
          p_legacy_menu_item_id: string
          p_name_en: string
          p_name_mm: string
          p_price: number
          p_restaurant_id: string
        }
        Returns: undefined
      }
      validate_table_belongs_to_restaurant: {
        Args: {
          p_restaurant_id: string
          p_table_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
