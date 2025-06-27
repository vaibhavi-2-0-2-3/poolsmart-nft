
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/shared/Button';
import { Calendar, MapPin, User, ArrowLeft, Users, Clock } from 'lucide-react';
import { getEventById, updateEventRSVP } from '@/lib/eventsApi';
import { Event } from '@/lib/eventsApi';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ChatDrawer } from '@/components/chat/ChatDrawer';

const EventDetails = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRSVP, setIsUpdatingRSVP] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        if (eventId) {
          const eventData = await getEventById(eventId);
          setEvent(eventData);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRSVP = async (status: 'attending' | 'maybe' | 'not_attending') => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "Please sign in to RSVP for this event.",
        variant: "destructive"
      });
      return;
    }
    
    if (!eventId) return;
    
    try {
      setIsUpdatingRSVP(true);
      await updateEventRSVP(eventId, status);
      
      const statusText = status === 'attending' ? 'attending' : 
                        status === 'maybe' ? 'maybe attending' : 'not attending';
      
      toast({
        title: "RSVP Updated!",
        description: `You are now marked as ${statusText} for this event.`,
      });
      
      // Refresh event data
      const updatedEvent = await getEventById(eventId);
      setEvent(updatedEvent);
      
    } catch (error) {
      console.error("Error updating RSVP:", error);
      toast({
        title: "RSVP Failed",
        description: "There was an error updating your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingRSVP(false);
    }
  };

  const getRSVPButtons = () => {
    if (!user) {
      return (
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => {
            toast({
              title: "Please sign in",
              description: "Please sign in to RSVP for this event.",
              variant: "destructive"
            });
          }}
        >
          Sign in to RSVP
        </Button>
      );
    }

    const currentStatus = event?.rsvpStatus;
    
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant={currentStatus === 'attending' ? 'primary' : 'outline'}
          size="lg"
          onClick={() => handleRSVP('attending')}
          disabled={isUpdatingRSVP}
        >
          {isUpdatingRSVP && currentStatus !== 'attending' ? 'Updating...' : 'Going'}
        </Button>
        
        <Button
          variant={currentStatus === 'maybe' ? 'secondary' : 'outline'}
          size="lg"
          onClick={() => handleRSVP('maybe')}
          disabled={isUpdatingRSVP}
        >
          {isUpdatingRSVP && currentStatus !== 'maybe' ? 'Updating...' : 'Maybe'}
        </Button>
        
        <Button
          variant={currentStatus === 'not_attending' ? 'secondary' : 'outline'}
          size="lg"
          onClick={() => handleRSVP('not_attending')}
          disabled={isUpdatingRSVP}
        >
          {isUpdatingRSVP && currentStatus !== 'not_attending' ? 'Updating...' : 'Not Going'}
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return null;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Link to="/events">
                <Button variant="outline" size="sm" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                  Back to Events
                </Button>
              </Link>
            </div>
            <div className="p-8 border border-border rounded-lg bg-card text-center">
              <h2 className="text-2xl font-semibold mb-4">Event Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The event you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link to="/events">
              <Button variant="outline" size="sm" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                Back to Events
              </Button>
            </Link>
          </div>
          
          <div className="overflow-hidden rounded-xl mb-8">
            {event.imageUrl ? (
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-r from-brand-50 to-brand-100 flex items-center justify-center">
                <Calendar className="h-20 w-20 text-brand-600 opacity-50" />
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex flex-col gap-4 md:flex-row md:gap-8 mt-6 mb-8">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-brand-600 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-brand-600 mr-2" />
                <span>{event.location}</span>
              </div>
              
              {event.organizerName && (
                <div className="flex items-center">
                  <User className="h-5 w-5 text-brand-600 mr-2" />
                  <span>{event.organizerName}</span>
                </div>
              )}
              
              {event.rsvpCount !== undefined && (
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-brand-600 mr-2" />
                  <span>{event.rsvpCount} attending</span>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">About This Event</h2>
              <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 p-6 bg-muted rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-medium">
                      {event.price ? `$${event.price}` : 'Free'}
                    </div>
                    {event.rsvpStatus && (
                      <div className="text-sm text-muted-foreground mt-1">
                        You are {event.rsvpStatus === 'attending' ? 'going' : 
                                 event.rsvpStatus === 'maybe' ? 'maybe going' : 'not going'} to this event
                      </div>
                    )}
                  </div>
                  
                  {getRSVPButtons()}
                </div>
              </div>
              
              <div className="p-6 bg-brand-50 border border-brand-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-brand-800">Carpooling Options</h3>
                <p className="text-sm text-brand-700 mb-4">
                  Save money and reduce your carbon footprint by sharing rides with others attending this event.
                </p>
                
                <ChatDrawer eventId={event.id} eventTitle={event.title} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
