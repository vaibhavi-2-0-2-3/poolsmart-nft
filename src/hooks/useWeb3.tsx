
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface Web3ContextType {
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  balance: null,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Format balance to 4 decimal places
  const formatBalance = (rawBalance: string) => {
    if (!rawBalance) return null;
    const balance = parseInt(rawBalance, 16) / 1e18;
    return balance.toFixed(4);
  };

  // Get account balance
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

  // Connect wallet
  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask browser extension to connect",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Request accounts access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        
        // Get and set balance
        const currentBalance = await getBalance(accounts[0]);
        setBalance(currentBalance);
        
        // Store connection in localStorage to persist between refreshes
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', accounts[0]);
        
        toast({
          title: "Wallet connected",
          description: "Your wallet has been successfully connected",
        });
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection failed",
        description: error?.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    
    // Remove wallet connection from localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  // Handle account changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnect();
    } else if (accounts[0] !== address) {
      setAddress(accounts[0]);
      const currentBalance = await getBalance(accounts[0]);
      setBalance(currentBalance);
      
      // Update localStorage with new address
      localStorage.setItem('walletAddress', accounts[0]);
      
      toast({
        title: "Account changed",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    // Reload the page when the chain changes
    window.location.reload();
  };

  // Set up event listeners
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    // Check for existing connection in localStorage
    const checkConnection = async () => {
      const walletConnected = localStorage.getItem('walletConnected');
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (walletConnected === 'true' && savedAddress) {
        try {
          // Verify if the wallet is still connected through MetaMask
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            const currentBalance = await getBalance(accounts[0]);
            setBalance(currentBalance);
          } else {
            // If MetaMask no longer has the account, clear localStorage
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

    // Set up event listeners for MetaMask
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Clean up event listeners
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
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
