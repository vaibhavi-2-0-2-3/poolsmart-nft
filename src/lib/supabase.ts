import { supabase } from "@/integrations/supabase/client";

export interface SupabaseProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseRide {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  seats: number;
  date: string;
  price: number;
  driver_name: string | null;
  driver_email: string | null;
  status: string;
  created_at: string;
}

export interface SupabaseBooking {
  id: string;
  ride_id: string;
  user_id: string;
  status: string;
}

// Rides API
export const getRides = async (): Promise<SupabaseRide[]> => {
  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rides:", error);
    throw error;
  }

  return data || [];
};

export const createRide = async (rideData: {
  origin: string;
  destination: string;
  seats: number;
  date: string;
  price: number;
  driver_name: string;
  driver_email: string;
}): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("rides")
    .insert([
      {
        ...rideData,
        user_id: user.id,
        status: "active",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating ride:", error);
    throw error;
  }

  return data.id;
};

// Bookings API
export const createBooking = async (rideId: string): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("bookings").insert([
    {
      ride_id: rideId,
      user_id: user.id,
      status: "confirmed",
    },
  ]);

  if (error) {
    console.error("Error creating booking:", error);
    throw error;
  }

  return true;
};

export const getUserBookings = async (): Promise<SupabaseBooking[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }

  return data || [];
};

export const getUserRides = async (): Promise<SupabaseRide[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user rides:", error);
    throw error;
  }

  return data || [];
};

// Profile API
export const getProfile = async (): Promise<SupabaseProfile | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
};

// Realtime Presence Channel (used for chat online status)
export const getPresenceChannel = (
  recipientId: string,
  currentUserId: string
) => {
  return supabase.channel(`presence:chat:${recipientId}`, {
    config: {
      presence: {
        key: currentUserId,
      },
    },
  });
};
