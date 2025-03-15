
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, MapPin, Calendar, Clock, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ride, getRides, bookRide } from '@/lib/firebase';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

// Add the optional searchParams prop to improve flexibility
interface RidesListProps {
  searchParams?: {
    from?: string;
    to?: string;
    date?: string;
    time?: string;
    seats?: string;
  };
}

const RidesList: React.FC<RidesListProps> = ({ searchParams }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useWeb3();
  const { toast } = useToast();
  
  useEffect(() => {
    loadRides();
  }, []);
  
  // Add a useEffect to filter rides when searchParams changes
  useEffect(() => {
    if (searchParams && (searchParams.from || searchParams.to || searchParams.date)) {
      filterRides();
    }
  }, [searchParams]);
  
  const loadRides = async () => {
    setLoading(true);
    try {
      const ridesData = await getRides();
      setRides(ridesData);
    } catch (error) {
      console.error("Error loading rides:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const filterRides = async () => {
    if (!searchParams) return;
    
    setLoading(true);
    try {
      const allRides = await getRides();
      let filteredRides = [...allRides];
      
      if (searchParams.from) {
        filteredRides = filteredRides.filter(ride => 
          ride.departure.location.toLowerCase().includes(searchParams.from?.toLowerCase() || '')
        );
      }
      
      if (searchParams.to) {
        filteredRides = filteredRides.filter(ride => 
          ride.destination.location.toLowerCase().includes(searchParams.to?.toLowerCase() || '')
        );
      }
      
      if (searchParams.date) {
        filteredRides = filteredRides.filter(ride => {
          const rideDate = new Date(ride.departure.time).toLocaleDateString();
          const searchDate = new Date(searchParams.date || '').toLocaleDateString();
          return rideDate === searchDate;
        });
      }
      
      if (searchParams.seats) {
        filteredRides = filteredRides.filter(ride => 
          ride.seatsAvailable >= parseInt(searchParams.seats || '1', 10)
        );
      }
      
      setRides(filteredRides);
    } catch (error) {
      console.error("Error filtering rides:", error);
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
  
  const handleBookRide = async (rideId: string) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to book a ride.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await bookRide(rideId, address);
      if (success) {
        toast({
          title: "Ride booked!",
          description: "You have successfully booked this ride.",
        });
        // Refresh rides to update the list
        loadRides();
      } else {
        toast({
          title: "Booking failed",
          description: "Failed to book this ride. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error booking ride:", error);
      toast({
        title: "Booking error",
        description: "An error occurred while booking. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <div className="mt-6">
      {loading ? (
        <Card className="p-8">
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-brand-600" />
          </div>
        </Card>
      ) : rides.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">No rides available at the moment.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {rides.map((ride) => (
            <Card key={ride.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Link to={`/driver/${ride.driver.id}`} className="flex items-center hover:opacity-80 transition-opacity">
                    <Avatar className="h-10 w-10">
                      {ride.driver.avatar ? (
                        <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
                      ) : (
                        <AvatarFallback className="bg-brand-100 text-brand-600">
                          {getInitials(ride.driver.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">{ride.driver.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(ride.driver.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-muted-foreground">({ride.driver.rating})</span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    {ride.seatsAvailable > 0 ? 'Available' : 'Full'}
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
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="text-lg font-semibold">{ride.price} ETH</div>
                  </div>
                  
                  {ride.seatsAvailable > 0 ? (
                    <Button variant="primary" size="sm" onClick={() => handleBookRide(ride.id)}>
                      Book Ride
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" disabled>
                      <Users className="mr-2 h-4 w-4" />
                      Full
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RidesList;
