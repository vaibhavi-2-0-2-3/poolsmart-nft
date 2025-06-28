
import React from 'react';
import { Card } from '@/components/shared/Card';
import { Leaf, Car, Users, Star, Award, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileStatsProps {
  totalRidesGiven: number;
  totalRidesTaken: number;
  co2Saved: number;
  rating: number;
  totalReviews: number;
}

export const ProfileStatsCard: React.FC<ProfileStatsProps> = ({
  totalRidesGiven,
  totalRidesTaken,
  co2Saved,
  rating,
  totalReviews
}) => {
  const badges = [
    { name: 'Eco Warrior', condition: co2Saved >= 50, icon: <Leaf className="h-4 w-4" /> },
    { name: 'Road Veteran', condition: totalRidesGiven >= 10, icon: <Car className="h-4 w-4" /> },
    { name: 'Social Butterfly', condition: totalRidesTaken >= 5, icon: <Users className="h-4 w-4" /> },
    { name: 'Five Star', condition: rating >= 4.5, icon: <Star className="h-4 w-4" /> }
  ];

  const earnedBadges = badges.filter(badge => badge.condition);

  return (
    <Card className="p-6 bg-gradient-to-br from-brand-50 to-green-50 border-brand-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-600 rounded-full">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Your Impact</h3>
          <p className="text-sm text-muted-foreground">Making a difference together</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-brand-100">
          <div className="text-2xl font-bold text-brand-600 mb-1">{totalRidesGiven}</div>
          <div className="text-xs text-muted-foreground">Rides Given</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-100">
          <div className="text-2xl font-bold text-green-600 mb-1">{totalRidesTaken}</div>
          <div className="text-xs text-muted-foreground">Rides Taken</div>
        </div>
        <div className="col-span-2 text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{co2Saved}kg</div>
          </div>
          <div className="text-sm text-green-700 font-medium">CO₂ Saved</div>
          <div className="text-xs text-muted-foreground mt-1">
            Equivalent to planting {Math.round(co2Saved / 22)} trees
          </div>
        </div>
      </div>

      {earnedBadges.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            Achievements
          </h4>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((badge, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1"
              >
                {badge.icon}
                {badge.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {rating > 0 && (
        <div className="mt-4 pt-4 border-t border-brand-200">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-gray-800">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
          </div>
        </div>
      )}
    </Card>
  );
};
