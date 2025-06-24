
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ChevronLeft, MapPin } from 'lucide-react';
import { getDriverById, Driver, getRides, Ride as FirebaseRide } from '@/lib/firebase';
import { ContactDriverModal } from '@/components/driver/ContactDriverModal';
import { ProfileEditModal } from '@/components/profile/ProfileEditModal';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { DriverProfileCard } from '@/components/driver/DriverProfileCard';
import { DriverRidesList } from '@/components/driver/DriverRidesList';
import { DriverReviews } from '@/components/driver/DriverReviews';
import { useToast } from '@/hooks/use-toast';
import { LiveTracking } from '@/components/tracking/LiveTracking';

const DriverProfile = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [driverRides, setDriverRides] = useState<FirebaseRide[]>([]);
  const [userRides, setUserRides] = useState<FirebaseRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [trackingRideId, setTrackingRideId] = useState<string | null>(null);
  const { toast } = useToast();
  const [userProfile2, setUserProfile2] = useState({
    username: 'User',
    avatar: ''
  });

  // Mock user session
  const mockUserId = 'user123';
  
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile2(JSON.parse(savedProfile));
    }
    
    if (driverId) {
      loadDriverData(driverId);
    }
  }, [driverId]);
  
  const loadDriverData = async (id: string) => {
    setLoading(true);
    
    try {
      const driverData = await getDriverById(id);
      
      if (driverData) {
        setDriver(driverData);
        
        const allRides = await getRides();
        const filteredDriverRides = allRides.filter(ride => ride.driver.id === id);
        setDriverRides(filteredDriverRides);

        const userBookedRides = filteredDriverRides.filter(
          ride => ride.passengers?.includes(mockUserId)
        );
        setUserRides(userBookedRides);
      }
    } catch (error) {
      console.error("Error loading driver data:", error);
      toast({
        title: "Error",
        description: "Failed to load driver information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = (data: { username: string; avatar: string }) => {
    setUserProfile2(data);
    localStorage.setItem('userProfile', JSON.stringify(data));
  };

  const handleContactDriver = () => {
    setContactModalOpen(true);
  };
  
  const handleStartTracking = (rideId: string) => {
    setTrackingRideId(trackingRideId === rideId ? null : rideId);
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
  
  const hasBookedRides = userRides.length > 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/rides">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to rides
              </Link>
            </Button>
            
            <DriverHeader 
              userProfile={userProfile2}
              onEditProfile={() => setProfileEditModalOpen(true)}
            />
          </div>
          
          {hasBookedRides && (
            <Card className="p-6 mb-6 border-green-500 border">
              <h3 className="text-lg font-semibold text-green-600 mb-2">Your Booked Rides with {driver?.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You have {userRides.length} upcoming {userRides.length === 1 ? 'ride' : 'rides'} with this driver.
              </p>
              <div className="space-y-2">
                {userRides.map((ride) => (
                  <div key={ride.id} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <div>
                      <div className="font-medium">{ride.departure.location} → {ride.destination.location}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(ride.departure.time).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">
                        {ride.status === 'active' ? 'Booked' : ride.status}
                      </div>
                      {(ride.status === 'active' || ride.status === 'in_progress') && (
                        <Button 
                          variant={trackingRideId === ride.id ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => handleStartTracking(ride.id)}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          {trackingRideId === ride.id ? 'Hide Tracking' : 'Track'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {trackingRideId && userRides.some(ride => ride.id === trackingRideId) && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-5 duration-300">
                  <LiveTracking
                    rideId={trackingRideId}
                    driverId={driver?.id || ''}
                    driverName={driver?.name || ''}
                    departure={userRides.find(r => r.id === trackingRideId)?.departure.location || ''}
                    destination={userRides.find(r => r.id === trackingRideId)?.destination.location || ''}
                    onClose={() => setTrackingRideId(null)}
                  />
                </div>
              )}
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DriverProfileCard 
                driver={driver!} 
                onContactDriver={handleContactDriver}
              />
            </div>
            
            <div className="lg:col-span-2">
              <DriverRidesList 
                driverName={driver?.name || ''}
                rides={driverRides}
              />
              
              <DriverReviews reviewCount={driver?.reviewCount || 0} />
            </div>
          </div>
        </div>
      </main>
      
      <ContactDriverModal 
        driverName={driver?.name || ''}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
      
      <ProfileEditModal 
        isOpen={profileEditModalOpen}
        onClose={() => setProfileEditModalOpen(false)}
        currentUsername={userProfile2.username}
        currentAvatar={userProfile2.avatar}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default DriverProfile;
