
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import RidesList from '@/components/rides/RidesList';
import { EnhancedRidesFilter, FilterState } from '@/components/rides/EnhancedRidesFilter';
// import { CarpoolingBenefitsBanner } from '@/components/rides/CarpoolingBenefitsBanner';
import { Car, CalendarClock, MapPin, Search, Plus } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { toast } from '@/hooks/use-toast';
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
  const location = useLocation();
  const eventData = location.state as any;
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: '',
    to: eventData?.destination || '',
    date: eventData?.date || '',
    time: eventData?.time || '',
    seats: '1',
  });
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100],
    timeWindow: { start: '', end: '' },
    minSeats: 1,
    genderPreference: 'any',
    languages: [],
    sortBy: 'date',
    sortOrder: 'asc'
  });
  const [showCreateRideForm, setShowCreateRideForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Auto-open create ride modal if coming from an event
  useEffect(() => {
    if (eventData) {
      setShowCreateRideForm(true);
    }
  }, [eventData]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleCreateRideSuccess = () => {
    console.log("Rides page: Ride created successfully!");
    const newTrigger = refreshTrigger + 1;
    console.log(`Rides page: Updating refresh trigger from ${refreshTrigger} to ${newTrigger}`);
    setRefreshTrigger(newTrigger);
    setShowCreateRideForm(false);
    toast({
      title: "Success",
      description: "Your ride has been listed successfully!",
    });
  };

  useEffect(() => {
    console.log("Rides page: refreshTrigger changed to", refreshTrigger);
  }, [refreshTrigger]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-brand-100 rounded-full">
                <Car className="h-8 w-8 text-brand-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                Find Your Perfect Ride
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {eventData 
                ? `Connect with fellow travelers heading to ${eventData.eventName}` 
                : 'Discover comfortable, affordable rides or share your journey with others'
              }
            </p>
          </div>

          {/* Carpooling Benefits Banner
          <CarpoolingBenefitsBanner /> */}

          {/* Search Section */}
          <Card className="mb-8 p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="from" className="block text-sm font-semibold text-gray-700 mb-2">
                  Departure Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="from"
                    type="text"
                    placeholder="Where are you leaving from?"
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-brand-500 rounded-lg"
                    value={searchParams.from}
                    onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="to" className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="to"
                    type="text"
                    placeholder="Where do you want to go?"
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-brand-500 rounded-lg"
                    value={searchParams.to}
                    onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">&#8203;</label>
                <Button
                  variant="primary"
                  className="w-full h-12 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 font-semibold rounded-lg shadow-lg"
                  onClick={() => handleSearch(searchParams)}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Rides
                </Button>
              </div>
            </div>
          </Card>

          {/* Enhanced Filters */}
          <EnhancedRidesFilter onFiltersChange={handleFiltersChange} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <RidesList
                searchParams={searchParams}
                refreshTrigger={refreshTrigger}
                filters={filters}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Create Ride Card */}
              <Card className="p-6 bg-gradient-to-br from-brand-50 to-brand-100 border-brand-200">
                <div className="text-center">
                  <div className="p-4 bg-brand-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-800 mb-2">Offer a Ride</h3>
                  <p className="text-brand-600 mb-6 text-sm leading-relaxed">
                    {eventData ? `Share your ride to ${eventData.eventName} and help others travel together` : 'Share your journey, make new connections, and earn money while helping others reach their destination.'}
                  </p>
                  <Button
                    variant="primary"
                    className="w-full bg-brand-600 hover:bg-brand-700 font-semibold py-3 rounded-lg shadow-md"
                    onClick={() => setShowCreateRideForm(true)}
                  >
                    <CalendarClock className="h-5 w-5 mr-2" />
                    List Your Ride
                  </Button>
                </div>
              </Card>

              {/* Popular Destinations */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Popular Destinations</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Downtown Hub', rides: '24 rides' },
                    { name: 'University District', rides: '18 rides' },
                    { name: 'Tech Center', rides: '15 rides' },
                    { name: 'Airport Terminal', rides: '12 rides' }
                  ].map((destination) => (
                    <div key={destination.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-brand-600" />
                        <span className="font-medium text-gray-700">{destination.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{destination.rides}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Today's Activity</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Rides</span>
                    <span className="font-bold text-brand-600">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available Seats</span>
                    <span className="font-bold text-brand-600">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">New Drivers</span>
                    <span className="font-bold text-brand-600">8</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <CreateRideModal
        isOpen={showCreateRideForm}
        onClose={() => setShowCreateRideForm(false)}
        onRideCreated={handleCreateRideSuccess}
        eventId={eventData?.eventId}
        eventName={eventData?.eventName}
        prefilledData={eventData ? {
          destination: eventData.destination,
          date: eventData.date,
          time: eventData.time
        } : undefined}
      />
    </div>
  );
};

export default Rides;
