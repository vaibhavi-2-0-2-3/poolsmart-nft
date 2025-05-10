
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EventCard, Event } from '@/components/home/EventCard';
import { Button } from '@/components/shared/Button';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { getAllEvents } from '@/lib/eventsApi';

export const FeaturedEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const allEvents = await getAllEvents();
        // Get upcoming events (sorted by date, limit to 3)
        const upcomingEvents = allEvents
          .filter(event => new Date(event.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);

        setEvents(upcomingEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold">Loading events...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-brand-600">Community</span>
            </div>
            <h2 className="text-3xl font-semibold">Upcoming Events</h2>
          </div>
          <Link to="/events">
            <Button variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
              See All Events
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="h-full">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};