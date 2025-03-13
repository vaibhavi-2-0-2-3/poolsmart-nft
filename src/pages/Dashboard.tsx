
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Star, Wallet, Car } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { Ride, getUserRides, getRides } from '@/lib/db';

const Dashboard = () => {
  const { address } = useWeb3();
  const [activeTab, setActiveTab] = useState('bookings');
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [offeredRides, setOfferedRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (address) {
      loadUserData(address);
    } else {
      setLoading(false);
    }
  }, [address]);
  
  const loadUserData = (userAddress: string) => {
    setLoading(true);
    
    // Get bookings (rides user has booked)
    const userBookings = getUserRides(userAddress);
    setMyRides(userBookings);
    
    // Get offered rides (rides user has created)
    const allRides = getRides();
    const userOfferedRides = allRides.filter(ride => ride.driver.address === userAddress);
    setOfferedRides(userOfferedRides);
    
    setLoading(false);
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
  
  if (!address) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="p-8 text-center">
              <Car className="h-12 w-12 text-brand-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6">
                Please connect your wallet to access your dashboard.
              </p>
              <div className="max-w-xs mx-auto">
                {/* Wallet connect button will be shown in the navbar */}
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Link to="/rides">
              <Button 
                variant="primary" 
                iconLeft={<Car className="h-4 w-4" />}
              >
                Offer a New Ride
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-brand-50 border-brand-100">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mr-4">
                  <Wallet className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Wallet</h3>
                  <p className="text-lg font-semibold">{address.slice(0, 6)}...{address.slice(-4)}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-green-50 border-green-100">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">My Rides</h3>
                  <p className="text-lg font-semibold">{myRides.length}</p>
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="offered">Offered Rides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings">
              {loading ? (
                <Card className="p-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                  </div>
                </Card>
              ) : myRides.length === 0 ? (
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
                  {myRides.map((ride) => (
                    <Card key={ride.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <Link to={`/driver/${ride.driver.id}`} className="flex items-center hover:opacity-80 transition-opacity">
                            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium">{ride.driver.name}</h3>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} 
                                      className={`h-3 w-3 ${i < Math.floor(ride.driver.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="ml-1 text-xs text-muted-foreground">({ride.driver.rating})</span>
                              </div>
                            </div>
                          </Link>
                          
                          <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            Confirmed
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <MapPin className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">From</div>
                                <div className="text-sm font-medium">{ride.departure.location}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <MapPin className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">To</div>
                                <div className="text-sm font-medium">{ride.destination.location}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <Calendar className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Date</div>
                                <div className="text-sm font-medium">{formatDate(ride.departure.time)}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <Clock className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Time</div>
                                <div className="text-sm font-medium">{formatTime(ride.departure.time)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-between items-center">
                          <div>
                            <div className="text-xs text-muted-foreground">Price paid</div>
                            <div className="text-lg font-semibold">{ride.price} ETH</div>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            Contact Driver
                          </Button>
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
                    You haven't offered any rides yet. Share your journey and earn cryptocurrency!
                  </p>
                  <Button variant="primary" asChild>
                    <Link to="/rides">Offer a Ride</Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {offeredRides.map((ride) => (
                    <Card key={ride.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-semibold">Ride #{ride.id}</h3>
                          <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                            {ride.status === 'active' ? 'Active' : ride.status}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <MapPin className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">From</div>
                                <div className="text-sm font-medium">{ride.departure.location}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <MapPin className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">To</div>
                                <div className="text-sm font-medium">{ride.destination.location}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <Calendar className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Date</div>
                                <div className="text-sm font-medium">{formatDate(ride.departure.time)}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <Clock className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Time</div>
                                <div className="text-sm font-medium">{formatTime(ride.departure.time)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div className="mb-4 sm:mb-0">
                            <div className="text-xs text-muted-foreground">Status</div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-brand-600" />
                              <span>
                                {ride.seatsAvailable} of {parseInt(ride.seatsAvailable.toString()) + (ride.passengers?.length || 0)} seats available
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground">Price</div>
                              <div className="text-lg font-semibold">{ride.price} ETH</div>
                            </div>
                            
                            <Button variant="outline" size="sm">
                              Edit Ride
                            </Button>
                          </div>
                        </div>
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
