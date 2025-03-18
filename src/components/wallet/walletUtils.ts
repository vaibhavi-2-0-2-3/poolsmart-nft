
/**
 * Shortens an Ethereum address for display purposes
 * @param address The full Ethereum address
 * @returns Shortened address string (e.g., 0x1234...5678)
 */
export const shortenAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Copies the wallet address to clipboard and shows a toast notification
 * @param address The wallet address to copy
 * @param toast The toast function to show notification
 */
export const copyAddressToClipboard = (
  address: string | null,
  toast: any
): void => {
  if (address) {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied",
      description: "Your wallet address has been copied to clipboard",
    });
  }
};
