
// Firebase implementation for database operations
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

// Initial data setup function - call this once to populate the database
export const setupInitialData = async () => {
  const driversRef = collection(db, 'drivers');
  const driversSnapshot = await getDocs(driversRef);
  
  // Only populate if drivers collection is empty
  if (driversSnapshot.empty) {
    for (const driver of initialDrivers) {
      await setDoc(doc(driversRef, driver.id), driver);
    }
  }
  
  const ridesRef = collection(db, 'rides');
  const ridesSnapshot = await getDocs(ridesRef);
  
  // Only populate if rides collection is empty
  if (ridesSnapshot.empty) {
    for (const ride of initialRides) {
      await setDoc(doc(ridesRef, ride.id), ride);
    }
  }
};

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

// Call this function when your app initializes
export const initDB = async () => {
  try {
    await setupInitialData();
    console.log('Firebase initialized with initial data if needed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Drivers
export const getDrivers = async (): Promise<Driver[]> => {
  const driversRef = collection(db, 'drivers');
  const snapshot = await getDocs(driversRef);
  return snapshot.docs.map(doc => doc.data() as Driver);
};

export const getDriverById = async (id: string): Promise<Driver | undefined> => {
  const driverRef = doc(db, 'drivers', id);
  const driverDoc = await getDoc(driverRef);
  
  if (driverDoc.exists()) {
    return driverDoc.data() as Driver;
  }
  
  return undefined;
};

export const addDriver = async (driver: Driver): Promise<Driver> => {
  const driverRef = doc(db, 'drivers', driver.id);
  await setDoc(driverRef, driver);
  return driver;
};

// Rides
export const getRides = async (): Promise<Ride[]> => {
  const ridesRef = collection(db, 'rides');
  const snapshot = await getDocs(ridesRef);
  return snapshot.docs.map(doc => doc.data() as Ride);
};

export const getRideById = async (id: string): Promise<Ride | undefined> => {
  const rideRef = doc(db, 'rides', id);
  const rideDoc = await getDoc(rideRef);
  
  if (rideDoc.exists()) {
    return rideDoc.data() as Ride;
  }
  
  return undefined;
};

export const addRide = async (ride: Ride): Promise<Ride> => {
  // If no ID is provided, generate one
  if (!ride.id) {
    const ridesRef = collection(db, 'rides');
    const newRideRef = await addDoc(ridesRef, ride);
    ride.id = newRideRef.id;
    await updateDoc(newRideRef, { id: newRideRef.id });
  } else {
    // If ID is provided, use it
    const rideRef = doc(db, 'rides', ride.id);
    await setDoc(rideRef, ride);
  }
  
  // Make sure to add or update the driver as well
  await addDriver(ride.driver);
  
  return ride;
};

export const updateRide = async (updatedRide: Ride): Promise<Ride> => {
  const rideRef = doc(db, 'rides', updatedRide.id);
  await updateDoc(rideRef, { ...updatedRide });
  return updatedRide;
};

// Start a ride
export const startRide = async (rideId: string): Promise<boolean> => {
  try {
    const ride = await getRideById(rideId);
    if (!ride) return false;
    
    ride.status = 'in_progress';
    ride.startedAt = new Date().toISOString();
    
    await updateRide(ride);
    return true;
  } catch (error) {
    console.error('Error starting ride:', error);
    return false;
  }
};

// End a ride
export const endRide = async (rideId: string): Promise<boolean> => {
  try {
    const ride = await getRideById(rideId);
    if (!ride) return false;
    
    ride.status = 'completed';
    ride.endedAt = new Date().toISOString();
    ride.paymentStatus = 'pending';
    
    await updateRide(ride);
    return true;
  } catch (error) {
    console.error('Error ending ride:', error);
    return false;
  }
};

// Process payment for a ride
export const processPayment = async (rideId: string): Promise<boolean> => {
  try {
    const ride = await getRideById(rideId);
    if (!ride) return false;
    
    ride.paymentStatus = 'completed';
    
    await updateRide(ride);
    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    return false;
  }
};

export const searchRides = async (criteria: {
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  seats?: number;
}): Promise<Ride[]> => {
  const ridesRef = collection(db, 'rides');
  let rides = await getDocs(ridesRef);
  
  let filteredRides = rides.docs.map(doc => doc.data() as Ride);
  
  // Apply filters in JavaScript since Firestore doesn't support complex queries easily
  if (criteria.from) {
    filteredRides = filteredRides.filter(ride => 
      ride.departure.location.toLowerCase().includes(criteria.from!.toLowerCase())
    );
  }
  
  if (criteria.to) {
    filteredRides = filteredRides.filter(ride => 
      ride.destination.location.toLowerCase().includes(criteria.to!.toLowerCase())
    );
  }
  
  if (criteria.date) {
    filteredRides = filteredRides.filter(ride => {
      const rideDate = new Date(ride.departure.time).toLocaleDateString();
      const searchDate = new Date(criteria.date!).toLocaleDateString();
      return rideDate === searchDate;
    });
  }
  
  if (criteria.seats) {
    filteredRides = filteredRides.filter(ride => 
      ride.seatsAvailable >= criteria.seats!
    );
  }
  
  return filteredRides;
};

// User rides (booked rides)
export const getUserRides = async (userAddress: string): Promise<Ride[]> => {
  try {
    const userRidesRef = collection(db, 'userRides');
    const q = query(userRidesRef, where('userAddress', '==', userAddress));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      
      // Handle Firestore timestamps if present
      if (data.ride && data.ride.departure && data.ride.departure.time && typeof data.ride.departure.time.toDate === 'function') {
        data.ride.departure.time = data.ride.departure.time.toDate().toISOString();
      }
      
      if (data.ride && data.ride.startedAt && typeof data.ride.startedAt.toDate === 'function') {
        data.ride.startedAt = data.ride.startedAt.toDate().toISOString();
      }
      
      if (data.ride && data.ride.endedAt && typeof data.ride.endedAt.toDate === 'function') {
        data.ride.endedAt = data.ride.endedAt.toDate().toISOString();
      }
      
      return data.ride as Ride;
    });
  } catch (error) {
    console.error('Error getting user rides:', error);
    return [];
  }
};

export const bookRideForUser = async (userAddress: string, rideId: string): Promise<boolean> => {
  try {
    if (!userAddress) return false;
    
    const ride = await getRideById(rideId);
    if (!ride || ride.seatsAvailable < 1) return false;
    
    // Update the ride
    ride.seatsAvailable -= 1;
    if (!ride.passengers) ride.passengers = [];
    ride.passengers.push(userAddress);
    await updateRide(ride);
    
    // Add to user's booked rides
    const userRidesRef = collection(db, 'userRides');
    await addDoc(userRidesRef, {
      userAddress,
      ride
    });
    
    return true;
  } catch (error) {
    console.error('Error booking ride:', error);
    return false;
  }
};

// Initialize the database when the app starts
initDB();
