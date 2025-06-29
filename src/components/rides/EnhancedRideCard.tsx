import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  MapPin,
  Clock,
  Users,
  MessageCircle,
  Calendar,
  Star,
} from 'lucide-react';
import { SupabaseRide } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface CompactRideCardProps {
  ride: SupabaseRide;
  onBook: (rideId: string) => void;
  onMessage: (driverId: string, driverName: string) => void;
  isBooked?: boolean;
  isEventLinked?: boolean;
}

export const EnhancedRideCard: React.FC<CompactRideCardProps> = ({
  ride,
  onBook,
  onMessage,
  isBooked = false,
  isEventLinked = false,
}) => {
  const { user } = useAuth();
  const isOwnRide = user?.id === ride.user_id;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const getDriverInitials = (name: string) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'D';

  return (
    <Card className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3 text-sm">
      {/* Event Badge */}
      {isEventLinked && (
        <Badge className="self-end text-white bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
          Event-linked
        </Badge>
      )}

      {/* Top Section */}
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt={ride.driver_name || 'Driver'} />
            <AvatarFallback className="bg-brand-100 text-brand-700">
              {getDriverInitials(ride.driver_name || 'Driver')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 truncate">
              {ride.driver_name || 'Anonymous'}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              4.8 rating
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-brand-600 text-lg">
            ₹{ride.price}
          </div>
          <div className="text-xs text-gray-400">per person</div>
        </div>
      </div>

      {/* Route Info */}
      <div className="flex items-center gap-1 text-gray-700">
        <MapPin className="h-4 w-4 text-brand-500" />
        <span className="truncate">{ride.origin} → {ride.destination}</span>
      </div>

      {/* Date & Info */}
      <div className="flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(ride.date)}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTime(ride.date)}
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {ride.seats} seats
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1">
        {!isOwnRide && (
          <Button
            size="sm"
            className="text-xs w-20"
            disabled={isBooked || ride.seats === 0}
            onClick={() => !isBooked && onBook(ride.id)}
          >
            {isBooked ? 'Booked ✓' : ride.seats === 0 ? 'Full' : 'Book'}
          </Button>
        )}
        {!isOwnRide && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMessage(ride.user_id, ride.driver_name || 'Driver')}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        )}
        <Link to={`/ride/${ride.id}`}>
          <Button variant="outline" size="icon">
            →
          </Button>
        </Link>
      </div>
    </Card>
  );
};
