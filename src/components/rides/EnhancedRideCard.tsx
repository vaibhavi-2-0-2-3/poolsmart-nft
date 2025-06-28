
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  MessageCircle, 
  Star,
  Leaf,
  Calendar
} from 'lucide-react';
import { SupabaseRide } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface EnhancedRideCardProps {
  ride: SupabaseRide;
  onBook: (rideId: string) => void;
  onMessage: (driverId: string, driverName: string) => void;
  isBooked?: boolean;
  isEventLinked?: boolean;
}

export const EnhancedRideCard: React.FC<EnhancedRideCardProps> = ({
  ride,
  onBook,
  onMessage,
  isBooked = false,
  isEventLinked = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const isOwnRide = user?.id === ride.user_id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDriverInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'D';
  };

  // Estimate CO2 saved (assuming 50km average distance, 0.12kg CO2/km per person)
  const estimatedCO2Saved = Math.round(50 * 0.12);

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isHovered ? 'scale-[1.02] shadow-2xl' : ''
      } bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-md`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Event Badge */}
      {isEventLinked && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg animate-pulse">
            Event-linked
          </Badge>
        </div>
      )}

      <div className="p-6">
        {/* Header with Driver Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-brand-100 transition-all duration-300 hover:ring-brand-300">
              <AvatarImage src="" alt={ride.driver_name || 'Driver'} />
              <AvatarFallback className="bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 font-semibold">
                {getDriverInitials(ride.driver_name || 'Driver')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{ride.driver_name || 'Anonymous Driver'}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span className="text-xs text-gray-600">4.8 • New driver</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-600">${ride.price}</div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
        </div>

        {/* Route Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-green-700 font-medium">From</div>
              <div className="text-sm font-semibold text-green-800 truncate">{ride.origin}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="h-8 w-px bg-gradient-to-b from-green-300 to-blue-300"></div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-blue-700 font-medium">To</div>
              <div className="text-sm font-semibold text-blue-800 truncate">{ride.destination}</div>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Calendar className="h-4 w-4 text-gray-600 mx-auto mb-1" />
            <div className="text-xs text-gray-600">{formatDate(ride.date)}</div>
            <div className="text-xs font-semibold text-gray-800">{formatTime(ride.date)}</div>
          </div>
          
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 text-gray-600 mx-auto mb-1" />
            <div className="text-xs text-gray-600">Seats</div>
            <div className="text-xs font-semibold text-gray-800">{ride.seats} available</div>
          </div>

          <div className="text-center p-2 bg-green-50 rounded-lg">
            <Leaf className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <div className="text-xs text-green-600">CO₂ saved</div>
            <div className="text-xs font-semibold text-green-800">{estimatedCO2Saved}kg</div>
          </div>
        </div>

        {/* Visual Seat Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Available seats</span>
            <span className="text-xs font-semibold text-gray-800">{ride.seats}/4</span>
          </div>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                  i < ride.seats 
                    ? 'bg-gradient-to-r from-green-400 to-green-500' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isOwnRide && (
            <>
              <Button
                variant={isBooked ? "outline" : "primary"}
                className={`flex-1 transition-all duration-300 ${
                  isBooked 
                    ? 'bg-green-50 text-green-700 border-green-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 shadow-lg hover:shadow-xl'
                }`}
                onClick={() => !isBooked && onBook(ride.id)}
                disabled={isBooked || ride.seats === 0}
              >
                {isBooked ? 'Booked ✓' : ride.seats === 0 ? 'Full' : 'Book Ride'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="px-3 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => onMessage(ride.user_id, ride.driver_name || 'Driver')}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            <Link to={`/ride/${ride.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      } pointer-events-none`} />
    </Card>
  );
};
