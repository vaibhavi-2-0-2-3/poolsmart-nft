
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { MapPin, Calendar, Clock, Star, Users, ArrowRight } from 'lucide-react';
import { getRides, createBooking, SupabaseRide, getProfile } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedAction } from '../auth/ProtectedAction';
import { ReviewModal } from '../reviews/ReviewModal';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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

interface RideWithProfile extends SupabaseRide {
  driver_profile?: {
    username?: string;
    avatar_url?: string;
  };
}

const RidesList: React.FC<RidesListProps> = ({ searchParams, refreshTrigger }) => {
  const [rides, setRides] = useState<RideWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingRide, setBookingRide] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    rideId: string;
    driverId: string;
    driverName: string;
  }>({
    isOpen: false,
    rideId: '',
    driverId: '',
    driverName: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadRides();
  }, [refreshTrigger, searchParams]);

  const loadRides = async () => {
    try {
      setLoading(true);
      const allRides = await getRides();

      // Load driver profiles for each ride
      const ridesWithProfiles = await Promise.all(
        allRides.map(async (ride) => {
          try {
            // For now, we'll use a simple approach since we don't have a direct way to get profiles by user_id
            // In a real app, you might want to create a view or function to join this data
            return {
              ...ride,
              driver_profile: {
                username: ride.driver_name,
                avatar_url: null, // Will be populated when we can properly fetch profiles
              }
            };
          } catch (error) {
            console.error('Error loading driver profile:', error);
            return ride;
          }
        })
      );

      // Filter rides based on search params
      let filteredRides = ridesWithProfiles;

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

  const handleBookRide = async (rideId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleOpenReviewModal = (ride: RideWithProfile, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setReviewModal({
      isOpen: true,
      rideId: ride.id,
      driverId: ride.user_id,
      driverName: ride.driver_profile?.username || ride.driver_name || 'Unknown Driver',
    });
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

  const getDriverInitials = (ride: RideWithProfile) => {
    const name = ride.driver_profile?.username || ride.driver_name || 'D';
    return name.charAt(0).toUpperCase();
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
    <>
      <div className="space-y-4">
        {rides.map((ride) => (
          <Link
            key={ride.id}
            to={`/ride/${ride.id}`}
            className="block transition-transform duration-200 hover:scale-[1.02]"
          >
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      {ride.driver_profile?.avatar_url ? (
                        <AvatarImage src={ride.driver_profile.avatar_url} alt="Driver" />
                      ) : (
                        <AvatarFallback className="bg-brand-100 text-brand-600 font-semibold">
                          {getDriverInitials(ride)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {ride.driver_profile?.username || ride.driver_name || 'Anonymous Driver'}
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

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>

                    {user && user.id !== ride.user_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleOpenReviewModal(ride, e)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    )}

                    <ProtectedAction
                      requireAuth={true}
                      fallback={
                        <Button variant="primary" size="sm" disabled>
                          Sign in to Book
                        </Button>
                      }
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => handleBookRide(ride.id, e)}
                        disabled={bookingRide === ride.id || ride.seats === 0 || ride.user_id === user?.id}
                      >
                        {bookingRide === ride.id ? 'Booking...' :
                          ride.seats === 0 ? 'Full' :
                            ride.user_id === user?.id ? 'Your Ride' : 'Quick Book'}
                      </Button>
                    </ProtectedAction>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal(prev => ({ ...prev, isOpen: false }))}
        rideId={reviewModal.rideId}
        driverId={reviewModal.driverId}
        driverName={reviewModal.driverName}
      />
    </>
  );
};

export default RidesList;
