import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Star, User, Car, Send, DollarSign } from 'lucide-react';
import { getUserRides, getUserBookings, getUserRideRequests, SupabaseRide, SupabaseBooking, SupabaseRideRequest } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ProfileStatsCard } from '@/components/dashboard/ProfileStatsCard';
import { Badge } from '@/components/ui/badge';
import { ReviewModal } from '@/components/reviews/ReviewModal';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [myBookings, setMyBookings] = useState<SupabaseBooking[]>([]);
  const [offeredRides, setOfferedRides] = useState<SupabaseRide[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRideForReview, setSelectedRideForReview] = useState<{ rideId: string; driverId: string; driverName: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadUserData = async () => {
    setLoading(true);

    try {
      // Get user's bookings
      const userBookings = await getUserBookings();
      setMyBookings(userBookings);

      // Get user's offered rides
      const userRides = await getUserRides();
      setOfferedRides(userRides);

      // Get user's ride requests
      const userRequests = await getUserRideRequests();
      setMyRequests(userRequests);

    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error loading data",
        description: "Could not load your dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const isRideCompleted = (rideDate: string) => {
    const rideTime = new Date(rideDate);
    const now = new Date();
    return rideTime < now;
  };

  const handleOpenReviewModal = (rideId: string, driverId: string, driverName: string) => {
    setSelectedRideForReview({ rideId, driverId, driverName });
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedRideForReview(null);
  };

  // Calculate user stats
  const calculateStats = () => {
    const totalRidesGiven = offeredRides.length;
    const totalRidesTaken = myBookings.length;
    // Estimate CO2 saved based on average ride distance (50km) and emission factor (0.12kg CO2/km per person)
    const co2Saved = Math.round((totalRidesGiven + totalRidesTaken) * 50 * 0.12);
    const rating = 4.2; // This would come from actual reviews
    const totalReviews = Math.floor((totalRidesGiven + totalRidesTaken) * 0.7);

    return { totalRidesGiven, totalRidesTaken, co2Saved, rating, totalReviews };
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
              <p className="mt-4">Loading...</p>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const stats = calculateStats();

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-700">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user.email}!</p>
            </div>
            <div className="space-x-4 mt-4 md:mt-0">
              <Link to="/rides">
                <Button
                  variant="primary"
                  iconLeft={<Car className="h-4 w-4" />}
                >
                  Offer a New Ride
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Profile Stats Card */}
            <div className="lg:col-span-1">
              <ProfileStatsCard {...stats} />
            </div>

            {/* Quick Stats Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-amber-50 border-amber-100">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                    <Send className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">My Requests</h3>
                    <p className="text-lg font-semibold">{myRequests.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-green-50 border-green-100">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Car className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Confirmed Rides</h3>
                    <p className="text-lg font-semibold">{myBookings.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-blue-50 border-blue-100">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Offered Rides</h3>
                    <p className="text-lg font-semibold">{offeredRides.length}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="requests">My Requests ({myRequests.length})</TabsTrigger>
              <TabsTrigger value="bookings">Confirmed Rides ({myBookings.length})</TabsTrigger>
              <TabsTrigger value="offered">Offered Rides ({offeredRides.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              {loading ? (
                <Card className="p-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                  </div>
                </Card>
              ) : myRequests.length === 0 ? (
                <Card className="p-8 text-center">
                  <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-4">No Ride Requests</h2>
                  <p className="text-muted-foreground mb-6">
                    You haven't requested any rides yet. Browse available rides and send your first request!
                  </p>
                  <Button variant="primary" asChild>
                    <Link to="/rides">Find a Ride</Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((request: any) => {
                    const isCompleted = isRideCompleted(request.rides?.date);
                    const canReview = isCompleted && request.status === 'accepted';
                    
                    return (
                      <Card key={request.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">Request to {request.rides?.driver_name}</h3>
                              {getRequestStatusBadge(request.status)}
                              {isCompleted && (
                                <Badge className="bg-gray-100 text-gray-700">Completed</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{request.rides?.origin} → {request.rides?.destination}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(request.rides?.date)} at {formatTime(request.rides?.date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span>${request.rides?.price} per person</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/ride/${request.ride_id}`}>
                                View Ride
                              </Link>
                            </Button>
                            {canReview && (
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => handleOpenReviewModal(
                                  request.ride_id, 
                                  request.rides?.user_id || '', 
                                  request.rides?.driver_name || 'Driver'
                                )}
                              >
                                <Star className="h-4 w-4 mr-1" />
                                Review Driver
                              </Button>
                            )}
                          </div>
                        </div>
                        {request.message && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm italic">"{request.message}"</p>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="bookings">
              {loading ? (
                <Card className="p-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                  </div>
                </Card>
              ) : myBookings.length === 0 ? (
                <Card className="p-8 text-center">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-4">No Bookings Yet</h2>
                  <p className="text-muted-foreground mb-6">
                    You haven't booked any rides yet. Browse available rides and book your first trip!
                  </p>
                  <Button variant="primary" asChild>
                    <Link to="/rides">Find a Ride</Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((booking) => (
                    <Card key={booking.id} className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Booking #{booking.id.slice(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">Status: {booking.status}</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          {booking.status}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="offered">
              {loading ? (
                <Card className="p-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                  </div>
                </Card>
              ) : offeredRides.length === 0 ? (
                <Card className="p-8 text-center">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-4">No Offered Rides</h2>
                  <p className="text-muted-foreground mb-6">
                    You haven't offered any rides yet. Share your journey and earn money!
                  </p>
                  <Button variant="primary" asChild>
                    <Link to="/rides">Offer a Ride</Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {offeredRides.map((ride) => (
                    <Card key={ride.id} className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Ride #{ride.id.slice(0, 8)}</h3>
                        <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                          {ride.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-brand-600 mr-2" />
                            <span className="text-sm">From: {ride.origin}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-brand-600 mr-2" />
                            <span className="text-sm">To: {ride.destination}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-brand-600 mr-2" />
                            <span className="text-sm">{formatDate(ride.date)} at {formatTime(ride.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-brand-600 mr-2" />
                            <span className="text-sm">{ride.seats} seats available</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div>
                          <span className="text-lg font-bold">${ride.price}</span>
                          <span className="text-sm text-muted-foreground ml-2">per person</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit Ride
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Review Modal */}
      {selectedRideForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={handleCloseReviewModal}
          rideId={selectedRideForReview.rideId}
          driverId={selectedRideForReview.driverId}
          driverName={selectedRideForReview.driverName}
          onReviewSubmitted={loadUserData}
        />
      )}
    </div>
  );
};

export default Dashboard;
