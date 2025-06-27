
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EventsList } from '@/components/events/EventsList';
import { EventsFilter } from '@/components/events/EventsFilter';
import { getAllEvents, Event, searchEvents } from '@/lib/eventsApi';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, MapPin, Search, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    fetchEvents();
  }, []);

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

  const handleEventUpdate = () => {
    // Refresh events when an RSVP is made
    fetchEvents();
  };

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) > new Date()).slice(0, 3);
  const featuredCategories = ['music', 'entertainment', 'food', 'cultural', 'film'];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 dark:from-brand-950 dark:via-brand-900 dark:to-brand-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-brand-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                Discover Events in Goa
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              From electrifying music festivals to cultural celebrations, find the perfect events and share rides with fellow attendees
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-brand-200 dark:border-brand-700">
                <CardContent className="p-6 text-center">
                  <CalendarDays className="h-8 w-8 text-brand-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-brand-800 dark:text-brand-200">{filteredEvents.length}+</div>
                  <div className="text-sm text-muted-foreground">Active Events</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-brand-200 dark:border-brand-700">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-brand-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-brand-800 dark:text-brand-200">15+</div>
                  <div className="text-sm text-muted-foreground">Venues Across Goa</div>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-brand-200 dark:border-brand-700">
                <CardContent className="p-6 text-center">
                  <Search className="h-8 w-8 text-brand-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-brand-800 dark:text-brand-200">500+</div>
                  <div className="text-sm text-muted-foreground">Carpool Matches</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
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
          
          <EventsList 
            events={filteredEvents} 
            isLoading={isLoading}
            onEventUpdate={handleEventUpdate}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
