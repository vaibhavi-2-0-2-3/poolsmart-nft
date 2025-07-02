
import { useState, useEffect, useCallback } from 'react';
import { getEventRides, EventRideDetails } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';

export const useEventRides = (eventId: string | null) => {
  const [rides, setRides] = useState<EventRideDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = useCallback(async () => {
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
      // Only set error for actual failures, not for empty results
      if (err && typeof err === 'object' && 'code' in err) {
        setError('Failed to load rides');
      }
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) {
      setRides([]);
      setIsLoading(false);
      return;
    }
    
    fetchRides();
  }, [eventId, fetchRides]);

  // Set up real-time subscription with better error handling
  useEffect(() => {
    if (!eventId) return;

    let mounted = true;
    let channel: any = null;

    const setupRealTimeSubscription = () => {
      try {
        channel = supabase
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
              if (mounted) {
                console.log('Rides table changed:', payload);
                fetchRides();
              }
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
              if (mounted) {
                console.log('Event rides table changed:', payload);
                fetchRides();
              }
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
              if (mounted) {
                console.log('Ride requests changed, refreshing available seats:', payload);
                fetchRides();
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to real-time updates');
            } else if (status === 'CHANNEL_ERROR') {
              console.warn('Real-time subscription error, continuing without real-time updates');
            }
          });
      } catch (error) {
        console.warn('Failed to set up real-time subscription:', error);
        // Continue without real-time updates rather than breaking the component
      }
    };

    // Set up subscription with a small delay to avoid race conditions
    const timeoutId = setTimeout(setupRealTimeSubscription, 1000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn('Error removing channel:', error);
        }
      }
    };
  }, [eventId, fetchRides]);

  return { rides, isLoading, error, refreshRides: fetchRides };
};
