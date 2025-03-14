
// Simple client-side database using localStorage

// Types
export interface Driver {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  bio?: string;
  completedRides?: number;
  joinedDate?: string;
  car?: {
    model: string;
    year: string;
    color: string;
  };
  verified?: boolean;
}

export interface Ride {
  id: string;
  driver: Driver;
  departure: {
    location: string;
    time: string;
  };
  destination: {
    location: string;
  };
  price: number;
  seatsAvailable: number;
  verified: boolean;
  status?: 'active' | 'in_progress' | 'completed' | 'cancelled';
  passengers?: string[]; // Array of passenger wallet addresses
  startedAt?: string; // timestamp when ride started
  endedAt?: string; // timestamp when ride ended
  paymentStatus?: 'pending' | 'processing' | 'completed' | 'failed';
}

// Initial data
const initialDrivers: Driver[] = [
  {
    id: '1',
    name: 'John D.',
    address: '0x1234...5678',
    rating: 4.8,
    reviewCount: 56,
    bio: 'Professional driver with over 5 years of experience. I enjoy meeting new people during rides.',
    completedRides: 128,
    joinedDate: '2020-06-15',
    car: {
      model: 'Tesla Model 3',
      year: '2021',
      color: 'White'
    },
    verified: true
  },
  {
    id: '2',
    name: 'Sarah M.',
    address: '0x5678...9012',
    rating: 4.5,
    reviewCount: 32,
    bio: 'Friendly driver who loves good conversation. Music enthusiast and tech professional.',
    completedRides: 74,
    joinedDate: '2021-02-10',
    car: {
      model: 'Toyota Prius',
      year: '2020',
      color: 'Blue'
    },
    verified: true
  },
  {
    id: '3',
    name: 'Mike P.',
    address: '0x9012...3456',
    rating: 4.2,
    reviewCount: 18,
    bio: 'Part-time driver, full-time student. I drive safely and always arrive on time.',
    completedRides: 42,
    joinedDate: '2022-01-05',
    car: {
      model: 'Honda Civic',
      year: '2019',
      color: 'Silver'
    },
    verified: false
  }
];

const initialRides: Ride[] = [
  {
    id: '1',
    driver: initialDrivers[0],
    departure: {
      location: 'San Francisco, CA',
      time: '2023-08-15T15:30:00',
    },
    destination: {
      location: 'Palo Alto, CA',
    },
    price: 0.015,
    seatsAvailable: 3,
    verified: true,
    status: 'active',
    passengers: []
  },
  {
    id: '2',
    driver: initialDrivers[1],
    departure: {
      location: 'Oakland, CA',
      time: '2023-08-15T16:45:00',
    },
    destination: {
      location: 'San Jose, CA',
    },
    price: 0.025,
    seatsAvailable: 2,
    verified: true,
    status: 'active',
    passengers: []
  },
  {
    id: '3',
    driver: initialDrivers[2],
    departure: {
      location: 'Palo Alto, CA',
      time: '2023-08-15T17:15:00',
    },
    destination: {
      location: 'Mountain View, CA',
    },
    price: 0.008,
    seatsAvailable: 1,
    verified: false,
    status: 'active',
    passengers: []
  }
];

// Initialize the database with default data if empty
const initDB = () => {
  if (!localStorage.getItem('drivers')) {
    localStorage.setItem('drivers', JSON.stringify(initialDrivers));
  }
  
  if (!localStorage.getItem('rides')) {
    localStorage.setItem('rides', JSON.stringify(initialRides));
  }
  
  if (!localStorage.getItem('userRides')) {
    localStorage.setItem('userRides', JSON.stringify([]));
  }
};

// Drivers
export const getDrivers = (): Driver[] => {
  initDB();
  return JSON.parse(localStorage.getItem('drivers') || '[]');
};

export const getDriverById = (id: string): Driver | undefined => {
  const drivers = getDrivers();
  return drivers.find(driver => driver.id === id);
};

