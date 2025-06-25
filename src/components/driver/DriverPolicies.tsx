
import React from 'react';
import { Card } from '@/components/shared/Card';
import { MapPin, Luggage, Users, Shield } from 'lucide-react';

interface DriverPoliciesProps {
  policies: {
    detourFlexibility: 'low' | 'medium' | 'high';
    maxLuggageSize: 'small' | 'medium' | 'large';
    maxPassengers: number;
    comfortGuarantee: boolean;
  };
}

export const DriverPolicies: React.FC<DriverPoliciesProps> = ({ policies }) => {
  const getFlexibilityText = (level: string) => {
    switch (level) {
      case 'low': return 'Limited detours';
      case 'medium': return 'Some detours OK';
      case 'high': return 'Flexible route';
      default: return level;
    }
  };

  const getLuggageText = (size: string) => {
    switch (size) {
      case 'small': return 'Backpack only';
      case 'medium': return 'Medium bag';
      case 'large': return 'Large suitcase';
      default: return size;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Ride Policies</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-brand-600 mr-3" />
            <span className="font-medium">Detour flexibility</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {getFlexibilityText(policies.detourFlexibility)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Luggage className="h-5 w-5 text-brand-600 mr-3" />
            <span className="font-medium">Luggage size</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {getLuggageText(policies.maxLuggageSize)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-brand-600 mr-3" />
            <span className="font-medium">Max passengers</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {policies.maxPassengers} {policies.maxPassengers === 1 ? 'passenger' : 'passengers'}
          </span>
        </div>

        {policies.comfortGuarantee && (
          <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Shield className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              Comfort guarantee included
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
