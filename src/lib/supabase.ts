import { supabase } from "@/integrations/supabase/client";

export interface SupabaseProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  search_radius: string;
  luggage_size: string;
  hide_partial_routes: boolean;
  max_back_seat_passengers: boolean;
  music: boolean;
  animals: boolean;
  children: boolean;
  smoking: boolean;
  instagram_handle: string | null;
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

export interface SupabaseReview {
  id: string;
  ride_id: string;
  driver_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface SupabaseEvent {
  id: string;
  name: string;
  description: string | null;
  location: string;
  date_time: string;
  image_url: string | null;
  organizer_name: string | null;
  organizer_contact: string | null;
  category: string | null;
  max_attendees: number | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseEventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'attending' | 'maybe' | 'not_attending';
  created_at: string;
}

export interface SupabaseEventRide {
  id: string;
  event_id: string;
  ride_id: string;
  created_at: string;
}

export interface SupabaseRideRequest {
  id: string;
  ride_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRideDetails {
  ride_id: string;
  driver_name: string;
  driver_email: string;
  driver_phone: string | null;
  origin: string;
  departure_time: string;
  seats: number;
  price: number;
  available_seats: number;
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
  event_id?: string; // Add optional event_id parameter
}): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { event_id, ...rideDataWithoutEventId } = rideData;

