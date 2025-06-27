
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { updateEventRSVP } from '@/lib/eventsApi';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'music':
        return 'bg-purple-100 text-purple-800';
      case 'entertainment':
        return 'bg-blue-100 text-blue-800';
      case 'food':
        return 'bg-orange-100 text-orange-800';
      case 'cultural':
        return 'bg-green-100 text-green-800';
      case 'film':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getRSVPButtonText = () => {
    if (isUpdatingRSVP) return 'Updating...';
    
    switch (event.rsvpStatus) {
      case 'attending':
        return 'Attending';
      case 'maybe':
        return 'Maybe';
      case 'not_attending':
        return 'Not Going';
      default:
        return 'RSVP';
    }
  };

  const getRSVPButtonVariant = () => {
    switch (event.rsvpStatus) {
      case 'attending':
        return 'primary';
      case 'maybe':
        return 'secondary';
      case 'not_attending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-brand-50 to-brand-100 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-brand-600 opacity-50" />
          </div>
        )}
        {event.category && (
          <Badge className={`absolute top-3 left-3 ${getCategoryColor(event.category)}`}>
            {event.category}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <h3 className="text-xl font-semibold line-clamp-2 mb-2">{event.title}</h3>
        
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-brand-600" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-brand-600" />
            <span>{formatTime(event.date)}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-brand-600" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          {event.rsvpCount !== undefined && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-brand-600" />
              <span>{event.rsvpCount} attending</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-3">
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
        )}
        
        {event.organizerName && (
          <p className="text-xs text-muted-foreground mt-2">
            Organized by {event.organizerName}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <span className="text-lg font-semibold">
            {event.price ? `$${event.price}` : 'Free'}
          </span>
          
          <div className="flex gap-2">
            {user && (
              <Button
                variant={getRSVPButtonVariant() as any}
                size="sm"
                onClick={() => {
                  if (event.rsvpStatus === 'attending') {
                    handleRSVP('not_attending');
                  } else {
                    handleRSVP('attending');
                  }
                }}
                disabled={isUpdatingRSVP}
              >
                {getRSVPButtonText()}
              </Button>
            )}
            
            <Link to={`/events/${event.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
