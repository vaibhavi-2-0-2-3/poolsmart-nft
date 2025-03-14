
const Ride = require('../models/Ride');
const User = require('../models/User');

// Get all rides with optional filtering
exports.getRides = async (req, res) => {
  try {
    const { 
      from, 
      to, 
      date, 
      seats, 
      minPrice, 
      maxPrice, 
      sortBy, 
      sortOrder, 
      verifiedOnly 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (from) {
      filter['departure.location'] = { $regex: from, $options: 'i' };
    }
    
    if (to) {
      filter['destination.location'] = { $regex: to, $options: 'i' };
    }
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      filter['departure.time'] = { $gte: startDate, $lte: endDate };
    }
    
    if (seats) {
      filter.seatsAvailable = { $gte: parseInt(seats) };
    }
    
    if (minPrice) {
      filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    }
    
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    }
    
    if (verifiedOnly === 'true') {
      // We need to find drivers who are verified
      const verifiedDrivers = await User.find({ isDriver: true, isVerified: true });
      const verifiedDriverIds = verifiedDrivers.map(driver => driver._id);
      filter.driver = { $in: verifiedDriverIds };
    }
    
    // Build sort object
    const sort = {};
    
    if (sortBy) {
      switch (sortBy) {
        case 'price':
          sort.price = sortOrder === 'desc' ? -1 : 1;
          break;
        case 'date':
          sort['departure.time'] = sortOrder === 'desc' ? -1 : 1;
          break;
        case 'rating':
          // Since rating is not directly on the ride, we'll handle this in memory after fetching
          break;
        default:
          sort.createdAt = -1; // Default sort by newest
      }
    } else {
      sort.createdAt = -1; // Default sort by newest
    }
    
    // Find rides with populate to get driver details
    let rides = await Ride.find(filter)
      .populate('driver', 'name rating isVerified address')
      .sort(sort)
      .exec();
    
    // If sorting by rating, we need to do it in memory
    if (sortBy === 'rating') {
      rides.sort((a, b) => {
        const ratingA = a.driver.rating || 0;
        const ratingB = b.driver.rating || 0;
        return sortOrder === 'desc' ? ratingB - ratingA : ratingA - ratingB;
      });
    }
    
    res.json(rides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific ride
exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name rating isVerified address')
      .populate('passengers.user', 'name address');
      
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    res.json(ride);
  } catch (error) {
    console.error('Error fetching ride:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new ride
exports.createRide = async (req, res) => {
  try {
    const { 
      departure, 
      destination, 
      price, 
      seatsTotal 
    } = req.body;
    
    // Check if user exists and is a driver
    const user = await User.findOne({ address: req.user.address });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create the ride
    const newRide = new Ride({
      driver: user._id,
      departure,
      destination,
      price,
      seatsTotal,
      seatsAvailable: seatsTotal
    });
    
    const savedRide = await newRide.save();
    
    // Add ride to user's rides
    user.rides.push(savedRide._id);
    await user.save();
    
    // Populate driver info for response
    const populatedRide = await Ride.findById(savedRide._id)
      .populate('driver', 'name rating isVerified address');
    
    res.status(201).json(populatedRide);
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Book a ride
exports.bookRide = async (req, res) => {
  try {
    const { seats = 1 } = req.body;
    const rideId = req.params.id;
    
    // Find ride and check if seats are available
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.seatsAvailable < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }
    
    // Find user
    const user = await User.findOne({ address: req.user.address });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is not booking their own ride
    if (ride.driver.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'Cannot book your own ride' });
    }
    
    // Update ride
    ride.passengers.push({ user: user._id, seats });
    ride.seatsAvailable -= seats;
    await ride.save();
    
    // Add booking to user
    user.bookings.push(ride._id);
    await user.save();
    
    res.json({ message: 'Ride booked successfully', ride });
  } catch (error) {
    console.error('Error booking ride:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
