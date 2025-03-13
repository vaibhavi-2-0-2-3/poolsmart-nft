
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Car, 
  Shield, 
  MessageCircle,
  Phone,
  Clock,
  Users
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';

// Mock drivers data (in a real app, you'd fetch this from the blockchain or backend)
const mockDrivers = [
  {
    id: '1',
    name: 'John D.',
    address: '0x1234...5678',
    fullAddress: '0x1234567890123456789012345678901234567890',
    avatar: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 56,
    verified: true,
    bio: 'Professional driver with 5+ years of experience. I offer comfortable and reliable rides at affordable prices.',
    memberSince: 'January 2022',
    languages: ['English', 'Spanish'],
    vehicle: {
      model: 'Tesla Model 3',
      year: '2021',
      color: 'White',
      licensePlate: 'BTC-123',
      features: ['Air Conditioning', 'Leather Seats', 'USB Charging']
    },
    upcomingRides: [
      {
        id: 'ride-1',
        from: 'San Francisco, CA',
        to: 'Palo Alto, CA',
        date: '2023-08-15',
        time: '15:30',
        price: 0.015,
        seatsAvailable: 3
      },
      {
        id: 'ride-2',
        from: 'Palo Alto, CA',
        to: 'San Francisco, CA',
        date: '2023-08-16',
        time: '08:15',
        price: 0.018,
        seatsAvailable: 2
      }
    ],
    reviews: [
      { 
        id: 'review-1', 
        user: 'Sarah M.', 
        date: '2023-07-10', 
        rating: 5, 
        comment: 'Great driver! On time and very friendly.' 
      },
      { 
        id: 'review-2', 
        user: 'Mike P.', 
        date: '2023-06-25', 
        rating: 4, 
        comment: 'Good ride, clean car. Would ride again.' 
      },
      { 
        id: 'review-3', 
        user: 'Emily L.', 
        date: '2023-06-12', 
        rating: 5, 
        comment: 'Excellent service and great conversation!' 
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah M.',
    address: '0x5678...9012',
    fullAddress: '0x5678901234567890123456789012345678901234',
    avatar: '/placeholder.svg',
    rating: 4.5,
    reviewCount: 32,
    verified: true,
    bio: 'Friendly driver who loves meeting new people. I always strive to make your journey comfortable and enjoyable.',
    memberSince: 'March 2022',
    languages: ['English', 'French'],
    vehicle: {
      model: 'Toyota Prius',
      year: '2020',
      color: 'Blue',
      licensePlate: 'ETH-456',
      features: ['Air Conditioning', 'Bluetooth Audio', 'Pet Friendly']
    },
    upcomingRides: [
      {
        id: 'ride-3',
        from: 'Oakland, CA',
        to: 'San Jose, CA',
        date: '2023-08-15',
        time: '16:45',
        price: 0.025,
        seatsAvailable: 2
      }
    ],
    reviews: [
      { 
        id: 'review-4', 
        user: 'John D.', 
        date: '2023-07-05', 
        rating: 4, 
        comment: 'Pleasant ride, driver was punctual.' 
      },
      { 
        id: 'review-5', 
        user: 'Lisa R.', 
        date: '2023-06-20', 
        rating: 5, 
        comment: 'One of the best rides I\'ve had. Sarah is an amazing driver!' 
      }
    ]
  },
  {
    id: '3',
    name: 'Mike P.',
    address: '0x9012...3456',
    fullAddress: '0x9012345678901234567890123456789012345678',
    avatar: '/placeholder.svg',
    rating: 4.2,
    reviewCount: 18,
    verified: false,
    bio: 'Casual driver on weekends. I like to offset my commute costs and reduce carbon emissions by sharing rides.',
    memberSince: 'May 2022',
    languages: ['English'],
    vehicle: {
      model: 'Honda Civic',
      year: '2019',
      color: 'Red',
      licensePlate: 'DOT-789',
      features: ['Air Conditioning', 'GPS Navigation']
    },
    upcomingRides: [
      {
        id: 'ride-4',
        from: 'Palo Alto, CA',
        to: 'Mountain View, CA',
        date: '2023-08-15',
        time: '17:15',
        price: 0.008,
        seatsAvailable: 1
      }
    ],
    reviews: [
      { 
        id: 'review-6', 
        user: 'David K.', 
        date: '2023-07-15', 
        rating: 4, 
        comment: 'Good driver, arrived on time.' 
      },
      { 
        id: 'review-7', 
        user: 'Anna T.', 
        date: '2023-06-30', 
        rating: 4, 
        comment: 'Nice car and smooth ride.' 
      }
    ]
  }
];

const DriverProfile = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const { toast } = useToast();
  const { address } = useWeb3();

  useEffect(() => {
    // In a real app, you would fetch the driver data from your backend or blockchain
    // For this example, we're just using mock data
    const fetchDriverData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const foundDriver = mockDrivers.find(d => d.id === driverId);
        setDriver(foundDriver || null);
        setIsLoading(false);
      }, 500); // Simulate a network request
    };

    fetchDriverData();
  }, [driverId]);

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
      description: `You've booked ride #${rideId}. Check your dashboard for details.`,
    });
  };

  const handleContactDriver = () => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to contact the driver",
        variant: "destructive",
      });
      return;
    }

    setIsContactDialogOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${driver.name}`,
    });
    setIsContactDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Driver Not Found</h2>
              <p className="text-muted-foreground mb-6">The driver you're looking for doesn't exist or has been removed.</p>
              <Link to="/rides">
                <Button variant="primary">Back to Rides</Button>
              </Link>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Link to="/rides" className="text-brand-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Rides
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Driver Profile Card */}
            <Card className="lg:col-span-1 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <img src={driver.avatar} alt={driver.name} />
                </Avatar>
                <h1 className="text-2xl font-semibold">{driver.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} 
                        className={`h-4 w-4 ${i < Math.floor(driver.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">{driver.rating} ({driver.reviewCount} reviews)</span>
                </div>
                {driver.verified && (
                  <Badge variant="outline" className="mt-3 bg-green-100 text-green-700 border-green-200">
                    <Shield className="h-3 w-3 mr-1" /> Verified Driver
                  </Badge>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
                  <p className="text-sm">{driver.bio}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Member Since</h3>
                  <p className="text-sm">{driver.memberSince}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {driver.languages.map((language: string) => (
                      <Badge key={language} variant="secondary" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Wallet Address</h3>
                  <p className="text-xs font-mono bg-muted p-2 rounded-md overflow-hidden text-ellipsis">
                    {driver.fullAddress}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  className="w-full"
                  iconLeft={<MessageCircle className="h-4 w-4" />}
                  onClick={handleContactDriver}
                >
                  Contact Driver
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  iconLeft={<Phone className="h-4 w-4" />}
                >
                  Request Phone Number
                </Button>
              </div>
            </Card>

            {/* Tabs for Rides, Vehicle, and Reviews */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="rides" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="rides">Upcoming Rides</TabsTrigger>
                  <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                {/* Rides Tab */}
                <TabsContent value="rides" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Upcoming Rides by {driver.name}</h2>
                  
                  {driver.upcomingRides.length === 0 ? (
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground">No upcoming rides available</p>
                    </Card>
                  ) : (
                    driver.upcomingRides.map((ride: any) => (
                      <Card key={ride.id} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <MapPin className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">From</div>
                                <div className="text-sm font-medium">{ride.from}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <MapPin className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">To</div>
                                <div className="text-sm font-medium">{ride.to}</div>
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
                                <div className="text-sm font-medium">{ride.date}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                <Clock className="h-4 w-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Time</div>
                                <div className="text-sm font-medium">{ride.time}</div>
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
                      </Card>
                    ))
                  )}
                </TabsContent>
                
                {/* Vehicle Tab */}
                <TabsContent value="vehicle">
                  <Card className="p-6">
                    <div className="flex items-center mb-6">
                      <Car className="h-10 w-10 text-brand-600 mr-4" />
                      <div>
                        <h3 className="text-xl font-medium">{driver.vehicle.model}</h3>
                        <p className="text-muted-foreground">{driver.vehicle.year} • {driver.vehicle.color}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">License Plate</h4>
                        <p className="bg-muted py-1 px-3 rounded inline-block">{driver.vehicle.licensePlate}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {driver.vehicle.features.map((feature: string) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                
                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Reviews ({driver.reviews.length})</h2>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} 
                            className={`h-5 w-5 ${i < Math.floor(driver.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">{driver.rating}</span>
                    </div>
                  </div>
                  
                  {driver.reviews.map((review: any) => (
                    <Card key={review.id} className="p-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{review.user}</h3>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      {/* Contact Driver Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact {driver.name}</DialogTitle>
            <DialogDescription>
              Send a message to inquire about rides or ask questions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendMessage} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                className="w-full h-32 p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600" 
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary">Send Message</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverProfile;
