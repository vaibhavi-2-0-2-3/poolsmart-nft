
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { 
  Star, 
  Calendar, 
  Car, 
  Shield, 
  Award, 
  MapPin,
  MessageCircle,
  Clock,
  ChevronLeft,
  UserRound,
  Edit
} from 'lucide-react';
import { getDriverById, Driver, getRides, Ride } from '@/lib/db';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ContactDriverModal } from '@/components/driver/ContactDriverModal';
import { ProfileEditModal } from '@/components/profile/ProfileEditModal';

const DriverProfile = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [driverRides, setDriverRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: 'User',
    avatar: ''
  });
  
  useEffect(() => {
    // Check if we have user profile in localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    if (driverId) {
      loadDriverData(driverId);
    }
  }, [driverId]);
  
  const loadDriverData = (id: string) => {
    setLoading(true);
    
    // Get driver details
    const driverData = getDriverById(id);
    
    if (driverData) {
      setDriver(driverData);
      
      // Get all rides by this driver
      const allRides = getRides();
      const driverRides = allRides.filter(ride => ride.driver.id === id);
      setDriverRides(driverRides);
    }
    
    setLoading(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatRideDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatRideTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleProfileSave = (data: { username: string; avatar: string }) => {
    setUserProfile(data);
    
    // Save to localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(data));
  };
  
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!driver) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Driver Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find the driver you were looking for.
              </p>
              <Button variant="outline" asChild>
                <Link to="/rides">Back to Rides</Link>
              </Button>
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
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              iconLeft={<ChevronLeft className="h-4 w-4" />}
              asChild
            >
              <Link to="/rides">Back to Rides</Link>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  {userProfile.avatar ? (
                    <AvatarImage src={userProfile.avatar} alt={userProfile.username} />
                  ) : (
                    <AvatarFallback className="bg-brand-100 text-brand-600">
                      {getInitials(userProfile.username)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium">{userProfile.username}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                iconLeft={<Edit className="h-4 w-4" />}
                onClick={() => setProfileEditModalOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                    <UserRound className="h-12 w-12 text-brand-600" />
                  </div>
                  
                  <h1 className="text-2xl font-bold">{driver.name}</h1>
                  
                  <div className="flex items-center mt-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} 
                          className={`h-4 w-4 ${i < Math.floor(driver.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">
                      {driver.rating} ({driver.reviewCount} reviews)
                    </span>
                  </div>
                  
                  {driver.verified && (
                    <div className="flex items-center text-green-700 mt-2">
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="text-sm">Verified Driver</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-border pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
                      <p className="text-sm">{driver.bio || "No bio available"}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-brand-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium">{driver.completedRides || 0} rides completed</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-brand-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium">Member since {driver.joinedDate ? formatDate(driver.joinedDate) : "Unknown"}</div>
                      </div>
                    </div>
                    
                    {driver.car && (
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-brand-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium">{driver.car.model} ({driver.car.year})</div>
                          <div className="text-xs text-muted-foreground">{driver.car.color}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    iconLeft={<MessageCircle className="h-4 w-4" />}
                    onClick={() => setContactModalOpen(true)}
                  >
                    Contact Driver
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Upcoming Rides by {driver.name}</h2>
                
                {driverRides.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming rides scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {driverRides.map((ride) => (
                      <div key={ride.id} className="border border-border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                              <MapPin className="h-4 w-4 text-brand-600" />
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block">From</span>
                              <span className="font-medium">{ride.departure.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                              <MapPin className="h-4 w-4 text-brand-600" />
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block">To</span>
                              <span className="font-medium">{ride.destination.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                              <Calendar className="h-4 w-4 text-brand-600" />
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block">Date</span>
                              <span className="font-medium">{formatRideDate(ride.departure.time)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                              <Clock className="h-4 w-4 text-brand-600" />
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block">Time</span>
                              <span className="font-medium">{formatRideTime(ride.departure.time)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="ml-auto">
                              <span className="text-xs text-muted-foreground block">Price</span>
                              <span className="font-medium">{ride.price} ETH</span>
                            </div>
                            
                            <Link to="/rides" className="ml-4">
                              <Button variant="primary" size="sm">
                                View Ride
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
              
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-6">Reviews</h2>
                
                {driver.reviewCount === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {[...Array(Math.min(3, driver.reviewCount))].map((_, i) => (
                      <div key={i} className="border-b border-border pb-4 last:border-0">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-gray-600">
                                {String.fromCharCode(65 + i)}
                              </span>
                            </div>
                            <span className="font-medium">Passenger {String.fromCharCode(65 + i)}</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} 
                                className={`h-4 w-4 ${j < 4 + (i % 2) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">
                          {[
                            "Great driver, very punctual and friendly. The car was clean and the ride was comfortable.",
                            "Excellent experience! Driver was professional and got me to my destination on time.",
                            "Reliable and safe driver. Would definitely ride with them again."
                          ][i]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Contact Driver Modal */}
      <ContactDriverModal 
        driverName={driver.name}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
      
      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={profileEditModalOpen}
        onClose={() => setProfileEditModalOpen(false)}
        currentUsername={userProfile.username}
        currentAvatar={userProfile.avatar}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default DriverProfile;
