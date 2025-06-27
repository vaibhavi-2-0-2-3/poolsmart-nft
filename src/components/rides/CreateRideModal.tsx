
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { createRide } from '@/lib/supabase';
import { linkRideToEvent } from '@/lib/eventsApi';
import { MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { ProtectedAction } from '../auth/ProtectedAction';

interface CreateRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventData?: {
    eventId: string;
    eventName: string;
    destination: string;
    date: string;
    time: string;
  };
}

export const CreateRideModal: React.FC<CreateRideModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  eventData,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    seats: '1',
    price: '25',
  });

  // Pre-fill form with event data
  useEffect(() => {
    if (eventData) {
      setFormData(prev => ({
        ...prev,
        destination: eventData.destination,
        date: eventData.date,
        time: eventData.time,
      }));
    }
  }, [eventData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a ride.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const rideData = {
        origin: formData.origin,
        destination: formData.destination,
        seats: parseInt(formData.seats),
        date: `${formData.date}T${formData.time}:00Z`,
        price: parseFloat(formData.price),
        driver_name: user.user_metadata?.full_name || user.email || 'Anonymous',
        driver_email: user.email || '',
      };
      
      const rideId = await createRide(rideData);
      
      // Link ride to event if eventData is provided
      if (eventData && eventData.eventId) {
        try {
          await linkRideToEvent(rideId, eventData.eventId);
        } catch (linkError) {
          console.error('Error linking ride to event:', linkError);
          // Don't fail the whole operation if linking fails
        }
      }
      
      toast({
        title: "Ride created",
        description: eventData 
          ? `Your ride to ${eventData.eventName} has been created!`
          : "Your ride has been successfully created!",
      });
      
      // Reset form
      setFormData({
        origin: '',
        destination: '',
        date: '',
        time: '',
        seats: '1',
        price: '25',
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating ride:", error);
      toast({
        title: "Error",
        description: "There was an error creating your ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {eventData ? `Offer Ride to ${eventData.eventName}` : 'Offer a Ride'}
          </DialogTitle>
        </DialogHeader>
        
        <ProtectedAction requireAuth={true}>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="origin">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="origin"
                    name="origin"
                    placeholder="Departure location"
                    className="pl-10"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="destination">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="Destination"
                    className="pl-10"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    disabled={!!eventData}
                  />
                </div>
                {eventData && (
                  <p className="text-xs text-muted-foreground">
                    Destination pre-filled from event
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      className="pl-10"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      className="pl-10"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="seats">Available Seats</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="seats"
                      name="seats"
                      type="number"
                      min="1"
                      max="8"
                      className="pl-10"
                      value={formData.seats}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="1"
                      min="1"
                      className="pl-10"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Ride'}
              </Button>
            </DialogFooter>
          </form>
        </ProtectedAction>
      </DialogContent>
    </Dialog>
  );
};
