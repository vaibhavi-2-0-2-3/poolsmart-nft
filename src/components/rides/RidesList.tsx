
import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Calendar, Clock, MapPin, Users, Star, Info, Filter } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

// Placeholder data for rides
const mockRides = [
  {
    id: '1',
    driver: {
      name: 'John D.',
      address: '0x1234...5678',
      rating: 4.8,
      reviewCount: 56,
    },
    departure: {
      location: 'San Francisco, CA',
      time: '2023-08-15T15:30:00',
    },
    destination: {
      location: 'Palo Alto, CA',
    },
    price: 0.015,
    seatsAvailable: 3,
    verified: true,
  },
  {
    id: '2',
    driver: {
      name: 'Sarah M.',
      address: '0x5678...9012',
      rating: 4.5,
      reviewCount: 32,
    },
    departure: {
      location: 'Oakland, CA',
      time: '2023-08-15T16:45:00',
    },
    destination: {
      location: 'San Jose, CA',
    },
    price: 0.025,
    seatsAvailable: 2,
    verified: true,
  },
  {
    id: '3',
    driver: {
      name: 'Mike P.',
      address: '0x9012...3456',
      rating: 4.2,
      reviewCount: 18,
    },
    departure: {
      location: 'Palo Alto, CA',
      time: '2023-08-15T17:15:00',
    },
    destination: {
      location: 'Mountain View, CA',
    },
    price: 0.008,
    seatsAvailable: 1,
    verified: false,
  }
];

export const RidesList = () => {
  const [rides, setRides] = useState(mockRides);
  const { address } = useWeb3();
  const { toast } = useToast();

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

  const handleBookRide = (rideId: string) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to book a ride",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking confirmed",
      description: `You've booked ride #${rideId}. Confirmation will appear in your dashboard.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Available Rides</h2>
        
        <Button 
          variant="outline" 
          size="sm"
          iconLeft={<Filter className="h-4 w-4" />}
        >
          Filter
        </Button>
      </div>
      
      {rides.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Info className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">No rides available</h3>
            <p className="text-muted-foreground">
              There are no rides available at the moment. Please check back later.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <Card 
              key={ride.id} 
              className="overflow-hidden transition-all hover:shadow-md"
              padding="none"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
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
                  </div>
                  {ride.verified && (
                    <div className="flex items-center justify-center h-8 px-3 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Verified Driver
                    </div>
                  )}
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
                
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                        <Users className="h-4 w-4 text-brand-600" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Seats Available</div>
                        <div className="text-sm font-medium">{ride.seatsAvailable} {ride.seatsAvailable === 1 ? 'seat' : 'seats'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Price</div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold">{ride.price} ETH</span>
                        <span className="ml-1 text-xs text-muted-foreground">
                          (${(ride.price * 2000).toFixed(2)})
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      onClick={() => handleBookRide(ride.id)}
                    >
                      Book Ride
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
