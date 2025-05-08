
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/shared/Button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from 'react-router-dom';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  organizerName: string;
  price?: number;
}

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card className="h-full overflow-hidden border border-border hover:border-brand-200 transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-50 to-brand-100 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-brand-600 opacity-50" />
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-xs font-medium bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div className="text-xs text-muted-foreground">
            {event.location}
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{event.description}</p>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-xs font-medium text-brand-700">
              {event.organizerName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-sm">{event.organizerName}</div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div>
          {event.price ? (
            <div className="flex items-center">
              <span className="text-lg font-semibold">{event.price} ETH</span>
              <span className="ml-1 text-xs text-muted-foreground">
                ($
                {(event.price * 2000).toFixed(2)})
              </span>
            </div>
          ) : (
            <span className="text-lg font-semibold text-green-600">Free</span>
          )}
        </div>
        
        <Link to={`/events/${event.id}`}>
          <Button variant="primary" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
