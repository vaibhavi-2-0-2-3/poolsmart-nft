
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { createRide } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CalendarIcon, MapPinIcon, UsersIcon, IndianRupeeIcon } from 'lucide-react';

interface CreateRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRideCreated?: () => void;
  eventId?: string;
  eventName?: string;
  prefilledData?: {
    destination?: string;
    date?: string;
    time?: string;
  };
}

interface RideFormData {
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  notes: string;
}

export const CreateRideModal: React.FC<CreateRideModalProps> = ({
  isOpen,
  onClose,
  onRideCreated,
  eventId,
  eventName,
  prefilledData
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RideFormData>({
    defaultValues: {
      destination: prefilledData?.destination || '',
      date: prefilledData?.date || '',
      time: prefilledData?.time || '',
      seats: 4,
      price: 0
    }
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const onSubmit = async (data: RideFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a ride.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a proper ISO date string for consistent timezone handling
      const rideDateTime = new Date(`${data.date}T${data.time}:00`);
      
      const rideData = {
        origin: data.origin,
        destination: data.destination,
        seats: Number(data.seats),
        date: rideDateTime.toISOString(), // This ensures consistent UTC storage
        price: Number(data.price),
        driver_name: user.user_metadata?.full_name || user.email || 'Anonymous',
        driver_email: user.email || '',
        event_id: eventId // Pass the event_id if provided
      };

      await createRide(rideData);
      
      toast({
        title: "Ride created successfully!",
        description: eventName ? `Your ride to ${eventName} has been posted.` : "Your ride has been posted and is now available for bookings."
      });

      reset();
      onClose();
      onRideCreated?.();
    } catch (error) {
      console.error('Error creating ride:', error);
      toast({
        title: "Failed to create ride",
        description: "There was an error creating your ride. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-brand-600" />
            {eventName ? `Offer Ride to ${eventName}` : 'Create New Ride'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="origin" className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                Pickup Location
              </Label>
              <Input
                id="origin"
                placeholder="e.g., Connaught Place, New Delhi"
                {...register('origin', { required: 'Pickup location is required' })}
                className={errors.origin ? 'border-red-500' : ''}
              />
              {errors.origin && (
                <p className="text-sm text-red-500 mt-1">{errors.origin.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                Destination
              </Label>
              <Input
                id="destination"
                placeholder="e.g., India Gate, New Delhi"
                {...register('destination', { required: 'Destination is required' })}
                className={errors.destination ? 'border-red-500' : ''}
                readOnly={!!prefilledData?.destination}
              />
              {errors.destination && (
                <p className="text-sm text-red-500 mt-1">{errors.destination.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time', { required: 'Time is required' })}
                  className={errors.time ? 'border-red-500' : ''}
                />
                {errors.time && (
                  <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seats" className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  Available Seats
                </Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  max="8"
                  {...register('seats', { 
                    required: 'Number of seats is required',
                    min: { value: 1, message: 'At least 1 seat required' },
                    max: { value: 8, message: 'Maximum 8 seats allowed' }
                  })}
                  className={errors.seats ? 'border-red-500' : ''}
                />
                {errors.seats && (
                  <p className="text-sm text-red-500 mt-1">{errors.seats.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="price" className="flex items-center gap-2">
                  <IndianRupeeIcon className="h-4 w-4" />
                  Price per Seat
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="10"
                  placeholder="0"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price cannot be negative' }
                  })}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information for passengers..."
                {...register('notes')}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Ride'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
