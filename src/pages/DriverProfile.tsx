
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ChevronLeft } from 'lucide-react';
import { getDriverById, Driver, getRides, Ride as FirebaseRide, getUserProfile } from '@/lib/firebase';
import { ContactDriverModal } from '@/components/driver/ContactDriverModal';
import { ProfileEditModal } from '@/components/profile/ProfileEditModal';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { DriverProfileCard } from '@/components/driver/DriverProfileCard';
import { DriverRidesList } from '@/components/driver/DriverRidesList';
import { DriverReviews } from '@/components/driver/DriverReviews';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

// We're explicitly removing the import from db.ts to avoid type conflicts
// import { Ride as DbRide } from '@/lib/db';

const DriverProfile = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [driverRides, setDriverRides] = useState<FirebaseRide[]>([]);
  const [userRides, setUserRides] = useState<FirebaseRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const { address, userProfile } = useWeb3();
  const { toast } = useToast();
  const [userProfile2, setUserProfile2] = useState({
    username: 'User',
    avatar: ''
  });
  
  useEffect(() => {
    // Check if we have user profile in localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile2(JSON.parse(savedProfile));
    }
    
    if (driverId) {
      loadDriverData(driverId);
    }
  }, [driverId, address]);
  
  const loadDriverData = async (id: string) => {
    setLoading(true);
    
    try {
      // Get driver details
      const driverData = await getDriverById(id);
      
      if (driverData) {
        setDriver(driverData);
        
        // Get all rides by this driver
        const allRides = await getRides();
        const filteredDriverRides = allRides.filter(ride => ride.driver.id === id);
        setDriverRides(filteredDriverRides);

        // If user is logged in, get their booked rides with this driver
        if (address) {
          const userBookedRides = filteredDriverRides.filter(
            ride => ride.passengers?.includes(address)
          );
          setUserRides(userBookedRides);
        }
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
    
    // Save to localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(data));
  };

  const handleContactDriver = () => {
    if (!address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to contact the driver.",
        variant: "destructive",
      });
      return;
    }
    
    setContactModalOpen(true);
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
              <h3 className="text-lg font-semibold text-green-600 mb-2">Your Booked Rides with {driver.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You have {userRides.length} upcoming {userRides.length === 1 ? 'ride' : 'rides'} with this driver.
              </p>
              <div className="space-y-2">
                {userRides.map((ride) => (
                  <div key={ride.id} className="flex justify-between items-center p-3 bg-green-50 rounded-md">
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
                    <div className="text-sm font-semibold">
                      {ride.status === 'active' ? 'Booked' : ride.status}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DriverProfileCard 
                driver={driver} 
                onContactDriver={handleContactDriver}
              />
            </div>
            
            <div className="lg:col-span-2">
              <DriverRidesList 
                driverName={driver.name}
                rides={driverRides}
              />
              
              <DriverReviews reviewCount={driver.reviewCount || 0} />
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
        currentUsername={userProfile2.username}
        currentAvatar={userProfile2.avatar}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default DriverProfile;
