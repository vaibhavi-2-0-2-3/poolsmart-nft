
import React, { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Play, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { startRide, endRide, Ride } from '@/lib/firebase';

interface RideActionsProps {
  ride: Ride;
  isDriver: boolean;
  isPassenger?: boolean;
  onStatusChange: () => void;
}

export const RideActions: React.FC<RideActionsProps> = ({
  ride,
  isDriver,
  isPassenger = false,
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleStartRide = async () => {
    if (!isDriver) return;
    
    setLoading(true);
    try {
      const dbSuccess = await startRide(ride.id);
      
      if (dbSuccess) {
        toast({
          title: "Ride started",
          description: "Your ride has been started successfully.",
        });
        onStatusChange();
      } else {
        throw new Error("Database update failed");
      }
    } catch (error) {
      console.error("Error starting ride:", error);
      toast({
        title: "Error starting ride",
        description: "There was an error starting your ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEndRide = async () => {
    if (!isDriver) return;
    
    setLoading(true);
    try {
      const dbSuccess = await endRide(ride.id);
      
      if (dbSuccess) {
        toast({
          title: "Ride completed",
          description: "Your ride has been completed successfully.",
        });
        onStatusChange();
      } else {
        throw new Error("Database update failed");
      }
    } catch (error) {
      console.error("Error ending ride:", error);
      toast({
        title: "Error ending ride",
        description: "There was an error ending your ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Driver controls for active rides
  if (isDriver) {
    if (ride.status === 'active' && (ride.passengers?.length || 0) > 0) {
      return (
        <Button
          variant="primary"
          size="sm"
          disabled={loading}
          iconLeft={<Play className="h-4 w-4" />}
          onClick={handleStartRide}
        >
          {loading ? 'Starting...' : 'Start Ride'}
        </Button>
      );
    }
    
    if (ride.status === 'in_progress') {
      return (
        <Button
          variant="primary"
          size="sm"
          disabled={loading}
          iconLeft={<Square className="h-4 w-4" />}
          onClick={handleEndRide}
        >
          {loading ? 'Ending...' : 'End Ride'}
        </Button>
      );
    }
  }
  
  // Passenger controls for booked rides
  if (isPassenger && !isDriver) {
    if (ride.status === 'active') {
      return (
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full mr-2 bg-green-500" />
          <span className="text-sm">Booked</span>
        </div>
      );
    }
  }
  
  // Status indicators for other states
  return (
    <div className="flex items-center">
      <div className={`h-2 w-2 rounded-full mr-2 ${
        ride.status === 'completed' && ride.paymentStatus === 'completed'
          ? 'bg-green-500'
          : ride.status === 'in_progress'
          ? 'bg-amber-500'
          : 'bg-gray-500'
      }`} />
      <span className="text-sm">
        {ride.status === 'completed' && ride.paymentStatus === 'completed'
          ? 'Completed'
          : ride.status === 'in_progress'
          ? 'In Progress'
          : ride.status === 'active' && (ride.passengers?.length || 0) > 0
          ? 'Ready to Start'
          : 'Active'}
      </span>
    </div>
  );
};
