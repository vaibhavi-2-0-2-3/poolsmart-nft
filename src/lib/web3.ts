
// Add type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, listener: (...args: any[]) => void) => void;
      removeListener: (event: string, listener: (...args: any[]) => void) => void;
    };
  }
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

// Format ETH amount
export const formatEth = (amount: number): string => {
  return amount.toFixed(4) + ' ETH';
};

// Shorten wallet address
export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Convert ETH to USD (placeholder - would need a real price API)
export const ethToUsd = (ethAmount: number): string => {
  // Placeholder conversion rate - in a real app, you'd fetch this from an API
  const ethUsdRate = 2000;
  const usdValue = ethAmount * ethUsdRate;
  
  return `$${usdValue.toFixed(2)}`;
};

// Get current network name
export const getNetworkName = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) return 'Unknown Network';
  
  try {
    const chainId = await window.ethereum!.request({ method: 'eth_chainId' });
    const networkMap: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x3': 'Ropsten Test Network',
      '0x4': 'Rinkeby Test Network',
      '0x5': 'Goerli Test Network',
      '0x2a': 'Kovan Test Network',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai',
    };
    
    return networkMap[chainId] || `Chain ID: ${chainId}`;
  } catch (error) {
    console.error('Error getting network:', error);
    return 'Unknown Network';
  }
};

// Switch network
export const switchNetwork = async (chainId: string): Promise<boolean> => {
  if (!isMetaMaskInstalled()) return false;
  
  try {
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    
    return true;
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      // In a real app, you would add the network here
      console.error('Network not available, need to add it');
    }
    
    console.error('Error switching network:', error);
    return false;
  }
};

export default {
  isMetaMaskInstalled,
  formatEth,
  shortenAddress,
  ethToUsd,
  getNetworkName,
  switchNetwork,
};