export const addDriver = (driver: Driver): Driver => {
  const drivers = getDrivers();
  
  // Check if driver already exists
  const existingDriverIndex = drivers.findIndex(d => d.id === driver.id);
  
  if (existingDriverIndex !== -1) {
    // Update existing driver
    drivers[existingDriverIndex] = driver;
  } else {
    // Add new driver
    drivers.push(driver);
  }
  
  localStorage.setItem('drivers', JSON.stringify(drivers));
  return driver;
};

// Rides
export const getRides = (): Ride[] => {
  initDB();
  return JSON.parse(localStorage.getItem('rides') || '[]');
};

export const getRideById = (id: string): Ride | undefined => {
  const rides = getRides();
  return rides.find(ride => ride.id === id);
};

export const addRide = (ride: Ride): Ride => {
  const rides = getRides();
  ride.id = (rides.length + 1).toString();
  
  // Make sure the driver exists in the drivers list
  // This is crucial for driver profile pages to work
  addDriver(ride.driver);
  
  rides.push(ride);
  localStorage.setItem('rides', JSON.stringify(rides));
  return ride;
};

export const updateRide = (updatedRide: Ride): Ride => {
  const rides = getRides();
  const index = rides.findIndex(ride => ride.id === updatedRide.id);
  
  if (index !== -1) {
    rides[index] = updatedRide;
    localStorage.setItem('rides', JSON.stringify(rides));
  }
  
  return updatedRide;
};

// New function: Start a ride
export const startRide = (rideId: string): boolean => {
  const ride = getRideById(rideId);
  if (!ride) return false;
  
  ride.status = 'in_progress';
  ride.startedAt = new Date().toISOString();
  
  updateRide(ride);
  return true;
};

// New function: End a ride
export const endRide = (rideId: string): boolean => {
  const ride = getRideById(rideId);
  if (!ride) return false;
  
  ride.status = 'completed';
  ride.endedAt = new Date().toISOString();
  ride.paymentStatus = 'pending';
  
  updateRide(ride);
  return true;
};

// New function: Process payment for a ride
export const processPayment = (rideId: string): boolean => {
  const ride = getRideById(rideId);
  if (!ride) return false;
  
  ride.paymentStatus = 'completed';
  
  updateRide(ride);
  return true;
};

export const searchRides = (criteria: {
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  seats?: number;
}): Ride[] => {
  const rides = getRides();
  
  return rides.filter(ride => {
    if (criteria.from && !ride.departure.location.toLowerCase().includes(criteria.from.toLowerCase())) {
      return false;
    }
    
    if (criteria.to && !ride.destination.location.toLowerCase().includes(criteria.to.toLowerCase())) {
      return false;
    }
    
    if (criteria.date) {
      const rideDate = new Date(ride.departure.time).toLocaleDateString();
      const searchDate = new Date(criteria.date).toLocaleDateString();
      if (rideDate !== searchDate) {
        return false;
      }
    }
    
    if (criteria.seats && ride.seatsAvailable < criteria.seats) {
      return false;
    }
    
    return true;
  });
};

// User rides (booked rides)
export const getUserRides = (userAddress: string): Ride[] => {
  initDB();
  const userRides = JSON.parse(localStorage.getItem('userRides') || '[]');
  return userRides.filter((entry: {userAddress: string, ride: Ride}) => 
    entry.userAddress === userAddress
  ).map((entry: {userAddress: string, ride: Ride}) => entry.ride);
};

export const bookRideForUser = (userAddress: string, rideId: string): boolean => {
  if (!userAddress) return false;
  
  const ride = getRideById(rideId);
  if (!ride || ride.seatsAvailable < 1) return false;
  
  // Update the ride
  ride.seatsAvailable -= 1;
  if (!ride.passengers) ride.passengers = [];
  ride.passengers.push(userAddress);
  updateRide(ride);
  
  // Add to user's booked rides
  const userRides = JSON.parse(localStorage.getItem('userRides') || '[]');
  userRides.push({
    userAddress,
    ride
  });
  localStorage.setItem('userRides', JSON.stringify(userRides));
  
  return true;
};

// Initialize database
initDB();
