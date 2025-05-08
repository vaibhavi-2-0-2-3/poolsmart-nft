
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EventsList } from '@/components/events/EventsList';
import { EventsFilter } from '@/components/events/EventsFilter';
import { getAllEvents, Event, searchEvents } from '@/lib/eventsApi';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, MapPin, Search } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    location: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await getAllEvents();
        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = async (criteria: typeof searchCriteria) => {
    setIsLoading(true);
    setSearchCriteria(criteria);
    
    try {
      const results = await searchEvents(criteria);
      setFilteredEvents(results);
    } catch (error) {
      console.error('Error searching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Community Events</h1>
            <p className="text-lg text-muted-foreground">
              Join blockchain and ride-sharing events happening in your community
            </p>
          </div>
          
          <EventsFilter onSearch={handleSearch} />
          
          <Separator className="my-8" />
          
          <div className="flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-muted-foreground" />
            <p className="text-muted-foreground">
              {isLoading
                ? 'Searching for events...'
                : filteredEvents.length === 0
                ? 'No events found matching your criteria.'
                : `Found ${filteredEvents.length} events`}
            </p>
          </div>
          
          <EventsList events={filteredEvents} isLoading={isLoading} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
