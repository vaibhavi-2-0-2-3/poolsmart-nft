import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Star, Users, ArrowRight, Verified, Leaf, Car } from 'lucide-react';
import { getRides, createRideRequest, SupabaseRide, getProfile, getUserRideRequests } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedAction } from '../auth/ProtectedAction';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FilterState } from './EnhancedRidesFilter';

interface RidesListProps {
  searchParams: {
    from: string;
    to: string;
    date: string;
    time: string;
    seats: string;
  };
  refreshTrigger: number;
  filters?: FilterState;
}

interface RideWithProfile extends SupabaseRide {
  driver_profile?: {
    username?: string;
    avatar_url?: string;
    full_name?: string;
  };
  is_event_linked?: boolean;
  user_requested?: boolean;
  request_status?: 'pending' | 'accepted' | 'rejected';
}

const RidesList: React.FC<RidesListProps> = ({ searchParams, refreshTrigger, filters }) => {
  const [rides, setRides] = useState<RideWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingRide, setRequestingRide] = useState<string | null>(null);
  const [userRequests, setUserRequests] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadRides();
    if (user) {
      loadUserRequests();
    }
  }, [refreshTrigger, searchParams, filters, user]);

  const loadUserRequests = async () => {
    try {
      const requests = await getUserRideRequests();
      const pendingRequestRideIds = requests
        .filter(req => req.status === 'pending')
        .map(req => req.ride_id);
      setUserRequests(pendingRequestRideIds);
    } catch (error) {
      console.error('Error loading user requests:', error);
    }
  };

  const loadRides = async () => {
    try {
      setLoading(true);
      const allRides = await getRides();

      // Load driver profiles for each ride and check if it's event-linked
      const ridesWithProfiles = await Promise.all(
        allRides.map(async (ride) => {
          try {
            // Check if ride is linked to any event by looking for event_rides connection
            const { data: eventRide } = await supabase
              .from('event_rides')
              .select('event_id')
              .eq('ride_id', ride.id)
              .single();

            return {
              ...ride,
              driver_profile: {
                username: ride.driver_name,
                avatar_url: null,
                full_name: ride.driver_name,
              },
              is_event_linked: !!eventRide,
              user_requested: userRequests.includes(ride.id)
            };
          } catch (error) {
            console.error('Error loading driver profile:', error);
            return {
              ...ride,
              is_event_linked: false,
              user_requested: userRequests.includes(ride.id)
            };
          }
        })
      );

      // Apply search filters
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

      // Apply enhanced filters
      if (filters) {
        // Price range filter
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) {
          filteredRides = filteredRides.filter(ride =>
            ride.price >= filters.priceRange[0] && ride.price <= filters.priceRange[1]
          );
        }

        // Time window filter
        if (filters.timeWindow.start || filters.timeWindow.end) {
          filteredRides = filteredRides.filter(ride => {
            const rideTime = new Date(ride.date).toTimeString().slice(0, 5);
            const startTime = filters.timeWindow.start || '00:00';
            const endTime = filters.timeWindow.end || '23:59';
            return rideTime >= startTime && rideTime <= endTime;
          });
        }

        // Minimum seats filter
        if (filters.minSeats > 1) {
          filteredRides = filteredRides.filter(ride => ride.seats >= filters.minSeats);
        }

        // Sort rides
        filteredRides.sort((a, b) => {
          let aValue, bValue;
          switch (filters.sortBy) {
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'seats':
              aValue = a.seats;
              bValue = b.seats;
              break;
            case 'date':
            default:
              aValue = new Date(a.date).getTime();
              bValue = new Date(b.date).getTime();
              break;
          }
          
          if (filters.sortOrder === 'desc') {
            return bValue - aValue;
          }
          return aValue - bValue;
        });
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

  const handleRequestRide = async (rideId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to request a ride.",
        variant: "destructive",
      });
      return;
    }

    setRequestingRide(rideId);
    try {
      await createRideRequest(rideId);
      setUserRequests(prev => [...prev, rideId]);
      toast({
        title: "Request sent",
        description: "Your ride request has been sent to the driver!",
      });
      loadRides();
    } catch (error) {
      console.error("Error requesting ride:", error);
      toast({
        title: "Request failed",
        description: "Unable to send ride request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRequestingRide(null);
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

  const getDriverInitials = (ride: RideWithProfile) => {
    const name = ride.driver_profile?.full_name || ride.driver_profile?.username || ride.driver_name || 'Driver';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const getSeatsDisplay = (availableSeats: number) => {
    return Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < availableSeats ? 'bg-brand-500' : 'bg-gray-200'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 border-0 shadow-md">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <Card className="p-12 text-center border-0 shadow-md">
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">No rides found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any rides matching your criteria. Try adjusting your search or filters, or check back later for new rides.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {rides.length} ride{rides.length !== 1 ? 's' : ''} available
        </h2>
        <Badge variant="secondary" className="text-sm">
          Updated just now
        </Badge>
      </div>

      {rides.map((ride) => {
        const hasRequested = userRequests.includes(ride.id);
        const isOwnRide = ride.user_id === user?.id;
        
        return (
          <Card key={ride.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
            <Link
              to={`/ride/${ride.id}`}
              className="block"
            >
              <div className="p-6">
                {/* Header with Driver Info and Price */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-14 w-14 border-2 border-brand-100">
                      {ride.driver_profile?.avatar_url ? (
                        <AvatarImage src={ride.driver_profile.avatar_url} alt="Driver" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 font-bold text-lg">
                          {getDriverInitials(ride)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">
                          {ride.driver_profile?.full_name || ride.driver_profile?.username || ride.driver_name || 'Anonymous Driver'}
                        </h3>
                        <Verified className="h-4 w-4 text-brand-600" />
                        {ride.is_event_linked && (
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                            Event-linked
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-xs text-muted-foreground">(24 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-brand-600">${ride.price}</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                      <Leaf className="h-3 w-3" />
                      <span>CO₂ saved</span>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Departure</div>
                      <div className="font-semibold text-gray-800">{ride.origin}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Destination</div>
                      <div className="font-semibold text-gray-800">{ride.destination}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Date & Time</div>
                      <div className="font-semibold text-gray-800">
                        {formatDate(ride.date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        at {formatTime(ride.date)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seats Visualization */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Available Seats</span>
                    <span className="text-sm text-brand-600 font-semibold">{ride.seats} seats</span>
                  </div>
                  <div className="flex gap-1">
                    {getSeatsDisplay(ride.seats)}
                  </div>
                </div>

                {/* Bottom Section with Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      Request to join
                    </Badge>
                    {ride.is_event_linked && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        <Car className="h-3 w-3 mr-1" />
                        Event ride
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="group-hover:border-brand-300 transition-colors"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Button>

                    <ProtectedAction
                      requireAuth={true}
                      fallback={
                        <Button variant="primary" size="sm" disabled>
                          Sign in to Request
                        </Button>
                      }
                    >
                      <Button
                        variant={hasRequested ? "secondary" : "primary"}
                        size="sm"
                        onClick={(e) => !hasRequested && !isOwnRide && handleRequestRide(ride.id, e)}
                        disabled={requestingRide === ride.id || ride.seats === 0 || isOwnRide || hasRequested}
                        className={hasRequested 
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100 cursor-default" 
                          : "bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 font-semibold px-6"
                        }
                      >
                        {requestingRide === ride.id ? 'Sending...' :
                          hasRequested ? 'Request Sent' :
                          ride.seats === 0 ? 'Full' :
                          isOwnRide ? 'Your Ride' : 'Request to Join'}
                      </Button>
                    </ProtectedAction>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};

export default RidesList;
