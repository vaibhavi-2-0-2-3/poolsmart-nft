import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { SupabaseRide } from '@/lib/supabase';

interface DriverRidesListProps {
  driverName: string;
  rides: SupabaseRide[];
}

export const DriverRidesList: React.FC<DriverRidesListProps> = ({ driverName, rides }) => {
  const formatRideDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatRideTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Upcoming Rides by {driverName}</h2>

      {rides.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No upcoming rides scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="border border-border rounded-lg p-4">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div className="flex items-center mb-2 md:mb-0">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">From</span>
                    <span className="font-medium">{ride.origin || 'Unknown'}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">To</span>
                    <span className="font-medium">{ride.destination || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Date</span>
                    <span className="font-medium">{formatRideDate(ride.date)}</span>
                  </div>
                </div>

                <div className="flex items-center mb-2 md:mb-0">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                    <Clock className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Time</span>
                    <span className="font-medium">{formatRideTime(ride.date)}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="ml-auto">
                    <span className="text-xs text-muted-foreground block">Price</span>
                    <span className="font-medium">{ride.price} ETH</span>
                  </div>

                  <Link to={`/rides/${ride.id}`} className="ml-4">
                    <Button variant="primary" size="sm">
                      View Ride
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
