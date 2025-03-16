import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { getUserProfile, createUserProfile, UserProfile } from '@/lib/firebase';
import { UserProfileData } from '@/components/profile/UserRegistrationModal';

interface Web3ContextType {
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  userProfile: UserProfile | null;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  completeRegistration: (userData: UserProfileData) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  balance: null,
  isConnecting: false,
  userProfile: null,
  connect: async () => null,
  disconnect: () => {},
  completeRegistration: async () => false,
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  const formatBalance = (rawBalance: string) => {
    if (!rawBalance) return null;
    const balance = parseInt(rawBalance, 16) / 1e18;
    return balance.toFixed(4);
  };

  const getBalance = async (account: string) => {
    if (!isMetaMaskInstalled() || !account) return null;
    
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });
      
      return formatBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    }
  };

  const connect = async (): Promise<string | null> => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask browser extension to connect",
        variant: "destructive",
      });
      return null;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        setAddress(walletAddress);
        
        const currentBalance = await getBalance(walletAddress);
        setBalance(currentBalance);
        
        const profile = await getUserProfile(walletAddress);
        if (profile) {
          setUserProfile(profile);
          
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAddress', walletAddress);
          
          toast({
            title: "Wallet connected",
            description: "Welcome back, " + profile.username,
          });
        } else {
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAddress', walletAddress);
        }
        
        return walletAddress;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection failed",
        description: error?.message || "Failed to connect wallet",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const completeRegistration = async (userData: UserProfileData): Promise<boolean> => {
    try {
      await createUserProfile(userData);
      
      const profile = await getUserProfile(userData.walletAddress);
      if (profile) {
        setUserProfile(profile);
        
        if (!address) {
          setAddress(userData.walletAddress);
        }
        
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', userData.walletAddress);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast({
        title: "Registration failed",
        description: "Failed to create your profile. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    setUserProfile(null);
    
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else if (accounts[0] !== address) {
      const newAddress = accounts[0];
      setAddress(newAddress);
      
      const currentBalance = await getBalance(newAddress);
      setBalance(currentBalance);
      
      const profile = await getUserProfile(newAddress);
      setUserProfile(profile);
      
      localStorage.setItem('walletAddress', newAddress);
      
      toast({
        title: profile ? "Account changed" : "New account detected",
        description: profile 
          ? `Welcome back, ${profile.username}` 
          : `Connected to ${newAddress.slice(0, 6)}...${newAddress.slice(-4)}. Please complete your profile.`,
      });
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const checkConnection = async () => {
      const walletConnected = localStorage.getItem('walletConnected');
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (walletConnected === 'true' && savedAddress) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            const currentBalance = await getBalance(accounts[0]);
            setBalance(currentBalance);
            
            const profile = await getUserProfile(accounts[0]);
            setUserProfile(profile);
          } else {
            localStorage.removeItem('walletConnected');
            localStorage.removeItem('walletAddress');
          }
        } catch (error) {
          console.error('Error checking connection:', error);
          localStorage.removeItem('walletConnected');
          localStorage.removeItem('walletAddress');
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        address,
        balance,
        isConnecting,
        userProfile,
        connect,
        disconnect,
        completeRegistration,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
