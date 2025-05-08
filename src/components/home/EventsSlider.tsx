
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { EventCard, Event } from './EventCard';

// Demo events data
const DEMO_EVENTS: Event[] = [
  {
    id: "event-1",
    title: "RideShare Community Meetup",
    description: "Join fellow riders and drivers for a community gathering to discuss the future of decentralized ride-sharing. Food and refreshments provided!",
    date: "2025-05-15T18:00:00",
    location: "San Francisco, CA",
    organizerName: "Community DAO",
    price: 0.01,
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-2",
    title: "Blockchain & Transportation Workshop",
    description: "Learn how blockchain technology is revolutionizing transportation networks and infrastructure through hands-on workshops and expert presentations.",
    date: "2025-05-22T10:00:00",
    location: "Palo Alto, CA",
    organizerName: "Tech Innovators",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-3",
    title: "Driver Certification Program",
    description: "Get certified as a verified driver on our platform. This program includes safety training, customer service best practices, and blockchain wallet setup.",
    date: "2025-05-29T14:00:00",
    location: "Mountain View, CA",
    organizerName: "Driver Guild",
    price: 0.05,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000"
  }
];

export const EventsSlider: React.FC = () => {
  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {DEMO_EVENTS.map((event) => (
            <CarouselItem key={event.id} className="sm:basis-1/2 lg:basis-1/1">
              <div className="p-1">
                <EventCard event={event} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
          <CarouselPrevious className="relative static translate-y-0 left-0" />
          <CarouselNext className="relative static translate-y-0 right-0" />
        </div>
      </Carousel>
    </div>
  );
};
