import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface Driver {
  id: string;
  name: string;
  rating: number;
  avatar: string;
  address: string;
  reviewCount: number;
  bio?: string;
  carModel?: string;
  carColor?: string;
  licensePlate?: string;
  joinDate?: string;
  totalRides?: number;
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
  status: 'active' | 'in_progress' | 'completed';
  passengers?: string[];
  verified: boolean;
  paymentStatus?: 'pending' | 'completed';
  location?: {
    lat: number;
    lng: number;
  };
}

// Mock drivers data with realistic information
const mockDrivers: Driver[] = [
  {
    id: 'driver1',
    name: 'John Smith',
    rating: 4.8,
    avatar: '',
    address: 'john.smith@example.com',
    reviewCount: 47,
    bio: 'Experienced driver with 5+ years of safe driving. Love meeting new people!',
    carModel: 'Toyota Camry 2020',
    carColor: 'Silver',
    licensePlate: 'ABC-123',
    joinDate: '2022-01-15',
    totalRides: 156,
    verified: true,
  },
  {
    id: 'driver2',
    name: 'Sarah Johnson',
    rating: 4.9,
    avatar: '',
    address: 'sarah.j@example.com',
    reviewCount: 32,
    bio: 'Safe and reliable driver. Non-smoker, clean car guaranteed.',
    carModel: 'Honda Civic 2021',
    carColor: 'Blue',
    licensePlate: 'XYZ-789',
    joinDate: '2022-03-20',
    totalRides: 89,
    verified: true,
  },
];

// Mock rides data
const mockRides: Ride[] = [
  {
    id: 'ride1',
    driver: mockDrivers[0],
    departure: {
      location: 'Downtown Seattle',
      time: '2024-01-20T09:00:00Z',
    },
    destination: {
      location: 'Seattle Airport',
    },
    price: 25,
    seatsAvailable: 3,
    status: 'active',
    passengers: [],
    verified: true,
  },
  {
    id: 'ride2',
    driver: mockDrivers[1],
    departure: {
      location: 'University District',
      time: '2024-01-20T14:30:00Z',
    },
    destination: {
      location: 'Bellevue Mall',
    },
    price: 15,
    seatsAvailable: 2,
    status: 'active',
    passengers: [],
    verified: true,
  },
];

export const getRides = async (): Promise<Ride[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockRides;
};

export const getRideById = async (id: string): Promise<Ride | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockRides.find(ride => ride.id === id) || null;
};

export const createRide = async (rideData: Omit<Ride, 'id'>): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newRide: Ride = {
    ...rideData,
    id: `ride${Date.now()}`,
  };
  mockRides.push(newRide);
  return newRide.id;
};

export const bookRide = async (rideId: string, userId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const ride = mockRides.find(r => r.id === rideId);
  if (ride && ride.seatsAvailable > 0) {
    if (!ride.passengers) ride.passengers = [];
    if (!ride.passengers.includes(userId)) {
      ride.passengers.push(userId);
      ride.seatsAvailable--;
      return true;
    }
  }
  return false;
};

export const getUserRides = async (userId: string): Promise<Ride[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockRides.filter(ride => ride.passengers?.includes(userId));
};

export const getDriverById = async (driverId: string): Promise<Driver | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDrivers.find(driver => driver.id === driverId) || null;
};

export const startRide = async (rideId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const ride = mockRides.find(r => r.id === rideId);
  if (ride) {
    ride.status = 'in_progress';
    return true;
  }
  return false;
};

export const endRide = async (rideId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const ride = mockRides.find(r => r.id === rideId);
  if (ride) {
    ride.status = 'completed';
    ride.paymentStatus = 'completed';
    return true;
  }
  return false;
};

// Location tracking functions
export const updateDriverLocation = async (rideId: string, location: { lat: number; lng: number }): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const ride = mockRides.find(r => r.id === rideId);
  if (ride) {
    ride.location = location;
    return true;
  }
  return false;
};

export const subscribeToDriverLocation = (rideId: string, callback: (location: { lat: number; lng: number }) => void): () => void => {
  // Simulate real-time location updates
  const interval = setInterval(() => {
    const ride = mockRides.find(r => r.id === rideId);
    if (ride?.location) {
      // Simulate slight movement
      const newLocation = {
        lat: ride.location.lat + (Math.random() - 0.5) * 0.001,
        lng: ride.location.lng + (Math.random() - 0.5) * 0.001,
      };
      ride.location = newLocation;
      callback(newLocation);
    }
  }, 3000); // Update every 3 seconds

  return () => clearInterval(interval);
};
