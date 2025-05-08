
import React from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/shared/Button';
import { Calendar } from 'lucide-react';

// This is a placeholder. In a real implementation, we would fetch the event details from Firebase.
const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  
  // In a real implementation, we would fetch the event details based on the eventId
  // For now, we'll just display a placeholder
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Event Details</h1>
            <p className="text-muted-foreground">
              This page will display details for event ID: {eventId}
            </p>
            <div className="mt-8 p-8 border border-border rounded-lg bg-card">
              <div className="flex items-center justify-center h-40 bg-muted rounded-lg mb-6">
                <Calendar className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Event Information</h2>
              <p className="text-muted-foreground mb-6">
                When implemented, this page will show the full details of the selected event, including 
                description, date, location, organizer information, and allow users to register or purchase tickets.
              </p>
              <Button variant="primary">
                Back to Events
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
