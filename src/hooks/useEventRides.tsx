
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
      const eventRides = await getEventRides(eventId);
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

  // Set up real-time subscription for rides
  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel('event-rides-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides'
        },
        () => {
          fetchRides();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_rides'
        },
        () => {
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
