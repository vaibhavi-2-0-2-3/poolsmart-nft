
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import RidesList from '@/components/rides/RidesList';
import { RidesFilter } from '@/components/rides/RidesFilter';
import { useWeb3 } from '@/hooks/useWeb3';
import { Ride, createRide } from '@/lib/firebase';
import { PaymentModal } from '@/components/rides/PaymentModal';
import { Car, CalendarClock, MapPin, CreditCard, Clock, Users, Search } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { toast } from '@/hooks/use-toast';
import { UserRegistrationModal, UserProfileData } from '@/components/profile/UserRegistrationModal';
import { Input } from '@/components/ui/input';
import { CreateRideModal } from '@/components/rides/CreateRideModal';

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
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [showCreateRideForm, setShowCreateRideForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const handleCreateRideSuccess = () => {
    // Increment to trigger refresh of RidesList
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Success",
      description: "Your ride has been listed successfully!",
    });
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

          {/* Search Bar */}
          <Card className="mb-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="from"
                    type="text"
                    placeholder="Departure location"
                    className="pl-10"
                    value={searchParams.from}
                    onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="to"
                    type="text"
                    placeholder="Destination"
                    className="pl-10"
                    value={searchParams.to}
                    onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">&#8203;</label>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => handleSearch(searchParams)}
                  iconLeft={<Search className="h-4 w-4" />}
                >
                  Search
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RidesFilter 
                open={filterDialogOpen} 
                onOpenChange={setFilterDialogOpen} 
                onApplyFilters={(filterOptions) => {
                  console.log('Filter options:', filterOptions);
                  // Apply filters to rides
                }}
              />
              
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
                <RidesList searchParams={searchParams} refreshTrigger={refreshTrigger} />
              )}
            </div>

            {/* Sidebar Content */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Offer a Ride</h3>
                <p className="text-muted-foreground mb-6">
                  Share your journey and earn cryptocurrency.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => {
                    if (!address) {
                      toast({
                        title: "Wallet not connected",
                        description: "Please connect your wallet to list a ride.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    // Open the create ride modal instead of redirecting
                    setShowCreateRideForm(true);
                  }}
                >
                  <CalendarClock className="h-4 w-4 mr-2" />
                  List a Ride
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

      {/* Create Ride Modal */}
      <CreateRideModal
        isOpen={showCreateRideForm}
        onClose={() => setShowCreateRideForm(false)}
        onSuccess={handleCreateRideSuccess}
      />
    </div>
  );
};

export default Rides;
