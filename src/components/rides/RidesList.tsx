
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Calendar, Clock, MapPin, Users, Star, Info, Filter } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';
import { bookRide } from '@/lib/web3';
import { Ride, getRides, bookRideForUser, searchRides, getDriverById } from '@/lib/db';
import { RidesFilter, FilterOptions } from './RidesFilter';

export const RidesList = ({ searchParams }: { searchParams?: any }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    sortBy: '',
    sortOrder: 'asc',
    priceRange: {
      min: '',
      max: ''
    },
    verifiedOnly: false
  });
  
  const { address } = useWeb3();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadRides();
  }, []);

  useEffect(() => {
    if (searchParams && Object.keys(searchParams).some(key => searchParams[key])) {
      const filteredRides = searchRides({
        from: searchParams.from,
        to: searchParams.to,
        date: searchParams.date,
        time: searchParams.time,
        seats: searchParams.seats ? parseInt(searchParams.seats) : undefined
      });
      setRides(filteredRides);
      setFilteredRides(filteredRides);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters(activeFilters);
  }, [rides, activeFilters]);

  const loadRides = () => {
    setLoading(true);
    const allRides = getRides();
    setRides(allRides);
    setFilteredRides(allRides);
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

  const handleBookRide = async (rideId: string, price: number) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to book a ride",
        variant: "destructive",
      });
      return;
    }

    try {
      const blockchainSuccess = await bookRide(rideId, price);
      
      const dbSuccess = bookRideForUser(address, rideId);
      
      if (blockchainSuccess && dbSuccess) {
        toast({
          title: "Booking confirmed",
          description: `You've booked ride #${rideId}. Check your dashboard for details.`,
        });
        
        const updatedRides = rides.map(ride => 
          ride.id === rideId 
            ? { ...ride, seatsAvailable: Math.max(0, ride.seatsAvailable - 1) }
            : ride
        );
        setRides(updatedRides);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast({
          title: "Booking failed",
          description: "There was an error processing your booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error booking ride:", error);
      toast({
        title: "Transaction error",
        description: "There was an error with the blockchain transaction",
        variant: "destructive",
      });
    }
  };

  const applyFilters = (filters: FilterOptions) => {
    let result = [...rides];
    
    // Apply price range filter
    if (filters.priceRange.min) {
      result = result.filter(ride => ride.price >= parseFloat(filters.priceRange.min));
    }
    
    if (filters.priceRange.max) {
      result = result.filter(ride => ride.price <= parseFloat(filters.priceRange.max));
    }
    
    // Apply verified driver filter
    if (filters.verifiedOnly) {
      result = result.filter(ride => ride.verified);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'date':
            comparison = new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime();
            break;
          case 'rating':
            comparison = a.driver.rating - b.driver.rating;
            break;
        }
        
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    
    setFilteredRides(result);
  };

  const handleFilterApply = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Available Rides</h2>
        
        <Button 
          variant="outline" 
          size="sm"
          iconLeft={<Filter className="h-4 w-4" />}
          onClick={() => setIsFilterOpen(true)}
        >
          Filter
        </Button>
        
        <RidesFilter 
          open={isFilterOpen} 
          onOpenChange={setIsFilterOpen}
          onApplyFilters={handleFilterApply}
        />
      </div>
      
      {loading ? (
        <Card className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        </Card>
      ) : filteredRides.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Info className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">No rides available</h3>
            <p className="text-muted-foreground">
              There are no rides available matching your criteria. Please try a different search.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRides.map((ride) => (
            <Card 
              key={ride.id} 
              className="overflow-hidden transition-all hover:shadow-md"
              padding="none"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Link to={`/driver/${ride.driver.id}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
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
                  </Link>
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
                      onClick={() => handleBookRide(ride.id, ride.price)}
                      disabled={ride.seatsAvailable === 0}
                    >
                      {ride.seatsAvailable === 0 ? 'Fully Booked' : 'Book Ride'}
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
