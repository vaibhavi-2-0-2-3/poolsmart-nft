
import React, { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Play, Square, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { startRide as startRideWeb3, endRide as endRideWeb3 } from '@/lib/web3';
import { startRide, endRide, Ride } from '@/lib/firebase';
import { PaymentModal } from './PaymentModal';
import { useWeb3 } from '@/hooks/useWeb3';

interface RideActionsProps {
  ride: Ride;
  isDriver: boolean;
  onStatusChange: () => void;
}

export const RideActions: React.FC<RideActionsProps> = ({
  ride,
  isDriver,
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const { toast } = useToast();
  const { address } = useWeb3();
  
  const handleStartRide = async () => {
    if (!isDriver) return;
    
    setLoading(true);
    try {
      // Call blockchain function
      const blockchainSuccess = await startRideWeb3(ride.id);
      
      if (blockchainSuccess) {
        // Update database
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
      } else {
        throw new Error("Blockchain transaction failed");
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
      // Call blockchain function
      const blockchainSuccess = await endRideWeb3(ride.id);
      
      if (blockchainSuccess) {
        // Update database
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
      } else {
        throw new Error("Blockchain transaction failed");
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
  
  const handlePaymentSuccess = () => {
    onStatusChange();
  };
  
  // Driver controls for active rides
  if (isDriver) {
    if (ride.status === 'active') {
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
  
  // Passenger controls for completed rides that need payment
  if (!isDriver && address && ride.status === 'completed' && ride.paymentStatus === 'pending') {
    return (
      <>
        <Button
          variant="primary"
          size="sm"
          iconLeft={<CreditCard className="h-4 w-4" />}
          onClick={() => setPaymentModalOpen(true)}
        >
          Pay Now
        </Button>
        
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          rideId={ride.id}
          amount={ride.price}
          onSuccess={handlePaymentSuccess}
        />
      </>
    );
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
          : ride.status === 'completed'
          ? 'Awaiting Payment'
          : 'Active'}
      </span>
    </div>
  );
};
