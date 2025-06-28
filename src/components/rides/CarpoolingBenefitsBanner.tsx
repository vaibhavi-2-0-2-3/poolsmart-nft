
import React from 'react';
import { Card } from '@/components/shared/Card';
import { Leaf, DollarSign, Users, Heart } from 'lucide-react';

export const CarpoolingBenefitsBanner: React.FC = () => {
  const benefits = [
    {
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      title: "Reduce CO₂",
      description: "Save 2.3kg CO₂ per shared ride",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-blue-600" />,
      title: "Save Money",
      description: "Split fuel costs & parking fees",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "Meet People",
      description: "Connect with like-minded travelers",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      title: "Feel Good",
      description: "Make a positive impact together",
      color: "bg-pink-50 border-pink-200"
    }
  ];

  return (
    <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-r from-brand-50 via-white to-green-50">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-green-600 bg-clip-text text-transparent mb-2">
            Why Choose Carpooling?
          </h2>
          <p className="text-muted-foreground">
            Join thousands of travelers making a difference, one ride at a time
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${benefit.color}`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
