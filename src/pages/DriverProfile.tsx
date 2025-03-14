
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ChevronLeft } from 'lucide-react';
import { getDriverById, Driver, getRides, Ride } from '@/lib/db';
import { Link } from 'react-router-dom';
import { ContactDriverModal } from '@/components/driver/ContactDriverModal';
import { ProfileEditModal } from '@/components/profile/ProfileEditModal';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { DriverProfileCard } from '@/components/driver/DriverProfileCard';
import { DriverRidesList } from '@/components/driver/DriverRidesList';
import { DriverReviews } from '@/components/driver/DriverReviews';

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

  const handleProfileSave = (data: { username: string; avatar: string }) => {
    setUserProfile(data);
    
    // Save to localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(data));
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
          <DriverHeader 
            userProfile={userProfile}
            onEditProfile={() => setProfileEditModalOpen(true)}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DriverProfileCard 
                driver={driver} 
                onContactDriver={() => setContactModalOpen(true)}
              />
            </div>
            
            <div className="lg:col-span-2">
              <DriverRidesList 
                driverName={driver.name}
                rides={driverRides}
              />
              
              <DriverReviews reviewCount={driver.reviewCount} />
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
