
const ethers = require('ethers');

// Middleware to verify user is authenticated through wallet
const authMiddleware = async (req, res, next) => {
  try {
    const { signature, message, address } = req.headers;
    
    if (!signature || !message || !address) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify signature matches the address
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // Add user to request
    req.user = { address };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = authMiddleware;
