
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/shared/Button';
import { Calendar, MapPin, User, Clock, ArrowLeft } from 'lucide-react';
import { DEMO_EVENTS } from '@/components/home/EventsSlider';

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  
  const event = useMemo(() => {
    return DEMO_EVENTS.find(event => event.id === eventId);
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

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Link to="/">
                <Button variant="outline" size="sm" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                  Back to Home
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
            <Link to="/">
              <Button variant="outline" size="sm" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                Back to Home
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
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 bg-muted rounded-lg">
              <div>
                <div className="text-lg font-medium">
                  {event.price ? `${event.price} ETH` : 'Free'}
                </div>
                {event.price ? (
                  <div className="text-sm text-muted-foreground">
                    (Approximately ${(event.price * 2000).toFixed(2)} USD)
                  </div>
                ) : null}
              </div>
              
              <Button variant="primary" size="lg">
                Register for Event
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
