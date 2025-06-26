
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createReview, getUserReview, SupabaseReview } from '@/lib/supabase';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
  driverId: string;
  driverName: string;
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  rideId, 
  driverId, 
  driverName,
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingReview, setExistingReview] = useState<SupabaseReview | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      checkExistingReview();
    }
  }, [isOpen, rideId, driverId]);

  const checkExistingReview = async () => {
    if (!rideId || !driverId) return;

    try {
      setLoading(true);
      const review = await getUserReview(rideId, driverId);
      if (review) {
        setExistingReview(review);
        setRating(review.rating);
        setComment(review.comment || '');
      } else {
        setExistingReview(null);
        setRating(5);
        setComment('');
      }
    } catch (error) {
      console.error('Error checking existing review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (existingReview) {
      toast({
        title: "Review already submitted",
        description: "You have already reviewed this driver for this ride.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        ride_id: rideId,
        driver_id: driverId,
        rating,
        comment: comment.trim() || undefined,
      });

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      // Call the callback to refresh the reviews list
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Failed to submit review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? 'Your Review' : `Review ${driverName}`}
          </DialogTitle>
          <DialogDescription>
            {existingReview
              ? 'You already submitted a review for this ride.'
              : 'Leave your feedback for the driver.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {existingReview && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                You have already reviewed this driver for this ride.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => !existingReview && setRating(star)}
                  className={`focus:outline-none mr-1 ${existingReview ? 'cursor-default' : 'cursor-pointer'}`}
                  disabled={!!existingReview}
                >
                  <Star
                    className={`h-8 w-8 ${star <= rating
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => !existingReview && setComment(e.target.value)}
              placeholder="Share your experience with this driver..."
              className="resize-none"
              rows={4}
              disabled={!!existingReview}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {existingReview ? 'Close' : 'Cancel'}
          </Button>
          {!existingReview && (
            <Button
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
