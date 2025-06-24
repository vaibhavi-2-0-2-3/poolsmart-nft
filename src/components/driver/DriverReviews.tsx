import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Mock user session
const mockUser = {
  address: 'user123'
};

interface DriverReviewsProps {
  reviewCount: number;
}

export const DriverReviews: React.FC<DriverReviewsProps> = ({ reviewCount }) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { address } = mockUser;
  const { toast } = useToast();
  
  const mockReviews = [
    {
      author: "Passenger A",
      rating: 5,
      text: "Great driver, very punctual and friendly. The car was clean and the ride was comfortable.",
      date: "2023-05-15",
    },
    {
      author: "Passenger B",
      rating: 4,
      text: "Excellent experience! Driver was professional and got me to my destination on time.",
      date: "2023-06-22",
    },
    {
      author: "Passenger C",
      rating: 5,
      text: "Reliable and safe driver. Would definitely ride with them again.",
      date: "2023-07-10",
    }
  ];

  const handleSubmitReview = () => {
    if (!address) {
      toast({
        title: "Please sign in",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }
    
    if (!reviewText.trim()) {
      toast({
        title: "Review cannot be empty",
        description: "Please enter some feedback for the driver.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    // In a real app, this would save the review to the database
    setTimeout(() => {
      setSubmitting(false);
      setShowAddReview(false);
      setReviewText('');
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    }, 1000);
  };

  return (
    <Card className="p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        
        {address && !showAddReview && (
          <Button 
            variant="outline" 
            onClick={() => setShowAddReview(true)}
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Add Review
          </Button>
        )}
      </div>
      
      {showAddReview && (
        <div className="mb-6 p-4 border border-border rounded-md">
          <h3 className="font-medium mb-2">Write a Review</h3>
          
          <div className="mb-3">
            <label className="block text-sm text-muted-foreground mb-1">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none mr-1"
                >
                  <Star 
                    className={`h-6 w-6 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this driver..."
            className="mb-3"
            rows={3}
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowAddReview(false)}
              disabled={submitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={submitting}
              size="sm"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      )}
      
      {reviewCount === 0 && mockReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {mockReviews.map((review, i) => (
            <div key={i} className="border-b border-border pb-4 last:border-0">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-600">
                      {review.author.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{review.author}</span>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} 
                      className={`h-4 w-4 ${j < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm mb-2">{review.text}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{new Date(review.date).toLocaleDateString()}</span>
                <button className="flex items-center hover:text-brand-600 transition-colors">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Helpful
                </button>
              </div>
            </div>
          ))}
          
          {reviewCount > mockReviews.length && (
            <div className="text-center pt-2">
              <Button variant="outline" size="sm">
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
