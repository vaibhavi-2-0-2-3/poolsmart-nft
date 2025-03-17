
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWeb3 } from '@/hooks/useWeb3';
import { Ride, createRide } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';

interface CreateRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRideModal: React.FC<CreateRideModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { address, userProfile } = useWeb3();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    departureDate: '',
    departureTime: '',
    seatsAvailable: '1',
    price: '0.01',
    driverName: '',
    driverEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // Create a temporary driver object if no wallet is connected
      const driver = address && userProfile ? {
        id: userProfile.id,
        name: userProfile.fullName,
        rating: userProfile.rating || 0,
        avatar: userProfile.avatar,
        address: address,
      } : {
        id: "temp-" + Date.now().toString(),
        name: formData.driverName || "Anonymous Driver",
        rating: 0,
        avatar: "",
        address: address || "",
      };
      
      // Create ride object
      const ride: Omit<Ride, "id"> = {
        driver,
        departure: {
          location: formData.fromLocation,
          time: `${formData.departureDate}T${formData.departureTime}`,
        },
        destination: {
          location: formData.toLocation,
        },
        price: parseFloat(formData.price),
        seatsAvailable: parseInt(formData.seatsAvailable),
        status: "active",
        passengers: [],
      };
      
      // Save ride to database
      const rideId = await createRide(ride);
      
      if (rideId) {
        toast({
          title: "Ride created",
          description: "Your ride has been successfully created",
        });
        
        // Reset form
        setFormData({
          fromLocation: '',
          toLocation: '',
          departureDate: '',
          departureTime: '',
          seatsAvailable: '1',
          price: '0.01',
          driverName: '',
          driverEmail: '',
        });
        
        // Close modal and refresh rides list
        onSuccess();
        onClose();
      } else {
        throw new Error("Failed to create ride");
      }
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
          <DialogTitle className="text-xl font-bold">Offer a Ride</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-4">
            {/* Driver info fields when no wallet is connected */}
            {!address && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="driverName">Your Name</Label>
                  <Input
                    id="driverName"
                    name="driverName"
                    placeholder="Enter your name"
                    value={formData.driverName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="driverEmail">Your Email</Label>
                  <Input
                    id="driverEmail"
                    name="driverEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.driverEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="fromLocation">From</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fromLocation"
                  name="fromLocation"
                  placeholder="Departure location"
                  className="pl-10"
                  value={formData.fromLocation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="toLocation">To</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="toLocation"
                  name="toLocation"
                  placeholder="Destination"
                  className="pl-10"
                  value={formData.toLocation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="departureDate">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departureDate"
                    name="departureDate"
                    type="date"
                    className="pl-10"
                    value={formData.departureDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="departureTime">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departureTime"
                    name="departureTime"
                    type="time"
                    className="pl-10"
                    value={formData.departureTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="seatsAvailable">Available Seats</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="seatsAvailable"
                    name="seatsAvailable"
                    type="number"
                    min="1"
                    max="8"
                    className="pl-10"
                    value={formData.seatsAvailable}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Price (ETH)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.001"
                    min="0.001"
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
      </DialogContent>
    </Dialog>
  );
};
