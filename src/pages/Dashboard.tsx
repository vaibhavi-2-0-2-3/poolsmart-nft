
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { useWeb3 } from '@/hooks/useWeb3';
import { Web3Provider } from '@/hooks/useWeb3';
import { Calendar, Clock, MapPin, Users, Wallet, Car, AlertTriangle } from 'lucide-react';

// Mock data for user's rides
const userRides = [
  {
    id: '1',
    type: 'booked',
    driver: {
      name: 'John D.',
      address: '0x1234...5678',
      rating: 4.8,
    },
    departure: {
      location: 'San Francisco, CA',
      time: '2023-08-15T15:30:00',
    },
    destination: {
      location: 'Palo Alto, CA',
    },
    price: 0.015,
    status: 'confirmed',
  },
  {
    id: '2',
    type: 'offered',
    departure: {
      location: 'San Francisco, CA',
      time: '2023-08-16T09:00:00',
    },
    destination: {
      location: 'Oakland, CA',
    },
    price: 0.012,
    seatsAvailable: 3,
    seatsBooked: 1,
    status: 'active',
    passengers: [
      {
        name: 'Alice M.',
        address: '0x9876...5432',
      }
    ]
  }
];

const Dashboard = () => {
  const { address, balance } = useWeb3();

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
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
              <h2 className="text-2xl font-semibold">Wallet Not Connected</h2>
              <p className="text-muted-foreground mb-4">
                Please connect your wallet to view your dashboard and manage your rides.
              </p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <Web3Provider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-3">
                <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
              </div>
              <Card className="p-4 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground mb-1">Wallet Balance</div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-semibold">{balance || '0.00'}</span>
                  <span className="ml-1 text-sm text-muted-foreground">ETH</span>
                </div>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Booked Rides</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    iconLeft={<Car className="h-4 w-4" />}
                    onClick={() => window.location.href = '/rides'}
                  >
                    Find Rides
                  </Button>
                </div>
                
                {userRides.filter(ride => ride.type === 'booked').length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't booked any rides yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userRides.filter(ride => ride.type === 'booked').map(ride => (
                      <Card 
                        key={ride.id} 
                        className="overflow-hidden bg-accent/50"
                        padding="none"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                                <Car className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">Ride with {ride.driver.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(ride.departure.time)} at {formatTime(ride.departure.time)}
                                </div>
                              </div>
                            </div>
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              {ride.status === 'confirmed' ? 'Confirmed' : 'Completed'}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2 mb-4">
                            <div className="flex items-start">
                              <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                                <MapPin className="h-3 w-3 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">From</div>
                                <div className="text-sm">{ride.departure.location}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                                <MapPin className="h-3 w-3 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">To</div>
                                <div className="text-sm">{ride.destination.location}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <div className="text-xs text-muted-foreground">
                              Price
                            </div>
                            <div className="flex items-center text-sm font-medium">
                              {ride.price} ETH
                              <span className="ml-1 text-xs text-muted-foreground">
                                (${(ride.price * 2000).toFixed(2)})
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Offered Rides</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    iconLeft={<Car className="h-4 w-4" />}
                    onClick={() => window.location.href = '/rides'}
                  >
                    Offer a Ride
                  </Button>
                </div>
                
                {userRides.filter(ride => ride.type === 'offered').length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't offered any rides yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userRides.filter(ride => ride.type === 'offered').map(ride => (
                      <Card 
                        key={ride.id} 
                        className="overflow-hidden bg-accent/50"
                        padding="none"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                                <Car className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">Your ride to {ride.destination.location}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(ride.departure.time)} at {formatTime(ride.departure.time)}
                                </div>
                              </div>
                            </div>
                            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                              {ride.status === 'active' ? 'Active' : 'Completed'}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2 mb-4">
                            <div className="flex items-start">
                              <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                                <MapPin className="h-3 w-3 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">From</div>
                                <div className="text-sm">{ride.departure.location}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                                <MapPin className="h-3 w-3 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">To</div>
                                <div className="text-sm">{ride.destination.location}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm">
                                {ride.seatsBooked}/{parseInt(ride.seatsAvailable.toString()) + parseInt(ride.seatsBooked.toString())} seats booked
                              </span>
                            </div>
                            <div className="flex items-center text-sm font-medium">
                              {ride.price} ETH
                            </div>
                          </div>
                          
                          {ride.passengers && ride.passengers.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="text-xs font-medium mb-2">Passengers:</div>
                              {ride.passengers.map((passenger, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <div>{passenger.name}</div>
                                  <div className="text-xs text-muted-foreground">{passenger.address}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </Web3Provider>
  );
};

export default Dashboard;
