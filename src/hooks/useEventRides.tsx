
import { useState, useEffect } from 'react';
import { getEventRides, EventRideDetails } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';

export const useEventRides = (eventId: string | null) => {
  const [rides, setRides] = useState<EventRideDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async () => {
    if (!eventId) {
      setRides([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching rides for event:', eventId);
      const eventRides = await getEventRides(eventId);
      console.log('Fetched rides:', eventRides);
      setRides(eventRides);
    } catch (err) {
      console.error('Error fetching event rides:', err);
      setError('Failed to load rides');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [eventId]);

  // Set up real-time subscription for rides with more specific targeting
  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel(`event-rides-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: `status=eq.active`
        },
        (payload) => {
          console.log('Rides table changed:', payload);
          fetchRides();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_rides',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          console.log('Event rides table changed:', payload);
          fetchRides();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ride_requests'
        },
        (payload) => {
          console.log('Ride requests changed, refreshing available seats:', payload);
          // Refresh rides to update available seats count
          fetchRides();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  return { rides, isLoading, error, refreshRides: fetchRides };
};
