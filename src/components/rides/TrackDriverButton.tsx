
import React from 'react';
import { Button } from '@/components/shared/Button';
import { MapPin } from 'lucide-react';

interface TrackDriverButtonProps {
  isTracking: boolean;
  onClick: () => void;
}

export const TrackDriverButton: React.FC<TrackDriverButtonProps> = ({ 
  isTracking, 
  onClick 
}) => {
  return (
    <Button
      variant={isTracking ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={isTracking ? "bg-brand-600 hover:bg-brand-700" : ""}
    >
      <MapPin className="h-4 w-4 mr-2" />
      {isTracking ? "Hide Tracking" : "Track Driver"}
    </Button>
  );
};