  const { data, error } = await supabase
    .from("rides")
    .insert([
      {
        ...rideDataWithoutEventId,
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

  // If event_id is provided, link the ride to the event
  if (event_id) {
    const { error: eventRideError } = await supabase
      .from("event_rides")
      .insert([
        {
          event_id: event_id,
          ride_id: data.id,
        },
      ]);

    if (eventRideError) {
      console.error("Error linking ride to event:", eventRideError);
      // Note: We don't throw here to avoid leaving orphaned rides, but log the error
    }
  }

  return data.id;
};

// Updated: Create ride request instead of direct booking
export const createRideRequest = async (rideId: string, message?: string): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("ride_requests").insert([
    {
      ride_id: rideId,
      user_id: user.id,
      status: "pending",
      message: message || null,
    },
  ]);

  if (error) {
    console.error("Error creating ride request:", error);
    throw error;
  }

  return true;
};

// Legacy function for backward compatibility - now creates requests
export const createBooking = async (rideId: string, message?: string): Promise<boolean> => {
  return createRideRequest(rideId, message);
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

// Get ride requests for a specific ride (for drivers)
export const getRideRequests = async (rideId: string): Promise<SupabaseRideRequest[]> => {
  const { data, error } = await supabase
    .from("ride_requests")
    .select(`
      *,
      profiles:user_id (
        full_name,
        email,
        avatar_url
      )
    `)
    .eq("ride_id", rideId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ride requests:", error);
    throw error;
  }

  // Type assertion to ensure proper typing
  return (data || []).map(request => ({
    ...request,
    status: request.status as 'pending' | 'accepted' | 'rejected'
  }));
};

// Get user's pending ride requests
export const getUserRideRequests = async (): Promise<SupabaseRideRequest[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("ride_requests")
    .select(`
      *,
      rides:ride_id (
        origin,
        destination,
        date,
        price,
        driver_name
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user ride requests:", error);
    throw error;
  }

  return (data || []).map(request => ({
    ...request,
    status: request.status as 'pending' | 'accepted' | 'rejected'
  }));
};

export const updateRideRequestStatus = async (
  requestId: string,
  status: 'accepted' | 'rejected'
): Promise<boolean> => {
  const { error } = await supabase
    .from("ride_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) {
    console.error("Error updating ride request status:", error);
    throw error;
  }

  // If accepted, create a booking
  if (status === 'accepted') {
    const { data: request } = await supabase
      .from("ride_requests")
      .select("ride_id, user_id")
      .eq("id", requestId)
      .single();

    if (request) {
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            ride_id: request.ride_id,
            user_id: request.user_id,
            status: "confirmed",
          },
        ]);

      if (bookingError) {
        console.error("Error creating booking:", bookingError);
        throw bookingError;
      }
    }
  }

  return true;
};

// Events API
export const getEvents = async (): Promise<SupabaseEvent[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date_time", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    throw error;
  }

  return data || [];
};

export const getEventRSVPs = async (eventId: string): Promise<SupabaseEventRSVP[]> => {
  const { data, error } = await supabase
    .from("event_rsvps")
    .select("*")
    .eq("event_id", eventId);

  if (error) {
    console.error("Error fetching event RSVPs:", error);
    throw error;
  }

  // Type assertion to ensure proper typing
  return (data || []).map(rsvp => ({
    ...rsvp,
    status: rsvp.status as 'attending' | 'maybe' | 'not_attending'
  }));
};

export const createEventRSVP = async (eventId: string, status: 'attending' | 'maybe' | 'not_attending'): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("event_rsvps").insert([
    {
      event_id: eventId,
      user_id: user.id,
      status: status,
    },
  ]);

  if (error) {
    console.error("Error creating event RSVP:", error);
    throw error;
  }

  return true;
};

export const updateEventRSVPStatus = async (eventId: string, status: 'attending' | 'maybe' | 'not_attending'): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("event_rsvps")
    .update({ status })
    .eq("event_id", eventId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating event RSVP:", error);
    throw error;
  }

  return true;
};

export const getEventAttendees = async (eventId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("event_rsvps")
    .select("user_id")
    .eq("event_id", eventId)
    .eq("status", "attending");

  if (error) {
    console.error("Error fetching event attendees:", error);
    throw error;
  }

  return data?.map(rsvp => rsvp.user_id) || [];
};

// Ride Requests API
export const createRideRequestOld = async (rideId: string, message?: string): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("ride_requests").insert([
    {
      ride_id: rideId,
      user_id: user.id,
      status: "pending",
      message: message || null,
    },
  ]);

  if (error) {
    console.error("Error creating ride request:", error);
    throw error;
  }

  return true;
};

export const getRideRequestsOld = async (rideId: string): Promise<SupabaseRideRequest[]> => {
  const { data, error } = await supabase
    .from("ride_requests")
    .select("*")
    .eq("ride_id", rideId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ride requests:", error);
    throw error;
  }

  // Type assertion to ensure proper typing
  return (data || []).map(request => ({
    ...request,
    status: request.status as 'pending' | 'accepted' | 'rejected'
  }));
};

export const updateRideRequestStatusOld = async (
  requestId: string,
  status: 'accepted' | 'rejected'
): Promise<boolean> => {
  const { error } = await supabase
    .from("ride_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) {
    console.error("Error updating ride request status:", error);
    throw error;
  }

  return true;
};

// Event Rides API
export const getEventRides = async (eventId: string): Promise<EventRideDetails[]> => {
  const { data, error } = await supabase.rpc('get_event_rides', {
    event_uuid: eventId
  });

  if (error) {
    console.error("Error fetching event rides:", error);
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

export const updateProfile = async (profileData: Partial<SupabaseProfile>): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  return true;
};

// Reviews API
export const createReview = async (reviewData: {
  ride_id: string;
  driver_id: string;
  rating: number;
  comment?: string;
}): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("reviews").insert([
    {
      ...reviewData,
      reviewer_id: user.id,
    },
  ]);

  if (error) {
    console.error("Error creating review:", error);
    throw error;
  }

  return true;
};

export const getDriverReviews = async (driverId: string): Promise<SupabaseReview[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("driver_id", driverId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching driver reviews:", error);
    throw error;
  }

  return data || [];
};

export const getUserReview = async (rideId: string, driverId: string): Promise<SupabaseReview | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("ride_id", rideId)
    .eq("driver_id", driverId)
    .eq("reviewer_id", user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching user review:", error);
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

export const updateUserPhoneNumber = async (phoneNumber: string): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ phone_number: phoneNumber, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating phone number:", error);
    throw error;
  }

  return true;
};
