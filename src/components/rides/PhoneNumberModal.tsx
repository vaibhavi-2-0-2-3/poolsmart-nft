
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateUserPhoneNumber } from '@/lib/supabase';

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phoneNumber: string) => void;
  currentPhoneNumber?: string | null;
}

export const PhoneNumberModal: React.FC<PhoneNumberModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPhoneNumber,
}) => {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number for ride coordination.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await updateUserPhoneNumber(phoneNumber.trim());
      
      toast({
        title: "Phone number updated",
        description: "Your phone number has been saved successfully.",
      });
      
      onSuccess(phoneNumber.trim());
      onClose();
    } catch (error) {
      console.error("Error updating phone number:", error);
      toast({
        title: "Error",
        description: "There was an error saving your phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Number Required
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              We need your phone number to help coordinate rides and ensure safety.
            </p>
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
              {loading ? 'Saving...' : 'Save Phone Number'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
