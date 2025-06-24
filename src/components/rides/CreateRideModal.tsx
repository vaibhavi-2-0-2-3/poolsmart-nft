import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ride, createRide, Driver } from '@/lib/firebase';
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    departureDate: '',
    departureTime: '',
    seatsAvailable: '1',
    price: '25',
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
      console.log("Creating ride with form data:", formData);
      
      // Create a unique driver ID
      const driverId = `driver_${Date.now()}`;
      
      // Create a driver object
      const driver: Driver = {
        id: driverId,
        name: formData.driverName || "Anonymous Driver",
        rating: 4.5,
        avatar: "",
        address: formData.driverEmail,
        reviewCount: 0,
        bio: `New driver offering rides from ${formData.fromLocation}`,
        carModel: "Not specified",
        carColor: "Not specified",
        licensePlate: "Not specified",
        joinDate: new Date().toISOString(),
        totalRides: 0,
        verified: false,
      };
      
      // Create ride object with correct structure
      const ride: Omit<Ride, "id"> = {
        driver,
        departure: {
          location: formData.fromLocation,
          time: `${formData.departureDate}T${formData.departureTime}:00Z`,
        },
        destination: {
          location: formData.toLocation,
        },
        price: parseFloat(formData.price),
        seatsAvailable: parseInt(formData.seatsAvailable),
        status: "active",
        passengers: [],
        verified: true,
      };
      
      console.log("Submitting ride to Firebase:", JSON.stringify(ride));
      
      // Save ride to Firebase
      const rideId = await createRide(ride);
      console.log("Ride created with ID:", rideId);
      
      if (rideId) {
        toast({
          title: "Ride created",
          description: "Your ride has been successfully created and stored in Firebase",
        });
        
        // Reset form
        setFormData({
          fromLocation: '',
          toLocation: '',
          departureDate: '',
          departureTime: '',
          seatsAvailable: '1',
          price: '25',
          driverName: '',
          driverEmail: '',
        });
        
        // Close modal and refresh rides list
        onSuccess();
        onClose();
      } else {
        throw new Error("Failed to create ride - no ride ID returned");
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
                <Label htmlFor="price">Price ($)</Label>
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
      </DialogContent>
    </Dialog>
  );
};
