
import React, { useState, useEffect, useCallback } from 'react';
import { getRides, Ride, bookRide } from '@/lib/firebase';
import { Card } from '@/components/shared/Card';
import { Car, Clock, MapPin, Users, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { RideActions } from './RideActions';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { PaymentModal } from './PaymentModal';

interface RidesListProps {
  searchParams?: {
    from?: string;
    to?: string;
    date?: string;
    time?: string;
    seats?: string;
  };
  refreshTrigger?: number;
}

const RidesList: React.FC<RidesListProps> = ({ searchParams = {}, refreshTrigger = 0 }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);
  const { address, connect, userProfile } = useWeb3();
  const { toast } = useToast();

  const fetchRides = useCallback(async () => {
    setLoading(true);
    try {
      console.log('RidesList: Fetching rides with refreshTrigger:', refreshTrigger);
      const allRides = await getRides();
      console.log('RidesList: Fetched rides count:', allRides.length);
      
      // Filter rides based on search params if provided
      let filteredRides = allRides;
      
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
          try {
            const rideDate = new Date(ride.departure.time).toLocaleDateString();
            const searchDate = new Date(searchParams.date || '').toLocaleDateString();
            return rideDate === searchDate;
          } catch (e) {
            console.error('Error comparing dates:', e);
            return false;
          }
        });
      }
      
      if (searchParams.seats) {
        const requiredSeats = parseInt(searchParams.seats || '1');
        filteredRides = filteredRides.filter(ride => 
          ride.seatsAvailable >= requiredSeats
        );
      }
      
      console.log('RidesList: Filtered rides count:', filteredRides.length);
      setRides(filteredRides);
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast({
        title: 'Error',
        description: 'Failed to load rides. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams, refreshTrigger, toast]);
  
  // This effect runs whenever refreshTrigger changes
  useEffect(() => {
    console.log("RidesList: useEffect triggered with refreshTrigger:", refreshTrigger);
    fetchRides();
  }, [fetchRides, refreshTrigger]);

  const handleStatusChange = async () => {
    // Refresh rides when status changes
    fetchRides();
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookRide = async (ride: Ride) => {
    if (!address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (address === ride.driver.address) {
      toast({
        title: "Cannot book your own ride",
        description: "You cannot book a ride that you are driving.",
        variant: "destructive",
      });
      return;
    }

    setBookingInProgress(ride.id);
    
    try {
      const success = await bookRide(ride.id, address);
      
      if (success) {
        toast({
          title: "Ride booked",
          description: "You have successfully booked this ride. View the driver's profile for more details.",
        });
        
        // Refresh the rides list
        fetchRides();
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
        description: "An error occurred while booking the ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingInProgress(null);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh rides after payment
    handleStatusChange();
    setPaymentModalOpen(false);
    setSelectedRide(null);
  };

  if (loading) {
    return (
      <div className="mt-6 animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded mt-4"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <Card className="mt-6 p-8 text-center">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No rides found</h2>
        <p className="text-muted-foreground mb-6">
          {Object.keys(searchParams).some(key => !!searchParams[key as keyof typeof searchParams])
            ? "No rides match your search criteria. Try different parameters."
            : "There are no rides available at the moment. Try again later."}
        </p>
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {rides.map((ride) => {
        const isUserPassenger = ride.passengers?.includes(address || '');
        
        return (
          <Card key={ride.id} className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center">
                    <Car className="h-6 w-6 text-brand-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {ride.departure.location} → {ride.destination.location}
                  </h3>
                  <Link to={`/driver/${ride.driver.id}`} className="flex items-center text-sm text-muted-foreground mt-1 hover:text-brand-600 transition-colors">
                    <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                    {ride.driver.rating.toFixed(1)} · {ride.driver.name}
                  </Link>
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-xl font-semibold mr-4">
                  {ride.price.toFixed(3)} ETH
                </div>
                <RideActions 
                  ride={ride} 
                  isDriver={address === ride.driver.address}
                  isPassenger={isUserPassenger}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {new Date(ride.departure.time).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{ride.seatsAvailable} seats available</span>
              </div>
              <div className="flex justify-end">
                {!address ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleConnect}
                  >
                    Connect Wallet to Book
                  </Button>
                ) : (
                  address !== ride.driver.address && ride.status === 'active' && !isUserPassenger ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBookRide(ride)}
                      disabled={bookingInProgress === ride.id}
                    >
                      {bookingInProgress === ride.id ? 'Booking...' : 'Book Ride'}
                    </Button>
                  ) : isUserPassenger ? (
                    <Link to={`/driver/${ride.driver.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        View Driver
                      </Button>
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          </Card>
        );
      })}
      
      {selectedRide && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          rideId={selectedRide.id}
          amount={selectedRide.price}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default RidesList;
