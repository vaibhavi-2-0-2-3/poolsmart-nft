import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import RidesList from '@/components/rides/RidesList';
import { RidesFilter } from '@/components/rides/RidesFilter';
import { useWeb3 } from '@/hooks/useWeb3';
import { collection, addDoc } from 'firebase/firestore';
import { db, Ride, createRide } from '@/lib/firebase';
import { PaymentModal } from '@/components/rides/PaymentModal';
import { Car, CalendarClock, MapPin, CreditCard, Clock, Users } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { toast } from '@/hooks/use-toast';
import { UserRegistrationModal, UserProfileData } from '@/components/profile/UserRegistrationModal';

type SearchParams = {
  from: string;
  to: string;
  date: string;
  time: string;
  seats: string;
};

const Rides = () => {
  const { address, connect, userProfile, completeRegistration } = useWeb3();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: '1',
  });
  const [showRegistration, setShowRegistration] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  const handleConnectWallet = async () => {
    try {
      const walletAddress = await connect();
      
      if (walletAddress && !userProfile) {
        setPendingAddress(walletAddress);
        setShowRegistration(true);
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleCompleteRegistration = (userData: UserProfileData) => {
    if (completeRegistration) {
      completeRegistration(userData);
    }
    setPendingAddress(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find a Ride</h1>
            <p className="text-muted-foreground">
              Search for available rides or offer your own
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RidesFilter onSearch={handleSearch} />
              
              {!address ? (
                <Card className="mt-6 p-8 text-center">
                  <Car className="h-12 w-12 text-brand-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
                  <p className="text-muted-foreground mb-6">
                    To book a ride or offer your own, please connect your wallet first.
                  </p>
                  <div className="max-w-xs mx-auto">
                    <Button 
                      variant="primary"
                      onClick={handleConnectWallet}
                      iconLeft={<CreditCard className="h-4 w-4" />}
                      className="w-full"
                    >
                      Connect Wallet
                    </Button>
                  </div>
                </Card>
              ) : (
                <RidesList searchParams={searchParams} />
              )}
            </div>

            {/* Sidebar Content */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Offer a Ride</h3>
                <p className="text-muted-foreground mb-6">
                  Share your journey and earn cryptocurrency.
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <a href="/rides">
                    <CalendarClock className="h-4 w-4 mr-2" />
                    List a Ride
                  </a>
                </Button>
              </Card>
              
              <Card className="p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">Popular Destinations</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>New York, NY</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Los Angeles, CA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Chicago, IL</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Registration Modal */}
      {showRegistration && pendingAddress && (
        <UserRegistrationModal
          isOpen={showRegistration}
          onClose={() => {
            setShowRegistration(false);
            setPendingAddress(null);
          }}
          onComplete={handleCompleteRegistration}
          walletAddress={pendingAddress}
        />
      )}
    </div>
  );
};

export default Rides;
