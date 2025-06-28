
import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Star, User, Car } from 'lucide-react';
import { getUserRides, getUserBookings, SupabaseRide, SupabaseBooking } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ProfileStatsCard } from '@/components/dashboard/ProfileStatsCard';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [myBookings, setMyBookings] = useState<SupabaseBooking[]>([]);
  const [offeredRides, setOfferedRides] = useState<SupabaseRide[]>([]);
  const [loading, setLoading] = useState(true);
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
              <Card className="p-6 bg-green-50 border-green-100">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Car className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">My Bookings</h3>
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
              
              <Card className="p-6 bg-brand-50 border-brand-100">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Profile</h3>
                    <p className="text-lg font-semibold">Active</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="bookings">My Bookings ({myBookings.length})</TabsTrigger>
              <TabsTrigger value="offered">Offered Rides ({offeredRides.length})</TabsTrigger>
            </TabsList>
            
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
    </div>
  );
};

export default Dashboard;
