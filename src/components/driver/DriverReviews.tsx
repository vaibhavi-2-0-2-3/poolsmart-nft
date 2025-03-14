
import React from 'react';
import { Card } from '@/components/shared/Card';
import { Star } from 'lucide-react';

interface DriverReviewsProps {
  reviewCount: number;
}

export const DriverReviews: React.FC<DriverReviewsProps> = ({ reviewCount }) => {
  return (
    <Card className="p-6 mt-6">
      <h2 className="text-xl font-semibold mb-6">Reviews</h2>
      
      {reviewCount === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {[...Array(Math.min(3, reviewCount))].map((_, i) => (
            <div key={i} className="border-b border-border pb-4 last:border-0">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-600">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </div>
                  <span className="font-medium">Passenger {String.fromCharCode(65 + i)}</span>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} 
                      className={`h-4 w-4 ${j < 4 + (i % 2) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm">
                {[
                  "Great driver, very punctual and friendly. The car was clean and the ride was comfortable.",
                  "Excellent experience! Driver was professional and got me to my destination on time.",
                  "Reliable and safe driver. Would definitely ride with them again."
                ][i]}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
