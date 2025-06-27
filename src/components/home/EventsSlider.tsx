
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for events slider - adding missing category field
const mockEvents = [
  {
    id: '1',
    title: 'Sunburn Festival 2025',
    description: 'Asia\'s largest electronic dance music festival returns to Goa with world-class DJs.',
    date: '2025-01-15T18:00:00+05:30',
    location: 'Vagator Beach, North Goa',
    organizerName: 'Sunburn Events',
    price: 2500,
    category: 'music',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Comic Con Goa 2025',
    description: 'The ultimate celebration of comics, gaming, and pop culture in Goa.',
    date: '2025-02-20T10:00:00+05:30',
    location: 'Goa Convention Center, Panaji',
    organizerName: 'Comic Con India',
    category: 'entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=800&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Goa Food & Music Festival',
    description: 'A delightful blend of Goan cuisine and live music performances.',
    date: '2025-01-25T17:00:00+05:30',
    location: 'Miramar Beach, Panaji',
    organizerName: 'Goa Tourism',
    price: 800,
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop'
  },
  {
    id: '4',
    title: 'Shigmo Festival Parade',
    description: 'Traditional Goan spring festival with colorful parades and folk dances.',
    date: '2025-03-10T16:00:00+05:30',
    location: 'Panaji City Center',
    organizerName: 'Goa Cultural Department',
    price: 0,
    category: 'cultural',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop'
  }
];

export const EventsSlider = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music':
        return 'bg-purple-100 text-purple-800';
      case 'entertainment':
        return 'bg-blue-100 text-blue-800';
      case 'food':
        return 'bg-orange-100 text-orange-800';
      case 'cultural':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockEvents.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`} className="group">
          <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:scale-[1.02]">
            <div className="relative">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-48 object-cover"
              />
              <Badge className={`absolute top-3 left-3 ${getCategoryColor(event.category)}`}>
                {event.category}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                {event.title}
              </h3>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-brand-600" />
                  <span>{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-brand-600" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {event.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-brand-600">
                  {event.price ? `₹${event.price}` : 'Free'}
                </span>
                <span className="text-xs text-muted-foreground">
                  by {event.organizerName}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
