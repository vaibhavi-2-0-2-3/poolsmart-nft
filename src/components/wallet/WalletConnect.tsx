
import React, { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { Button } from '../shared/Button';
import { Wallet2, ChevronDown, Loader2, LogOut, Copy } from 'lucide-react';
import { Card } from '../shared/Card';
import { useToast } from '@/hooks/use-toast';

export const WalletConnect = () => {
  const { address, connect, disconnect, isConnecting, balance } = useWeb3();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toast } = useToast();
  
  const shortenAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Your wallet address has been copied to clipboard",
      });
    }
  };
  
  if (!address) {
    return (
      <Button 
        variant="primary"
        onClick={connect}
        isLoading={isConnecting}
        iconLeft={!isConnecting && <Wallet2 className="h-4 w-4" />}
        aria-label="Connect wallet"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }
  
  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="border-brand-200 hover:border-brand-300 flex items-center gap-2"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span>{shortenAddress(address)}</span>
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      {isDropdownOpen && (
        <Card
          className="absolute right-0 mt-2 w-60 z-50 shadow-lg animate-fade-in"
          variant="default"
          padding="none"
        >
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Connected</span>
              <button
                onClick={copyToClipboard}
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
              onClick={() => {
                disconnect();
                setIsDropdownOpen(false);
              }}
              iconLeft={<LogOut className="h-4 w-4" />}
            >
              Disconnect
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
