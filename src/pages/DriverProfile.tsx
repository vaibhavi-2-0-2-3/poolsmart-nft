
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  MessageCircle,
  Star,
  Calendar,
  User,
  Shield,
} from 'lucide-react';
import { getRides, SupabaseRide } from '@/lib/supabase';
import { ContactDriverModal } from '@/components/driver/ContactDriverModal';
import { EnhancedProfileModal } from '@/components/profile/EnhancedProfileModal';
import { MessagingModal } from '@/components/messaging/MessagingModal';
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
          bio: 'Experienced driver with a passion for safe, comfortable travel. I enjoy meeting new people and sharing interesting conversations during rides.',
          completedRides: ridesByDriver.length,
          car: null,
          verified: true,
          joinDate: mockDriverData.joinDate,
          verifications: mockDriverData.verifications,
          preferences: mockDriverData.preferences,
          policies: mockDriverData.policies,
        };
        setDriver(driverData);
        setDriverRides(ridesByDriver);
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-brand-600 rounded-full" />
          </div>
        </main>
      </div>
    );

  if (!driver)
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="p-12 text-center border-0 shadow-lg">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Driver Not Found</h2>
                <p className="text-muted-foreground">
                  We couldn't find this driver profile. They may have deactivated their account.
                </p>
                <Button variant="outline" asChild className="mt-6">
                  <Link to="/rides">Back to Rides</Link>
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6 hover:bg-white/80">
            <Link to="/rides">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to rides
            </Link>
          </Button>

          {hasBookedRides && (
            <Card className="p-6 mb-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-600 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-800 text-lg mb-2">
                    Your Booked Rides with {driver.name}
                  </h3>
                  <p className="text-green-700 mb-4">
                    You have {userRides.length} upcoming ride{userRides.length > 1 ? 's' : ''} with this driver.
                  </p>
                  <div className="space-y-3">
                    {userRides.map((ride) => (
                      <div key={ride.id} className="flex justify-between items-center p-4 bg-white/80 rounded-lg border border-green-200">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {ride.origin} → {ride.destination}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(ride.date).toLocaleDateString()} at {new Date(ride.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        {(ride.status === 'active' || ride.status === 'in_progress') && (
                          <Button
                            variant={trackingRideId === ride.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStartTracking(ride.id)}
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            {trackingRideId === ride.id ? 'Hide Tracking' : 'Track Live'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {trackingRideId && (
                    <div className="mt-6">
                      <LiveTracking
                        rideId={trackingRideId}
                        driverId={driver.id}
                        driverName={driver.name}
                        departure={userRides.find((r) => r.id === trackingRideId)?.origin || ''}
                        destination={userRides.find((r) => r.id === trackingRideId)?.destination || ''}
                        onClose={() => setTrackingRideId(null)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Driver Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-8 text-center border-0 shadow-lg bg-gradient-to-b from-white to-gray-50">
                {/* Profile Avatar */}
                <div className="relative mb-6">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                    <span className="text-4xl font-bold text-brand-700">
                      {driver.name.charAt(0)}
                    </span>
                  </div>
                  {driver.verified && (
                    <div className="absolute -bottom-2 -right-2 p-2 bg-brand-600 rounded-full border-4 border-white">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Driver Info */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">{driver.name}</h1>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-sm text-muted-foreground">(24 reviews)</span>
                    </div>
                    <Badge variant="secondary" className="mb-4">
                      Verified Driver
                    </Badge>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {formatDate(driver.joinDate)}</span>
                  </div>

                  {/* Verifications */}
                  <div className="flex justify-center gap-6 py-4 border-y border-gray-200">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {driver.verifications.phone ? (
                        <CheckCircle className="text-green-600 h-4 w-4" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Unverified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {driver.verifications.email ? (
                        <CheckCircle className="text-green-600 h-4 w-4" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Unverified</span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {driver.bio || 'No bio available'}
                  </p>

                  {/* Stats */}
                  <div className="bg-brand-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-brand-600">{driver.completedRides}</div>
                    <div className="text-sm text-brand-700">Completed Rides</div>
                  </div>

                  {/* Contact Button */}
                  <Button 
                    variant="primary" 
                    className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 font-semibold py-3 shadow-lg" 
                    onClick={() => setMessagingOpen(true)}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </div>
              </Card>

              {driver.preferences && <DriverPreferences preferences={driver.preferences} />}
              {driver.policies && <DriverPolicies policies={driver.policies} />}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
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
