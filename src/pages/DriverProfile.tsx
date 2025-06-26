
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import {
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import { getRides, SupabaseRide } from '@/lib/supabase';
import { ContactDriverModal } from '@/components/driver/ContactDriverModal';
import { EnhancedProfileModal } from '@/components/profile/EnhancedProfileModal';
import { MessagingModal } from '@/components/messaging/MessagingModal';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { DriverRidesList } from '@/components/driver/DriverRidesList';
import { DriverReviews } from '@/components/driver/DriverReviews';
import { DriverPreferences } from '@/components/driver/DriverPreferences';
import { DriverPolicies } from '@/components/driver/DriverPolicies';
import { LiveTracking } from '@/components/tracking/LiveTracking';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

type LocalDriver = {
  id: string;
  name: string;
  bio?: string;
  completedRides: number;
  car: null | { model: string; year: number; color: string };
  verified: boolean;
  joinDate: string;
  verifications: { phone: boolean; email: boolean };
  preferences: any;
  policies: any;
};

export default function DriverProfile() {
  const { id: driverId } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<LocalDriver | null>(null);
  const [driverRides, setDriverRides] = useState<SupabaseRide[]>([]);
  const [userRides, setUserRides] = useState<SupabaseRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [trackingRideId, setTrackingRideId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const [userProfile2, setUserProfile2] = useState({
    username: 'User',
    avatar: '',
    bio: '',
    preferences: {
      searchRadius: '10km',
      luggageSize: 'medium',
      hidePartialRoutes: false,
      maxBackSeatPassengers: true,
      music: true,
      animals: false,
      children: true,
      smoking: false,
    },
  });

  const mockUserId = 'user123';

  const mockDriverData = {
    preferences: {
      music: true,
      pets: false,
      smoking: false,
      children: true,
    },
    policies: {
      detourFlexibility: 'medium' as const,
      maxLuggageSize: 'medium' as const,
      maxPassengers: 2,
      comfortGuarantee: true,
    },
    verifications: { phone: true, email: true },
    joinDate: '2023-01-15',
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile2((prev) => ({ ...prev, ...JSON.parse(savedProfile) }));
    }
    if (driverId) loadDriverData(driverId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverId]);

  async function loadDriverData(id: string) {
    setLoading(true);
    try {
      const allRides = await getRides();
      const ridesByDriver = allRides.filter((r) => r.user_id === id);

      if (ridesByDriver.length === 0) {
        setDriver(null);
      } else {
        const sample = ridesByDriver[0];
        const driverData: LocalDriver = {
          id,
          name: sample.driver_name || 'Unknown Driver',
          bio: '',
          completedRides: ridesByDriver.length,
          car: null,
          verified: false,
          joinDate: mockDriverData.joinDate,
          verifications: mockDriverData.verifications,
          preferences: mockDriverData.preferences,
          policies: mockDriverData.policies,
        };
        setDriver(driverData);
        setDriverRides(ridesByDriver);
        // Filter user rides - since we don't have passengers array, we'll use a different approach
        // For now, we'll assume user has booked rides if they match certain criteria
        setUserRides(
          ridesByDriver.filter((r) => r.user_id === mockUserId)
        );
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load driver.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const handleProfileSave = (data: any) => {
    setUserProfile2(data);
    localStorage.setItem('userProfile', JSON.stringify(data));
  };

  const handleStartTracking = (rideId: string) =>
    setTrackingRideId((prev) => (prev === rideId ? null : rideId));

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  const hasBookedRides = userRides.length > 0;

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-brand-600 rounded-full" />
          </div>
        </main>
      </div>
    );

  if (!driver)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Driver Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find this driver.
              </p>
              <Button variant="outline" asChild>
                <Link to="/rides">Back to Rides</Link>
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/rides">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to rides
            </Link>
          </Button>

          <DriverHeader
            userProfile={userProfile2}
            onEditProfile={() => setProfileEditModalOpen(true)}
          />

          {hasBookedRides && (
            <Card className="p-6 mb-6 border-green-500">
              <h3 className="font-semibold text-green-600 mb-2">
                Your Booked Rides with {driver.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                You have {userRides.length} upcoming ride
                {userRides.length > 1 ? 's' : ''} with them.
              </p>
              {userRides.map((ride) => (
                <div key={ride.id} className="flex justify-between items-center p-3 bg-green-50 rounded-md mb-2">
                  <div>
                    <div className="font-medium">
                      {ride.origin} → {ride.destination}
                    </div>
                  </div>
                  {(ride.status === 'active' || ride.status === 'in_progress') && (
                    <Button
                      variant={trackingRideId === ride.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStartTracking(ride.id)}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      {trackingRideId === ride.id ? 'Hide Tracking' : 'Track'}
                    </Button>
                  )}
                </div>
              ))}
              {trackingRideId && (
                <LiveTracking
                  rideId={trackingRideId}
                  driverId={driver.id}
                  driverName={driver.name}
                  departure={userRides.find((r) => r.id === trackingRideId)?.origin || ''}
                  destination={userRides.find((r) => r.id === trackingRideId)?.destination || ''}
                  onClose={() => setTrackingRideId(null)}
                />
              )}
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 text-center">
                <div className="h-24 w-24 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-brand-600">
                    {driver.name.charAt(0)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold">{driver.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Member since {formatDate(driver.joinDate)}
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {driver.verifications.phone ? (
                      <CheckCircle className="text-green-600 h-4 w-4" />
                    ) : (
                      <span className="text-sm text-muted-foreground">Not verified</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {driver.verifications.email ? (
                      <CheckCircle className="text-green-600 h-4 w-4" />
                    ) : (
                      <span className="text-sm text-muted-foreground">Not verified</span>
                    )}
                  </div>
                </div>

                <hr className="my-6" />

                <p className="text-sm">{driver.bio || 'No bio available'}</p>
                <p className="text-sm mt-2">
                  {driver.completedRides} ride{driver.completedRides > 1 ? 's' : ''} completed
                </p>

                <Button variant="outline" className="w-full mt-4" onClick={() => setMessagingOpen(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Send Message
                </Button>
              </Card>

              {driver.preferences && <DriverPreferences preferences={driver.preferences} />}
              {driver.policies && <DriverPolicies policies={driver.policies} />}
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-2">
              <DriverRidesList driverName={driver.name} rides={driverRides} />
              <DriverReviews driverId={driver.id} reviewCount={driver.completedRides} />
            </div>
          </div>
        </div>
      </main>

      <ContactDriverModal
        driverName={driver.name}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <EnhancedProfileModal
        isOpen={profileEditModalOpen}
        onClose={() => setProfileEditModalOpen(false)}
        currentData={userProfile2}
        onSave={handleProfileSave}
      />

      <MessagingModal
        isOpen={messagingOpen}
        onClose={() => setMessagingOpen(false)}
        recipientId={driver.id}
        recipientName={driver.name}
        currentUserId={user?.id || mockUserId}
        currentUserName={user?.email?.split('@')[0] || 'You'}
      />
    </div>
  );
}
