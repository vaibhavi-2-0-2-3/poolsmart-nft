
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { RidesList } from '@/components/rides/RidesList';
import { useWeb3 } from '@/hooks/useWeb3';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Calendar, Clock, Users, Wallet, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { addRide } from '@/lib/db';

const offerRideSchema = z.object({
  from: z.string().min(3, { message: 'Departure location is required' }),
  to: z.string().min(3, { message: 'Destination is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  seats: z.string().min(1, { message: 'Available seats is required' }),
  price: z.string().min(1, { message: 'Price is required' })
});

const Rides = () => {
  const { address } = useWeb3();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: '1'
  });
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const form = useForm<z.infer<typeof offerRideSchema>>({
    resolver: zodResolver(offerRideSchema),
    defaultValues: {
      from: '',
      to: '',
      date: '',
      time: '',
      seats: '1',
      price: '0.01'
    }
  });

  const handleSearchParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that we have at least from and to locations
    if (!searchParams.from || !searchParams.to) {
      toast({
        title: "Missing information",
        description: "Please provide departure and destination locations",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Searching rides",
      description: "Finding available rides matching your criteria...",
    });

    // Trigger a search by updating the searchSubmitted state
    setSearchSubmitted(true);
    
    // Reset after a delay to allow for multiple searches
    setTimeout(() => {
      setSearchSubmitted(false);
    }, 100);
  };

  const onOfferRideSubmit = async (values: z.infer<typeof offerRideSchema>) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to offer a ride",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create driver ID that matches exactly what's expected by DriverProfile
      const driverId = address.substring(0, 6);
      
      // Create the ride in our database
      const newRide = {
        id: Date.now().toString(),
        driver: {
          id: driverId,
          name: `Driver ${address.substring(0, 4)}`,
          address: address,
          rating: 5.0, // Default rating for new drivers
          reviewCount: 0,
          bio: "New driver on the platform",
          completedRides: 0,
          joinedDate: new Date().toISOString().split('T')[0],
          car: {
            model: "Unknown",
            year: "2023",
            color: "Unknown"
          },
          verified: false
        },
        departure: {
          location: values.from,
          time: `${values.date}T${values.time}:00`,
        },
        destination: {
          location: values.to,
        },
        price: parseFloat(values.price),
        seatsAvailable: parseInt(values.seats),
        verified: false, // New drivers are not verified by default
        status: 'active' as const,
        passengers: []
      };
      
      addRide(newRide);
      
      toast({
        title: "Ride offered",
        description: "Your ride has been listed successfully",
      });
      
      setIsOfferDialogOpen(false);
      form.reset();
      
      // Navigate to dashboard after successful listing
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error("Error offering ride:", error);
      toast({
        title: "Transaction error",
        description: "There was an error with the blockchain transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2 p-6">
              <form onSubmit={handleSearch}>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isSearchExpanded ? 'mb-4' : ''}`}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      type="text" 
                      name="from"
                      placeholder="From" 
                      className="pl-10"
                      value={searchParams.from}
                      onChange={handleSearchParamChange}
                      onClick={() => setIsSearchExpanded(true)}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      type="text" 
                      name="to"
                      placeholder="To" 
                      className="pl-10"
                      value={searchParams.to}
                      onChange={handleSearchParamChange}
                      onClick={() => setIsSearchExpanded(true)}
                    />
                  </div>
                </div>
                
                {isSearchExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        type="date" 
                        name="date"
                        className="pl-10" 
                        value={searchParams.date}
                        onChange={handleSearchParamChange}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        type="time" 
                        name="time"
                        className="pl-10" 
                        value={searchParams.time}
                        onChange={handleSearchParamChange}
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        type="number" 
                        name="seats"
                        min="1" 
                        max="10" 
                        className="pl-10"
                        value={searchParams.seats}
                        onChange={handleSearchParamChange}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button 
                    type="submit" 
                    variant="primary"
                  >
                    Search Rides
                  </Button>
                </div>
              </form>
            </Card>
            
            <Card className="p-6 flex flex-col justify-center items-center text-center">
              <Car className="h-12 w-12 text-brand-600 mb-4" />
              <h3 className="text-lg font-medium mb-3">Have a car? Offer a ride</h3>
              <p className="text-muted-foreground mb-4">
                Share your ride, reduce costs and help reduce carbon emissions.
              </p>
              <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="primary">Offer a Ride</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Offer a Ride</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to offer your ride on the blockchain.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onOfferRideSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="from"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <Input placeholder="Departure location" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="to"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>To</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <Input placeholder="Destination" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input type="date" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input type="time" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="seats"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Seats</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <Users className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input type="number" min="1" max="10" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price (ETH)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <Wallet className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input type="number" min="0.001" step="0.001" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          variant="primary"
                        >
                          List Ride
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </Card>
          </div>
          
          <RidesList searchParams={searchSubmitted ? searchParams : undefined} />
        </div>
      </main>
    </div>
  );
};

export default Rides;
