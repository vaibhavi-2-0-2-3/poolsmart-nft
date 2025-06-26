
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Star, ThumbsUp, MessageCircle, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDriverReviews, SupabaseReview } from '@/lib/supabase';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { useAuth } from '@/hooks/useAuth';

interface DriverReviewsProps {
  driverId: string;
  reviewCount?: number;
}

export const DriverReviews: React.FC<DriverReviewsProps> = ({ driverId, reviewCount = 0 }) => {
  const [reviews, setReviews] = useState<SupabaseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [driverId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const driverReviews = await getDriverReviews(driverId);
      setReviews(driverReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    // Refresh reviews after a new review is submitted
    loadReviews();
    setReviewModalOpen(false);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <Card className="p-6 mt-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Reviews</h2>
            {reviews.length > 0 && (
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i}
                      className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>
          {user && (
            <Button
              onClick={() => setReviewModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Review
            </Button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Reviews will appear here after passengers rate their rides
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-4 last:border-0">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-gray-600">
                        P
                      </span>
                    </div>
                    <span className="font-medium">Passenger</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j}
                        className={`h-4 w-4 ${j < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm mb-2 ml-11">{review.comment}</p>
                )}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="ml-11">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                  <button className="flex items-center hover:text-brand-600 transition-colors">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {reviewModalOpen && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          rideId="mock-ride-id" // For now using a mock ride ID
          driverId={driverId}
          driverName="Driver" // You might want to pass the actual driver name as a prop
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </>
  );
};
