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
      bookings: {
        Row: {
          id: string
          ride_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          ride_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          ride_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          participant1: string | null
          participant2: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          participant1?: string | null
          participant2?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          participant1?: string | null
          participant2?: string | null
        }
        Relationships: []
      }
      event_rides: {
        Row: {
          created_at: string
          event_id: string
          id: string
          ride_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          ride_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          ride_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rides_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rides_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          date_time: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          max_attendees: number | null
          name: string
          organizer_contact: string | null
          organizer_name: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          date_time: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          max_attendees?: number | null
          name: string
          organizer_contact?: string | null
          organizer_name?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          date_time?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          max_attendees?: number | null
          name?: string
          organizer_contact?: string | null
          organizer_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          id: string
          seen: boolean | null
          sender_id: string | null
          sent_at: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          id?: string
          seen?: boolean | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          id?: string
          seen?: boolean | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          animals: boolean | null
          avatar_url: string | null
          bio: string | null
          children: boolean | null
          created_at: string
          email: string | null
          full_name: string | null
          hide_partial_routes: boolean | null
          id: string
          instagram_handle: string | null
          luggage_size: string | null
          max_back_seat_passengers: boolean | null
          music: boolean | null
          phone_number: string | null
          search_radius: string | null
          smoking: boolean | null
          updated_at: string
          username: string | null
        }
        Insert: {
          animals?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          children?: boolean | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          hide_partial_routes?: boolean | null
          id: string
          instagram_handle?: string | null
          luggage_size?: string | null
          max_back_seat_passengers?: boolean | null
          music?: boolean | null
          phone_number?: string | null
          search_radius?: string | null
          smoking?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          animals?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          children?: boolean | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          hide_partial_routes?: boolean | null
          id?: string
          instagram_handle?: string | null
          luggage_size?: string | null
          max_back_seat_passengers?: boolean | null
          music?: boolean | null
          phone_number?: string | null
          search_radius?: string | null
          smoking?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          driver_id: string | null
          id: string
          rating: number
          reviewer_id: string | null
          ride_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          rating: number
          reviewer_id?: string | null
          ride_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          rating?: number
          reviewer_id?: string | null
          ride_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          ride_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          ride_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          ride_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          created_at: string | null
          date: string | null
          destination: string | null
          driver_email: string | null
          driver_name: string | null
          id: string
          origin: string | null
          price: number | null
          seats: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          destination?: string | null
          driver_email?: string | null
          driver_name?: string | null
          id?: string
          origin?: string | null
          price?: number | null
          seats?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          destination?: string | null
          driver_email?: string | null
          driver_name?: string | null
          id?: string
          origin?: string | null
          price?: number | null
          seats?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_event_rides: {
        Args: { event_uuid: string }
        Returns: {
          ride_id: string
          driver_name: string
          driver_email: string
          driver_phone: string
          origin: string
          departure_time: string
          seats: number
          price: number
          available_seats: number
        }[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
