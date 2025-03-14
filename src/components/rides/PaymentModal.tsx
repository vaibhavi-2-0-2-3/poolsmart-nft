
import React, { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Check, X, AlertCircle, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processPayment as processBlockchainPayment } from '@/lib/web3';
import { processPayment as processDbPayment } from '@/lib/db';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
  amount: number;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  rideId,
  amount,
  onSuccess,
}) => {
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');
    
    try {
      // Process payment on blockchain
      const blockchainSuccess = await processBlockchainPayment(rideId, amount);
      
      if (!blockchainSuccess) {
        throw new Error('Blockchain payment failed');
      }
      
      // Update local database
      const dbSuccess = processDbPayment(rideId);
      
      if (!dbSuccess) {
        throw new Error('Database update failed');
      }
      
      // Payment successful
      setPaymentStatus('success');
      toast({
        title: "Payment successful",
        description: `You've successfully paid ${amount} ETH for your ride.`,
      });
      
      // Wait a bit before closing to let user see the success state
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetModal = () => {
    setPaymentStatus('idle');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay for your ride using cryptocurrency.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            {paymentStatus === 'idle' && (
              <>
                <div className="rounded-full bg-brand-100 p-3">
                  <div className="rounded-full bg-brand-600 p-5">
                    <span className="text-2xl font-bold text-white">${(amount * 2000).toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Ride Payment</h3>
                  <p className="text-muted-foreground mb-1">Amount: <span className="font-medium">{amount} ETH</span></p>
                  <p className="text-muted-foreground">Ride ID: <span className="font-medium">#{rideId}</span></p>
                </div>
              </>
            )}

            {paymentStatus === 'processing' && (
              <div className="text-center space-y-4">
                <Loader className="h-12 w-12 animate-spin text-brand-600 mx-auto" />
                <h3 className="text-lg font-medium">Processing Payment</h3>
                <p className="text-muted-foreground">Please confirm the transaction in your wallet...</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center space-y-4">
                <div className="rounded-full bg-green-100 p-3 mx-auto">
                  <Check className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Payment Successful!</h3>
                <p className="text-muted-foreground">Your payment has been processed successfully.</p>
              </div>
            )}

            {paymentStatus === 'error' && (
              <div className="text-center space-y-4">
                <div className="rounded-full bg-red-100 p-3 mx-auto">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-lg font-medium">Payment Failed</h3>
                <p className="text-muted-foreground">There was an error processing your payment. Please try again.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {paymentStatus === 'idle' && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePayment}>
                Pay Now
              </Button>
            </>
          )}

          {paymentStatus === 'processing' && (
            <Button variant="outline" disabled>
              Processing...
            </Button>
          )}

          {paymentStatus === 'success' && (
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          )}

          {paymentStatus === 'error' && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePayment}>
                Try Again
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
