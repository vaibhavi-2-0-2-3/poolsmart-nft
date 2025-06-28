import React, { useState, useEffect } from 'react';
import { EnhancedRideCard } from './EnhancedRideCard';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { getRides, createBooking, SupabaseRide } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ProtectedAction } from '@/components/auth/ProtectedAction';
import { Car, Filter } from 'lucide-react';

interface FilterState {
  priceRange: [number, number];
  timeWindow: { start: string; end: string };
  minSeats: number;
  genderPreference: 'any' | 'male' | 'female';
  languages: string[];
  sortBy: 'date' | 'price' | 'seats';
  sortOrder: 'asc' | 'desc';
}

interface SearchParams {
  from: string;
  to: string;
  date: string;
  time: string;
  seats: string;
}

interface RidesListProps {
  searchParams: SearchParams;
  refreshTrigger: number;
  filters: FilterState;
  onMessage: (driverId: string, driverName: string) => void;
}

export default function RidesList({ searchParams, refreshTrigger, filters, onMessage }: RidesListProps) {
  const [rides, setRides] = useState<SupabaseRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedRides, setBookedRides] = useState<Set<string>>(new Set());
  const [eventLinkedRides, setEventLinkedRides] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadRides();
  }, [refreshTrigger, searchParams]);

  const loadRides = async () => {
    try {
      setLoading(true);
      const fetchedRides = await getRides();
      
      // Mock some rides as event-linked for demo
      const eventLinked = new Set(fetchedRides.slice(0, 2).map(ride => ride.id));
      setEventLinkedRides(eventLinked);
      
      setRides(fetchedRides);
    } catch (error) {
      console.error("Error loading rides:", error);
      toast({
        title: "Error loading rides",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (rideId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book a ride.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createBooking(rideId);
      setBookedRides(prev => new Set([...prev, rideId]));
      toast({
        title: "Ride booked successfully!",
        description: "You will receive a confirmation email shortly.",
      });
    } catch (error) {
      console.error("Error booking ride:", error);
      toast({
        title: "Booking failed",
        description: "Unable to book this ride. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filterRides = (rides: SupabaseRide[]): SupabaseRide[] => {
    return rides.filter(ride => {
      if (searchParams.from && !ride.origin.toLowerCase().includes(searchParams.from.toLowerCase())) {
        return false;
      }
      if (searchParams.to && !ride.destination.toLowerCase().includes(searchParams.to.toLowerCase())) {
        return false;
      }
      if (ride.price < filters.priceRange[0] || ride.price > filters.priceRange[1]) {
        return false;
      }
      if (ride.seats < filters.minSeats) {
        return false;
      }
      return true;
    });
  };

  const sortRides = (rides: SupabaseRide[]): SupabaseRide[] => {
    return [...rides].sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'seats':
          comparison = a.seats - b.seats;
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  };

  const filteredAndSortedRides = sortRides(filterRides(rides));

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredAndSortedRides.length === 0) {
    return (
      <Card className="p-12 text-center border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Car className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Rides Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any rides matching your criteria. Try adjusting your search or filters.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Available Rides ({filteredAndSortedRides.length})
        </h2>
      </div>
      
      <div className="grid gap-6">
        {filteredAndSortedRides.map((ride) => (
          <ProtectedAction
            key={ride.id}
            requireAuth={false}
            fallback={
              <EnhancedRideCard
                ride={ride}
                onBook={handleBook}
                onMessage={onMessage}
                isBooked={bookedRides.has(ride.id)}
                isEventLinked={eventLinkedRides.has(ride.id)}
              />
            }
          >
            <EnhancedRideCard
              ride={ride}
              onBook={handleBook}
              onMessage={onMessage}
              isBooked={bookedRides.has(ride.id)}
              isEventLinked={eventLinkedRides.has(ride.id)}
            />
          </ProtectedAction>
        ))}
      </div>
    </div>
  );
}
