
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/shared/Button';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';
import { getEventById, registerForEvent } from '@/lib/eventsApi';
import { Event } from '@/lib/eventsApi';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ChatDrawer } from '@/components/chat/ChatDrawer';

// Mock user session
const mockUser = {
  address: 'user123',
  isConnected: true
};

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const { address, isConnected } = mockUser;
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

  const handleRegister = async () => {
    if (!isConnected) {
      toast({
        title: "Please sign in",
        description: "Please sign in to register for this event.",
        variant: "destructive"
      });
      return;
    }
    
    if (!eventId || !address) return;
    
    try {
      setIsRegistering(true);
      console.log("Attempting to register user:", address, "for event:", eventId);
      const success = await registerForEvent(eventId, address);
      
      if (success) {
        toast({
          title: "Registration Successful!",
          description: "You've successfully registered for this event.",
        });
        
        // Refresh event data
        const updatedEvent = await getEventById(eventId);
        setEvent(updatedEvent);
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast({
          title: "Already Registered",
          description: "You are already registered for this event.",
        });
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error registering for this event. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const isUserRegistered = () => {
    if (!event || !address) return false;
    return event.attendees?.includes(address) || false;
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
              
              <div className="flex items-center">
                <User className="h-5 w-5 text-brand-600 mr-2" />
                <span>{event.organizerName}</span>
              </div>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">About This Event</h2>
              <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 bg-muted rounded-lg">
                <div>
                  <div className="text-lg font-medium">
                    {event.price ? `$${event.price}` : 'Free'}
                  </div>
                </div>
                
                {isUserRegistered() ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="secondary" size="lg" disabled>
                      Already Registered
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => navigate('/dashboard')}
                    >
                      View in Dashboard
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={handleRegister}
                    disabled={isRegistering || !isConnected}
                  >
                    {isRegistering ? 'Registering...' : 'Register for Event'}
                  </Button>
                )}
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
