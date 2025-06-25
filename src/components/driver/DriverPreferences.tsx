
import React from 'react';
import { Card } from '@/components/shared/Card';
import { Music, PawPrint, Cigarette, Baby, CheckCircle, XCircle } from 'lucide-react';

interface DriverPreferencesProps {
  preferences: {
    music: boolean;
    pets: boolean;
    smoking: boolean;
    children: boolean;
  };
}

export const DriverPreferences: React.FC<DriverPreferencesProps> = ({ preferences }) => {
  const preferenceItems = [
    {
      key: 'music',
      label: 'Music',
      icon: Music,
      allowed: preferences.music,
    },
    {
      key: 'pets',
      label: 'Pets',
      icon: PawPrint,
      allowed: preferences.pets,
    },
    {
      key: 'smoking',
      label: 'Smoking',
      icon: Cigarette,
      allowed: preferences.smoking,
    },
    {
      key: 'children',
      label: 'Children',
      icon: Baby,
      allowed: preferences.children,
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Driver Preferences</h3>
      <div className="space-y-3">
        {preferenceItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="flex items-center">
              <item.icon className="h-5 w-5 text-brand-600 mr-3" />
              <span className="font-medium">{item.label}</span>
            </div>
            <div className="flex items-center">
              {item.allowed ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">Allowed</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600 mr-1" />
                  <span className="text-sm text-red-600">Not allowed</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
