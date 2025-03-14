
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add authentication headers
api.interceptors.request.use(
  async (config) => {
    // Get wallet address from localStorage
    const address = localStorage.getItem('walletAddress');
    
    if (address) {
      // For routes that need authentication, add signature
      // In a real implementation, you would sign a message here
      // This is a simplified version
      const message = `Authenticate for RideChain: ${new Date().toISOString()}`;
      
      // Note: In a real app, you would prompt the user to sign this message
      // and then use the resulting signature
      
      // For now, we're just setting headers without actual signing
      config.headers.address = address;
      config.headers.message = message;
      config.headers.signature = 'placeholder-signature';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Rides API
export const ridesApi = {
  // Get all rides with optional filters
  getRides: (filters = {}) => {
    return api.get('/rides', { params: filters });
  },
  
  // Get a specific ride
  getRide: (id) => {
    return api.get(`/rides/${id}`);
  },
  
  // Create a new ride
  createRide: (rideData) => {
    return api.post('/rides', rideData);
  },
  
  // Book a ride
  bookRide: (rideId, seats = 1) => {
    return api.post(`/rides/${rideId}/book`, { seats });
  }
};

// Users API
export const usersApi = {
  // Get user by wallet address
  getUserByAddress: (address) => {
    return api.get(`/users/address/${address}`);
  },
  
  // Get driver profile
  getDriverById: (id) => {
    return api.get(`/users/driver/${id}`);
  },
  
  // Update user profile
  updateProfile: (profileData) => {
    return api.post('/users/profile', profileData);
  }
};

export default {
  rides: ridesApi,
  users: usersApi
};
