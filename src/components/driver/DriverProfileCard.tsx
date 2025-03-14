
import React from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Star, Calendar, Car, Shield, Award, UserRound, MessageCircle } from 'lucide-react';
import { Driver } from '@/lib/db';

interface DriverProfileCardProps {
  driver: Driver;
  onContactDriver: () => void;
}

export const DriverProfileCard: React.FC<DriverProfileCardProps> = ({ driver, onContactDriver }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="h-24 w-24 rounded-full bg-brand-100 flex items-center justify-center mb-4">
          <UserRound className="h-12 w-12 text-brand-600" />
        </div>
        
        <h1 className="text-2xl font-bold">{driver.name}</h1>
        
        <div className="flex items-center mt-2 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} 
                className={`h-4 w-4 ${i < Math.floor(driver.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="ml-2 text-sm">
            {driver.rating} ({driver.reviewCount} reviews)
          </span>
        </div>
        
        {driver.verified && (
          <div className="flex items-center text-green-700 mt-2">
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-sm">Verified Driver</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-border pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
            <p className="text-sm">{driver.bio || "No bio available"}</p>
          </div>
          
          <div className="flex items-center">
            <Award className="h-5 w-5 text-brand-600 mr-3" />
            <div>
              <div className="text-sm font-medium">{driver.completedRides || 0} rides completed</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-brand-600 mr-3" />
            <div>
              <div className="text-sm font-medium">Member since {driver.joinedDate ? formatDate(driver.joinedDate) : "Unknown"}</div>
            </div>
          </div>
          
          {driver.car && (
            <div className="flex items-center">
              <Car className="h-5 w-5 text-brand-600 mr-3" />
              <div>
                <div className="text-sm font-medium">{driver.car.model} ({driver.car.year})</div>
                <div className="text-xs text-muted-foreground">{driver.car.color}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full" 
          iconLeft={<MessageCircle className="h-4 w-4" />}
          onClick={onContactDriver}
        >
          Contact Driver
        </Button>
      </div>
    </Card>
  );
};
