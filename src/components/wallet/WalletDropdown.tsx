
import React from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Copy, LogOut } from 'lucide-react';
import { UserProfile } from '@/lib/firebase';

interface WalletDropdownProps {
  address: string;
  balance: string;
  userProfile: UserProfile | null;
  onDisconnect: () => void;
  onCopyAddress: () => void;
}

export const WalletDropdown: React.FC<WalletDropdownProps> = ({
  address,
  balance,
  userProfile,
  onDisconnect,
  onCopyAddress,
}) => {
  return (
    <Card
      className="absolute right-0 mt-2 w-60 z-50 shadow-lg animate-fade-in"
      variant="default"
      padding="none"
    >
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Connected</span>
          <button
            onClick={onCopyAddress}
            className="text-brand-600 hover:text-brand-700 transition-colors"
            aria-label="Copy address"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <div className="text-xs text-muted-foreground break-all">
          {address}
        </div>
      </div>
      
      {userProfile && (
        <div className="p-4 border-b border-border">
          <div className="text-sm font-medium mb-1">Profile</div>
          <div className="text-xs text-muted-foreground mb-1">
            {userProfile.fullName}
          </div>
          <div className="text-xs text-muted-foreground">
            {userProfile.email}
          </div>
        </div>
      )}
      
      <div className="p-4 border-b border-border">
        <div className="text-sm font-medium mb-1">Balance</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 256 417" 
              xmlns="http://www.w3.org/2000/svg" 
              preserveAspectRatio="xMidYMid"
            >
              <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
              <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
              <path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
              <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"/>
              <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
              <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"/>
            </svg>
            <span className="font-medium">{balance || '0.00'} ETH</span>
          </div>
          <span className="text-xs text-muted-foreground">≈ $0.00</span>
        </div>
      </div>
      
      <div className="p-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onDisconnect}
          iconLeft={<LogOut className="h-4 w-4" />}
        >
          Disconnect
        </Button>
      </div>
    </Card>
  );
};
