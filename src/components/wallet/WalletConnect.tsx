
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { Button } from '../shared/Button';
import { Wallet2, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserRegistrationModal, UserProfileData } from '../profile/UserRegistrationModal';
import { WalletDropdown } from './WalletDropdown';
import { shortenAddress, copyAddressToClipboard } from './walletUtils';

export const WalletConnect = () => {
  const { address, connect, disconnect, isConnecting, balance, userProfile, completeRegistration } = useWeb3();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.wallet-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Check if registration is needed when address changes
  useEffect(() => {
    if (address && !userProfile) {
      setPendingAddress(address);
      setShowRegistration(true);
    }
  }, [address, userProfile]);
  
  const copyToClipboard = () => {
    copyAddressToClipboard(address, toast);
  };
  
  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been successfully disconnected",
    });
  };
  
  const handleConnect = async () => {
    try {
      await connect();
      // Registration modal will be shown by the useEffect if needed
    } catch (error) {
      console.error("Connection error:", error);
    }
  };
  
  const handleCompleteRegistration = async (userData: UserProfileData) => {
    try {
      const success = await completeRegistration(userData);
      if (success) {
        toast({
          title: "Profile created",
          description: "Your profile has been successfully created",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Failed to complete registration. Please try again.",
        variant: "destructive",
      });
    }
    setPendingAddress(null);
  };
  
  const renderConnectButton = () => (
    <>
      <Button 
        variant="primary"
        onClick={handleConnect}
        isLoading={isConnecting}
        iconLeft={!isConnecting && <Wallet2 className="h-4 w-4" />}
        aria-label="Connect wallet"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      
      {showRegistration && pendingAddress && (
        <UserRegistrationModal
          isOpen={showRegistration}
          onClose={() => {
            setShowRegistration(false);
            setPendingAddress(null);
            disconnect(); // Disconnect if they cancel registration
          }}
          onComplete={handleCompleteRegistration}
          walletAddress={pendingAddress}
        />
      )}
    </>
  );
  
  const renderConnectedWallet = () => (
    <div className="relative wallet-dropdown">
      <Button
        variant="outline"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="border-brand-200 hover:border-brand-300 flex items-center gap-2"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span>{userProfile?.username || shortenAddress(address)}</span>
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      {isDropdownOpen && (
        <WalletDropdown
          address={address || ''}
          balance={balance || '0.00'}
          userProfile={userProfile}
          onDisconnect={handleDisconnect}
          onCopyAddress={copyToClipboard}
        />
      )}
      
      {/* Show registration if wallet connected but no profile exists */}
      {showRegistration && pendingAddress && (
        <UserRegistrationModal
          isOpen={showRegistration}
          onClose={() => {
            setShowRegistration(false);
            setPendingAddress(null);
            disconnect(); // Disconnect if they cancel registration
          }}
          onComplete={handleCompleteRegistration}
          walletAddress={pendingAddress}
        />
      )}
    </div>
  );
  
  return address ? renderConnectedWallet() : renderConnectButton();
};
