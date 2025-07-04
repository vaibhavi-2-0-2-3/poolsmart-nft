
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Star, Car } from 'lucide-react';
import { updateEventRSVP } from '@/lib/eventsApi';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, formatTime, formatDateTime } from '@/lib/utils';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string;
  date: string;
  imageUrl?: string | null;
  organizerName: string | null;
  category: string | null;
  maxAttendees?: number | null;
  price?: number;
  rsvpStatus?: 'attending' | 'maybe' | 'not_attending' | null;
  rsvpCount?: number;
}

interface EventCardProps {
  event: Event;
  onEventUpdate?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEventUpdate }) => {
  const [isUpdatingRSVP, setIsUpdatingRSVP] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'music':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'entertainment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'food':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'cultural':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'film':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleRSVP = async (status: 'attending' | 'maybe' | 'not_attending') => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to RSVP to events.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingRSVP(true);
    try {
      await updateEventRSVP(event.id, status);
      
      const statusText = status === 'attending' ? 'attending' : 
                        status === 'maybe' ? 'maybe attending' : 'not attending';
      
      toast({
        title: "RSVP Updated!",
        description: `You are now marked as ${statusText} for this event.`,
      });
      
      if (onEventUpdate) {
        onEventUpdate();
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast({
        title: "RSVP Failed",
        description: "There was an error updating your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingRSVP(false);
    }
  };

  const isUpcoming = new Date(event.date) > new Date();
  const isToday = new Date(event.date).toDateString() === new Date().toDateString();

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group bg-card border border-border">
      <div className="relative overflow-hidden">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900 dark:to-brand-800 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-brand-600 opacity-50" />
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex gap-2">
          {event.category && (
            <Badge className={`${getCategoryColor(event.category)} backdrop-blur-sm shadow-sm`}>
              {event.category}
            </Badge>
          )}
          {isToday && (
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 backdrop-blur-sm shadow-sm">
              Today
            </Badge>
          )}
        </div>
        
        {event.rsvpStatus === 'attending' && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 backdrop-blur-sm shadow-sm">
              Going
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3 flex-grow">
        <h3 className="text-xl font-semibold line-clamp-2 mb-3 group-hover:text-brand-600 transition-colors">{event.title}</h3>
        
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-brand-600 flex-shrink-0" />
            <span className="truncate">{formatDateTime(event.date)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-brand-600 flex-shrink-0" />
            <span>{formatTime(event.date)}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-brand-600 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            {event.rsvpCount !== undefined && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-brand-600" />
                <span>{event.rsvpCount} attending</span>
              </div>
            )}
            
            {event.rsvpStatus === 'attending' && (
              <div className="flex items-center text-green-600">
                <Car className="h-4 w-4 mr-1" />
                <span className="text-xs">Carpool available</span>
              </div>
            )}
          </div>
        </div>
        
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
            {event.description}
          </p>
        )}
      </CardHeader>
      
      <CardFooter className="pt-0 flex flex-col gap-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-brand-600">
              {event.price ? `₹${event.price}` : 'Free'}
            </span>
            {event.organizerName && (
              <span className="text-xs text-muted-foreground">
                by {event.organizerName}
              </span>
            )}
          </div>
          
          {event.rsvpStatus === 'attending' && (
            <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600 font-medium">Attending</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 w-full">
          {user && isUpcoming && (
            <Button
              variant={event.rsvpStatus === 'attending' ? 'primary' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => {
                if (event.rsvpStatus === 'attending') {
                  handleRSVP('not_attending');
                } else {
                  handleRSVP('attending');
                }
              }}
              disabled={isUpdatingRSVP}
            >
              {isUpdatingRSVP ? 'Updating...' : event.rsvpStatus === 'attending' ? 'Going' : 'Join'}
            </Button>
          )}
          
          <Link to={`/events/${event.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
