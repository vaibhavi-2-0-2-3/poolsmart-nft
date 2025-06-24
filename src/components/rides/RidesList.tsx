
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { MapPin, Calendar, Clock, Star, Users } from 'lucide-react';
import { getRides, bookRide, Ride } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

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
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingRide, setBookingRide] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock user session
  const mockUserId = 'user123';

  useEffect(() => {
    console.log("RidesList: refreshTrigger changed to", refreshTrigger);
    loadRides();
  }, [refreshTrigger]);

  const loadRides = async () => {
    try {
      setLoading(true);
      console.log("RidesList: Loading rides from Firebase...");
      const allRides = await getRides();
      console.log("RidesList: Loaded rides:", allRides.length);
      
      // Filter rides based on search params
      let filteredRides = allRides;
      
      if (searchParams.from) {
        filteredRides = filteredRides.filter(ride => 
          ride.departure.location.toLowerCase().includes(searchParams.from.toLowerCase())
        );
      }
      
      if (searchParams.to) {
        filteredRides = filteredRides.filter(ride => 
          ride.destination.location.toLowerCase().includes(searchParams.to.toLowerCase())
        );
      }
      
      if (searchParams.date) {
        filteredRides = filteredRides.filter(ride => {
          const rideDate = new Date(ride.departure.time).toLocaleDateString();
          const searchDate = new Date(searchParams.date).toLocaleDateString();
          return rideDate === searchDate;
        });
      }
      
      if (searchParams.seats && parseInt(searchParams.seats) > 0) {
        filteredRides = filteredRides.filter(ride => 
          ride.seatsAvailable >= parseInt(searchParams.seats)
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
    setBookingRide(rideId);
    try {
      const success = await bookRide(rideId, mockUserId);
      if (success) {
        toast({
          title: "Ride booked",
          description: "Your ride has been successfully booked!",
        });
        loadRides(); // Refresh the list
      } else {
        toast({
          title: "Booking failed",
          description: "Unable to book this ride. It may be full.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error booking ride:", error);
      toast({
        title: "Error",
        description: "There was an error booking your ride.",
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
                    {ride.driver.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <Link 
                    to={`/driver/${ride.driver.id}`}
                    className="font-semibold hover:text-brand-600 transition-colors"
                  >
                    {ride.driver.name}
                  </Link>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="ml-1 text-sm">
                      {ride.driver.rating} ({ride.driver.reviewCount} reviews)
                    </span>
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
                  <div className="font-medium">{ride.departure.location}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-brand-600 mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">To</div>
                  <div className="font-medium">{ride.destination.location}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-brand-600 mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">Date & Time</div>
                  <div className="font-medium">
                    {formatDate(ride.departure.time)} at {formatTime(ride.departure.time)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-brand-600 mr-2" />
                <span className="text-sm">
                  {ride.seatsAvailable} {ride.seatsAvailable === 1 ? 'seat' : 'seats'} available
                </span>
              </div>
              
              <Button 
                variant="primary"
                onClick={() => handleBookRide(ride.id)}
                disabled={bookingRide === ride.id || ride.seatsAvailable === 0}
              >
                {bookingRide === ride.id ? 'Booking...' : 
                 ride.seatsAvailable === 0 ? 'Full' : 'Book Ride'}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RidesList;
