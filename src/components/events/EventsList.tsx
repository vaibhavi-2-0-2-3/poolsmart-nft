
import React from 'react';
import { Event } from '@/lib/eventsApi';
import { EventCard } from '@/components/home/EventCard';
import { Skeleton } from '@/components/ui/skeleton';

interface EventsListProps {
  events: Event[];
  isLoading: boolean;
  onEventUpdate?: () => void;
}

export const EventsList: React.FC<EventsListProps> = ({ events, isLoading, onEventUpdate }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg">
        <h3 className="text-xl font-medium mb-2">No Events Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search filters to find events.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} className="h-full">
          <EventCard event={event} onEventUpdate={onEventUpdate} />
        </div>
      ))}
    </div>
  );
};
