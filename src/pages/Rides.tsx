
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import RidesList from '@/components/rides/RidesList';
import { RidesFilter } from '@/components/rides/RidesFilter';
import { Car, CalendarClock, MapPin, Search } from 'lucide-react';
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
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find a Ride</h1>
            <p className="text-muted-foreground">
              {eventData ? `Find rides to ${eventData.eventName}` : 'Search for available rides or offer your own'}
            </p>
          </div>

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
                    onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
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
                    onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
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
                }}
              />

              <RidesList
                searchParams={searchParams}
                refreshTrigger={refreshTrigger}
              />
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Offer a Ride</h3>
                <p className="text-muted-foreground mb-6">
                  {eventData ? `Offer a ride to ${eventData.eventName}` : 'Share your journey and earn money.'}
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setShowCreateRideForm(true)}
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
                    <span>Panaji, Goa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Margao, Goa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Calangute, Goa</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <CreateRideModal
        isOpen={showCreateRideForm}
        onClose={() => setShowCreateRideForm(false)}
        onSuccess={handleCreateRideSuccess}
        eventData={eventData}
      />
    </div>
  );
};

export default Rides;
