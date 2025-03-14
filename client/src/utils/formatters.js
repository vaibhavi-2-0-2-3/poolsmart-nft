
// Format date to user-friendly string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format time to user-friendly string
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Format ETH amount
export const formatEth = (amount) => {
  return `${parseFloat(amount).toFixed(4)} ETH`;
};

// Format ETH to USD
export const ethToUsd = (ethAmount, ethPrice = 2000) => {
  const usdValue = parseFloat(ethAmount) * ethPrice;
  return `$${usdValue.toFixed(2)}`;
};

// Shorten wallet address
export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
