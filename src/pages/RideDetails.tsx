import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ChevronLeft, MapPin, Clock, Users, DollarSign, Shield, ExternalLink, CreditCard, MessageCircle, Star } from 'lucide-react';
import { getRides, createRideRequest, SupabaseRide, getUserRideRequests } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedAction } from '@/components/auth/ProtectedAction';
import { useToast } from '@/hooks/use-toast';
import { MessagingModal } from '@/components/messaging/MessagingModal';
import { CalendarAlert } from '@/components/calendar/CalendarAlert';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import RideRequests from '@/components/rides/RideRequests';
import { formatDate, formatTime } from '@/lib/utils';

const RideDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<SupabaseRide | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadRideDetails();
    if (user) {
      loadUserRequests();
    }
  }, [id, user]);

  const loadUserRequests = async () => {
    try {
      const requests = await getUserRideRequests();
      setUserRequests(requests);
    } catch (error) {
      console.error('Error loading user requests:', error);
    }
  };

  const loadRideDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const rides = await getRides();
      const foundRide = rides.find(r => r.id === id);
      setRide(foundRide || null);
    } catch (error) {
      console.error("Error loading ride details:", error);
      toast({
        title: "Error",
        description: "Failed to load ride details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async () => {
    if (!ride || !user) return;

    setRequesting(true);
    try {
      await createRideRequest(ride.id);
      toast({
        title: "Request sent successfully!",
        description: "The driver will review your request and respond soon.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error requesting ride:", error);
      toast({
        title: "Request failed",
        description: "Unable to send ride request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRequesting(false);
    }
  };

  const getGoogleMapsUrl = (origin: string, destination: string) => {
    return `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`;
  };

  const isRideCompleted = (rideDate: string) => {
    const rideTime = new Date(rideDate);
    const now = new Date();
    return rideTime < now;
  };

  const hasAcceptedRequest = () => {
    if (!ride || !user) return false;
    return userRequests.some(request => 
      request.ride_id === ride.id && 
      request.user_id === user.id && 
      request.status === 'accepted'
    );
  };

  const canReviewRide = () => {
    if (!ride || !user) return false;
    const isCompleted = isRideCompleted(ride.date);
    const wasAccepted = hasAcceptedRequest();
    const isNotOwnRide = user.id !== ride.user_id;
    
    return isCompleted && wasAccepted && isNotOwnRide;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Ride Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find the ride you were looking for.
              </p>
              <Button variant="outline" asChild>
                <Link to="/rides">Back to Rides</Link>
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const isOwnRide = user?.id === ride.user_id;
  const rideCompleted = isRideCompleted(ride.date);
  const showReviewButton = canReviewRide();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/rides">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to rides
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Weather Widget */}
              <WeatherWidget location={ride.origin} date={ride.date} />

              {/* Route Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Ride Details</h1>
                  {rideCompleted && (
                    <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                      Completed
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium">From</div>
                        <div className="text-lg">{ride.origin}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(ride.origin)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Map
                      </a>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium">To</div>
                        <div className="text-lg">{ride.destination}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(ride.destination)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Map
                      </a>
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-gray-600 mr-3" />
                      <div className="font-medium">Departure</div>
                    </div>
                    <div className="text-lg">{formatDate(ride.date)}</div>
                    <div className="text-lg font-semibold">{formatTime(ride.date)}</div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={getGoogleMapsUrl(ride.origin, ride.destination)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Route on Google Maps
                    </a>
                  </Button>
                </div>
              </Card>

              {/* Driver Information */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Driver</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mr-4">
                      <span className="text-brand-600 font-semibold text-lg">
                        {ride.driver_name?.charAt(0) || 'D'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{ride.driver_name || 'Anonymous Driver'}</div>
                      <div className="text-sm text-muted-foreground">New driver</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setMessagingOpen(true)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`/driver/${ride.user_id}`}>
                        View Profile
                      </Link>
                    </Button>
                    {showReviewButton && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setReviewModalOpen(true)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Review Driver
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Ride Requests (only for ride owner) */}
              {isOwnRide && (
                <RideRequests 
                  rideId={ride.id} 
                  onRequestUpdate={loadRideDetails}
                />
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Calendar Integration */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Add to Calendar</h3>
                <CalendarAlert
                  rideDate={ride.date}
                  origin={ride.origin}
                  destination={ride.destination}
                  driverName={ride.driver_name || 'Driver'}
                  notes="Requested via PoolSmart-NFT"
                />
              </Card>

              {/* Booking Card */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">Price per person</span>
                    </div>
                    <span className="text-2xl font-bold">${ride.price}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Available seats</span>
                    </div>
                    <span className="text-lg font-semibold">{ride.seats}</span>
                  </div>

                  {!isOwnRide && !rideCompleted && (
                    <ProtectedAction
                      requireAuth={true}
                      fallback={
                        <Button variant="primary" className="w-full" disabled>
                          Sign in to Request
                        </Button>
                      }
                    >
                      <Button 
                        variant="primary"
                        className="w-full"
                        onClick={handleRequestRide}
                        disabled={requesting || ride.seats === 0}
                      >
                        {requesting ? 'Sending Request...' : 
                         ride.seats === 0 ? 'Fully Booked' : 'Request to Join'}
                      </Button>
                    </ProtectedAction>
                  )}

                  {isOwnRide && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
                        This is your ride - check requests below
                      </p>
                    </div>
                  )}

                  {rideCompleted && !isOwnRide && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                        This ride has been completed
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Secure Payment */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold">Secure Process</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Driver approval required</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Request protection guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Free to request</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Messaging Modal */}
      <MessagingModal
        isOpen={messagingOpen}
        onClose={() => setMessagingOpen(false)}
        recipientId={ride.user_id}
        recipientName={ride.driver_name || 'Driver'}
        currentUserId={user?.id || 'current-user'}
        currentUserName={user?.email?.split('@')[0] || 'You'}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        rideId={ride.id}
        driverId={ride.user_id}
        driverName={ride.driver_name || 'Driver'}
        onReviewSubmitted={() => {
          loadRideDetails();
          setReviewModalOpen(false);
        }}
      />
    </div>
  );
};

export default RideDetails;
