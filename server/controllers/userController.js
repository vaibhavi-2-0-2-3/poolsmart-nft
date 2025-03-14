
const User = require('../models/User');
const Ride = require('../models/Ride');

// Get user profile by address
exports.getUserByAddress = async (req, res) => {
  try {
    const address = req.params.address;
    
    const user = await User.findOne({ address });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get driver profile by ID
exports.getDriverById = async (req, res) => {
  try {
    const driverId = req.params.id;
    
    const driver = await User.findById(driverId);
    
    if (!driver || !driver.isDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    // Get driver's rides
    const rides = await Ride.find({ driver: driverId })
      .sort({ 'departure.time': -1 });
    
    res.json({
      driver,
      rides
    });
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update user profile
exports.upsertUser = async (req, res) => {
  try {
    const { address } = req.user;
    const { name, isDriver } = req.body;
    
    // Find user or create new one
    let user = await User.findOne({ address });
    
    if (!user) {
      user = new User({
        address,
        name: name || '',
        isDriver: isDriver || false
      });
    } else {
      // Update existing user
      if (name) user.name = name;
      if (typeof isDriver !== 'undefined') user.isDriver = isDriver;
    }
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
