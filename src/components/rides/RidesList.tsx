
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { MapPin, Calendar, Clock, Star, Users } from 'lucide-react';
import { getRides, createBooking, SupabaseRide } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedAction } from '../auth/ProtectedAction';

interface RidesListProps {
  searchParams: {
    from: string;
    to: string;
    date: string;
    time: string;
    seats: string;
  };
  refreshTrigger: number;
}

const RidesList: React.FC<RidesListProps> = ({ searchParams, refreshTrigger }) => {
  const [rides, setRides] = useState<SupabaseRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingRide, setBookingRide] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadRides();
  }, [refreshTrigger]);

  const loadRides = async () => {
    try {
      setLoading(true);
      const allRides = await getRides();
      
      // Filter rides based on search params
      let filteredRides = allRides;
      
      if (searchParams.from) {
        filteredRides = filteredRides.filter(ride => 
          ride.origin.toLowerCase().includes(searchParams.from.toLowerCase())
        );
      }
      
      if (searchParams.to) {
        filteredRides = filteredRides.filter(ride => 
          ride.destination.toLowerCase().includes(searchParams.to.toLowerCase())
        );
      }
      
      if (searchParams.date) {
        filteredRides = filteredRides.filter(ride => {
          const rideDate = new Date(ride.date).toLocaleDateString();
          const searchDate = new Date(searchParams.date).toLocaleDateString();
          return rideDate === searchDate;
        });
      }
      
      if (searchParams.seats && parseInt(searchParams.seats) > 0) {
        filteredRides = filteredRides.filter(ride => 
          ride.seats >= parseInt(searchParams.seats)
        );
      }
      
      setRides(filteredRides);
    } catch (error) {
      console.error("Error loading rides:", error);
      toast({
        title: "Error",
        description: "Failed to load rides. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (rideId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book a ride.",
        variant: "destructive",
      });
      return;
    }

    setBookingRide(rideId);
    try {
      await createBooking(rideId);
      toast({
        title: "Ride booked",
        description: "Your ride has been successfully booked!",
      });
      loadRides(); // Refresh the list
    } catch (error) {
      console.error("Error booking ride:", error);
      toast({
        title: "Booking failed",
        description: "Unable to book this ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingRide(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No rides found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or check back later for new rides.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <Card key={ride.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">
                    {ride.driver_name?.charAt(0) || 'D'}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">
                    {ride.driver_name || 'Anonymous Driver'}
                  </div>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="ml-1 text-sm">4.5 (New driver)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${ride.price}</div>
                <div className="text-sm text-muted-foreground">per person</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-brand-600 mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">From</div>
                  <div className="font-medium">{ride.origin}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-brand-600 mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">To</div>
                  <div className="font-medium">{ride.destination}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-brand-600 mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">Date & Time</div>
                  <div className="font-medium">
                    {formatDate(ride.date)} at {formatTime(ride.date)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-brand-600 mr-2" />
                <span className="text-sm">
                  {ride.seats} {ride.seats === 1 ? 'seat' : 'seats'} available
                </span>
              </div>
              
              <ProtectedAction
                requireAuth={true}
                fallback={
                  <Button variant="primary" disabled>
                    Sign in to Book
                  </Button>
                }
              >
                <Button 
                  variant="primary"
                  onClick={() => handleBookRide(ride.id)}
                  disabled={bookingRide === ride.id || ride.seats === 0 || ride.user_id === user?.id}
                >
                  {bookingRide === ride.id ? 'Booking...' : 
                   ride.seats === 0 ? 'Full' : 
                   ride.user_id === user?.id ? 'Your Ride' : 'Book Ride'}
                </Button>
              </ProtectedAction>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RidesList;
