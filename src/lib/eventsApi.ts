
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  name?: string;
  description: string | null;
  location: string;
  date: string;
  date_time?: string;
  imageUrl?: string | null;
  image_url?: string | null;
  organizerName: string | null;
  organizer_name?: string | null;
  organizerContact?: string | null;
  organizer_contact?: string | null;
  category: string | null;
  maxAttendees?: number | null;
  max_attendees?: number | null;
  price?: number;
  attendees?: string[];
  rsvpStatus?: 'attending' | 'maybe' | 'not_attending' | null;
  rsvpCount?: number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'attending' | 'maybe' | 'not_attending';
  created_at: string;
}

export interface EventRide {
  id: string;
  event_id: string;
  ride_id: string;
  created_at: string;
}

// Normalize event data for consistent interface
const normalizeEvent = (event: any): Event => {
  return {
    id: event.id,
    title: event.name || event.title,
    name: event.name,
    description: event.description,
    location: event.location,
    date: event.date_time || event.date,
    date_time: event.date_time,
    imageUrl: event.image_url || event.imageUrl,
    image_url: event.image_url,
    organizerName: event.organizer_name || event.organizerName,
    organizer_name: event.organizer_name,
    organizerContact: event.organizer_contact || event.organizerContact,
    organizer_contact: event.organizer_contact,
    category: event.category,
    maxAttendees: event.max_attendees || event.maxAttendees,
    max_attendees: event.max_attendees,
    price: event.price || 0,
    attendees: event.attendees || [],
    rsvpStatus: event.rsvpStatus,
    rsvpCount: event.rsvpCount || 0,
    createdAt: event.created_at || event.createdAt,
    created_at: event.created_at,
    updatedAt: event.updated_at || event.updatedAt,
    updated_at: event.updated_at,
  };
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    // Get current user's RSVPs
    const { data: { user } } = await supabase.auth.getUser();
    let userRSVPs: any[] = [];
    
    if (user) {
      const { data: rsvps, error: rsvpError } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('user_id', user.id);
      
      if (!rsvpError) {
        userRSVPs = rsvps || [];
      }
    }

    // Get RSVP counts for each event
    const { data: rsvpCounts, error: countError } = await supabase
      .from('event_rsvps')
      .select('event_id, status')
      .eq('status', 'attending');

    const eventRSVPCounts = rsvpCounts?.reduce((acc: Record<string, number>, rsvp) => {
      acc[rsvp.event_id] = (acc[rsvp.event_id] || 0) + 1;
      return acc;
    }, {}) || {};

    const normalizedEvents = events?.map(event => {
      const userRSVP = userRSVPs.find(rsvp => rsvp.event_id === event.id);
      return normalizeEvent({
        ...event,
        rsvpStatus: userRSVP?.status as 'attending' | 'maybe' | 'not_attending' | null || null,
        rsvpCount: eventRSVPCounts[event.id] || 0
      });
    }) || [];

    return normalizedEvents;
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    throw error;
  }
};

export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return null;
    }

    if (!event) return null;

    // Get current user's RSVP
    const { data: { user } } = await supabase.auth.getUser();
    let userRSVP: any = null;
    
    if (user) {
      const { data: rsvp, error: rsvpError } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();
      
      if (!rsvpError && rsvp) {
        userRSVP = rsvp;
      }
    }

    // Get RSVP count
    const { data: rsvpCount, error: countError } = await supabase
      .from('event_rsvps')
      .select('id')
      .eq('event_id', eventId)
      .eq('status', 'attending');

    const normalizedEvent = normalizeEvent({
      ...event,
      rsvpStatus: userRSVP?.status as 'attending' | 'maybe' | 'not_attending' | null || null,
      rsvpCount: rsvpCount?.length || 0
    });

    return normalizedEvent;
  } catch (error) {
    console.error('Error in getEventById:', error);
    return null;
  }
};

export const searchEvents = async (criteria: {
  keyword?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Event[]> => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    if (criteria.keyword) {
      query = query.or(`name.ilike.%${criteria.keyword}%,description.ilike.%${criteria.keyword}%`);
    }

    if (criteria.location) {
      query = query.ilike('location', `%${criteria.location}%`);
    }

    if (criteria.startDate) {
      query = query.gte('date_time', criteria.startDate);
    }

    if (criteria.endDate) {
      query = query.lte('date_time', criteria.endDate);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Error searching events:', error);
      throw error;
    }

    return events?.map(event => normalizeEvent(event)) || [];
  } catch (error) {
    console.error('Error in searchEvents:', error);
    throw error;
  }
};

export const registerForEvent = async (eventId: string, userId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if already registered
    const { data: existingRSVP, error: checkError } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing RSVP:', checkError);
      throw checkError;
    }

    if (existingRSVP) {
      // Update existing RSVP to attending
      const { error: updateError } = await supabase
        .from('event_rsvps')
        .update({ status: 'attending' })
        .eq('id', existingRSVP.id);

      if (updateError) {
        console.error('Error updating RSVP:', updateError);
        throw updateError;
      }
    } else {
      // Create new RSVP
      const { error: insertError } = await supabase
        .from('event_rsvps')
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: 'attending'
        });

      if (insertError) {
        console.error('Error creating RSVP:', insertError);
        throw insertError;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in registerForEvent:', error);
    throw error;
  }
};

export const updateEventRSVP = async (eventId: string, status: 'attending' | 'maybe' | 'not_attending'): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if RSVP exists
    const { data: existingRSVP, error: checkError } = await supabase
      .from('event_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing RSVP:', checkError);
      throw checkError;
    }

    if (existingRSVP) {
      // Update existing RSVP
      const { error: updateError } = await supabase
        .from('event_rsvps')
        .update({ status })
        .eq('id', existingRSVP.id);

      if (updateError) {
        console.error('Error updating RSVP:', updateError);
        throw updateError;
      }
    } else {
      // Create new RSVP
      const { error: insertError } = await supabase
        .from('event_rsvps')
        .insert({
          event_id: eventId,
          user_id: user.id,
          status
        });

      if (insertError) {
        console.error('Error creating RSVP:', insertError);
        throw insertError;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in updateEventRSVP:', error);
    throw error;
  }
};

export const getEventAttendees = async (eventId: string): Promise<string[]> => {
  try {
    const { data: rsvps, error } = await supabase
      .from('event_rsvps')
      .select('user_id')
      .eq('event_id', eventId)
      .eq('status', 'attending');

    if (error) {
      console.error('Error fetching event attendees:', error);
      throw error;
    }

    return rsvps?.map(rsvp => rsvp.user_id) || [];
  } catch (error) {
    console.error('Error in getEventAttendees:', error);
    return [];
  }
};

export const linkRideToEvent = async (rideId: string, eventId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('event_rides')
      .insert({
        ride_id: rideId,
        event_id: eventId
      });

    if (error) {
      console.error('Error linking ride to event:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in linkRideToEvent:', error);
    throw error;
  }
};

export const getEventRides = async (eventId: string): Promise<EventRide[]> => {
  try {
    const { data: eventRides, error } = await supabase
      .from('event_rides')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching event rides:', error);
      throw error;
    }

    return eventRides || [];
  } catch (error) {
    console.error('Error in getEventRides:', error);
    return [];
  }
};
