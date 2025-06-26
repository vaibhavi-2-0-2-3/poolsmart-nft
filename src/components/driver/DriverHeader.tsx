
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/shared/Button';
import { ChevronLeft, Edit, CheckCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock utility function
const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

interface DriverHeaderProps {
  userProfile: {
    username: string;
    avatar: string;
  };
  driverAddress?: string;
  verified?: boolean;
  onEditProfile: () => void;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({
  userProfile,
  driverAddress,
  verified,
  onEditProfile
}) => {
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {/* <Button
        variant="ghost"
        iconLeft={<ChevronLeft className="h-4 w-4" />}
        asChild
      >
        <Link to="/rides">Back to Rides</Link>
      </Button> */}

      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            {userProfile.avatar ? (
              <AvatarImage src={userProfile.avatar} alt={userProfile.username} />
            ) : (
              <AvatarFallback className="bg-brand-100 text-brand-600">
                {getInitials(userProfile.username)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium">{userProfile.username}</span>
        </div>

        {driverAddress && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm text-muted-foreground bg-gray-100 rounded px-2 py-1 flex items-center">
                  {shortenAddress(driverAddress)}
                  {verified && <CheckCircle className="h-4 w-4 ml-1 text-green-500" />}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{verified ? 'Verified driver' : 'Driver address'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <Button
          variant="outline"
          size="sm"
          iconLeft={<Edit className="h-4 w-4" />}
          onClick={onEditProfile}
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
