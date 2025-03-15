
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, setDoc, doc, addDoc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfileData } from '@/components/profile/UserRegistrationModal';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3Cj7o-bRl-9RiT3I3GDd2V_-LmJ5E2iE",
  authDomain: "poolchain-app.firebaseapp.com",
  projectId: "poolchain-app",
  storageBucket: "poolchain-app.appspot.com",
  messagingSenderId: "912273566997",
  appId: "1:912273566997:web:cd1ec3af1a46ee5aed1a7c",
  measurementId: "G-DTE1S79QWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export interface Ride {
  id: string;
  driver: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
    address: string;
  };
  departure: {
    location: string;
    time: string;
  };
  destination: {
    location: string;
    time: string;
  };
  price: number;
  seatsAvailable: number;
  passengers?: string[];
  status: 'active' | 'completed' | 'in_progress' | 'cancelled';
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  email: string;
  phone?: string;
  walletAddress: string;
  createdAt: number;
  updatedAt: number;
  isDriver?: boolean;
  carDetails?: {
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
  };
  rating?: number;
  totalRides?: number;
}

// Helper function to migrate local storage data to Firebase
export const migrateLocalStorageToFirebase = async () => {
  try {
    const localRides = localStorage.getItem('rides');
    if (localRides) {
      const rides = JSON.parse(localRides);
      for (const ride of rides) {
        await addDoc(collection(db, 'rides'), ride);
      }
      localStorage.removeItem('rides');
      console.log('Successfully migrated rides from localStorage to Firebase');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error migrating data from localStorage:', error);
    return false;
  }
};

// Get all rides
export const getRides = async (): Promise<Ride[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'rides'));
    const rides: Ride[] = [];
    querySnapshot.forEach((doc) => {
      const rideData = doc.data() as Omit<Ride, 'id'>;
      rides.push({ id: doc.id, ...rideData });
    });
    return rides;
  } catch (error) {
    console.error('Error getting rides from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const localRides = localStorage.getItem('rides');
    return localRides ? JSON.parse(localRides) : [];
  }
};

// Get rides by user (as passenger)
export const getUserRides = async (userAddress: string): Promise<Ride[]> => {
  try {
    const q = query(collection(db, 'rides'), where('passengers', 'array-contains', userAddress));
    const querySnapshot = await getDocs(q);
    const rides: Ride[] = [];
    querySnapshot.forEach((doc) => {
      const rideData = doc.data() as Omit<Ride, 'id'>;
      rides.push({ id: doc.id, ...rideData });
    });
    return rides;
  } catch (error) {
    console.error('Error getting user rides from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const localRides = localStorage.getItem('rides');
    if (localRides) {
      const rides = JSON.parse(localRides);
      return rides.filter((ride: Ride) => ride.passengers?.includes(userAddress));
    }
    return [];
  }
};

// Get rides by driver
export const getDriverRides = async (driverAddress: string): Promise<Ride[]> => {
  try {
    const q = query(collection(db, 'rides'), where('driver.address', '==', driverAddress));
    const querySnapshot = await getDocs(q);
    const rides: Ride[] = [];
    querySnapshot.forEach((doc) => {
      const rideData = doc.data() as Omit<Ride, 'id'>;
      rides.push({ id: doc.id, ...rideData });
    });
    return rides;
  } catch (error) {
    console.error('Error getting driver rides from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const localRides = localStorage.getItem('rides');
    if (localRides) {
      const rides = JSON.parse(localRides);
      return rides.filter((ride: Ride) => ride.driver.address === driverAddress);
    }
    return [];
  }
};

// Create a new ride
export const createRide = async (ride: Omit<Ride, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'rides'), ride);
    return docRef.id;
  } catch (error) {
    console.error('Error creating ride in Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const localRides = localStorage.getItem('rides') || '[]';
    const rides = JSON.parse(localRides);
    const id = `ride-${Date.now()}`;
    const newRide = { id, ...ride };
    rides.push(newRide);
    localStorage.setItem('rides', JSON.stringify(rides));
    return id;
  }
};

// Update ride status
export const updateRideStatus = async (rideId: string, status: Ride['status']): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'rides', rideId), {
      status
    });
    return true;
  } catch (error) {
    console.error('Error updating ride status in Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const localRides = localStorage.getItem('rides');
    if (localRides) {
      const rides = JSON.parse(localRides);
      const updatedRides = rides.map((ride: Ride) => {
        if (ride.id === rideId) {
          return { ...ride, status };
        }
        return ride;
      });
      localStorage.setItem('rides', JSON.stringify(updatedRides));
      return true;
    }
    return false;
  }
};

// Book a ride (add passenger)
export const bookRide = async (rideId: string, passengerAddress: string): Promise<boolean> => {
  try {
    const rideRef = doc(db, 'rides', rideId);
    const rideSnap = await getDoc(rideRef);
    
    if (rideSnap.exists()) {
      const rideData = rideSnap.data() as Ride;
      const passengers = rideData.passengers || [];
      
      if (passengers.includes(passengerAddress)) {
        return false; // Already booked
      }
      
      passengers.push(passengerAddress);
      const seatsAvailable = rideData.seatsAvailable - 1;
      
      await updateDoc(rideRef, {
        passengers,
        seatsAvailable
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error booking ride in Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const localRides = localStorage.getItem('rides');
    if (localRides) {
      const rides = JSON.parse(localRides);
      const updatedRides = rides.map((ride: Ride) => {
        if (ride.id === rideId) {
          const passengers = ride.passengers || [];
          if (passengers.includes(passengerAddress)) {
            return ride; // Already booked
          }
          passengers.push(passengerAddress);
          return { 
            ...ride, 
            passengers,
            seatsAvailable: ride.seatsAvailable - 1
          };
        }
        return ride;
      });
      localStorage.setItem('rides', JSON.stringify(updatedRides));
      return true;
    }
    return false;
  }
};

// User Profile functions
export const createUserProfile = async (userData: UserProfileData): Promise<string> => {
  try {
    const userProfile: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      rating: 0,
      totalRides: 0,
      isDriver: false
    };
    
    await setDoc(doc(db, 'users', userData.walletAddress), userProfile);
    
    return userData.walletAddress;
  } catch (error) {
    console.error('Error creating user profile in Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const userProfile: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      rating: 0,
      totalRides: 0,
      isDriver: false
    };
    
    localStorage.setItem(`user_${userData.walletAddress}`, JSON.stringify(userProfile));
    return userData.walletAddress;
  }
};

export const getUserProfile = async (walletAddress: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', walletAddress));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const localUser = localStorage.getItem(`user_${walletAddress}`);
    return localUser ? JSON.parse(localUser) : null;
  }
};

export const updateUserProfile = async (walletAddress: string, userData: Partial<UserProfile>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', walletAddress);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile in Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const localUser = localStorage.getItem(`user_${walletAddress}`);
    if (localUser) {
      const user = JSON.parse(localUser);
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: Date.now()
      };
      localStorage.setItem(`user_${walletAddress}`, JSON.stringify(updatedUser));
      return true;
    }
    return false;
  }
};

export default {
  getRides,
  getUserRides,
  getDriverRides,
  createRide,
  updateRideStatus,
  bookRide,
  migrateLocalStorageToFirebase,
  createUserProfile,
  getUserProfile,
  updateUserProfile
};
