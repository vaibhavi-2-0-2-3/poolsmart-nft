
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, addDoc, deleteDoc } from 'firebase/firestore';
import { Driver, Ride } from './db';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1fYHiR6NShjXw-4Sk8FOEqEeXwraWwQk",
  authDomain: "rideshare-dapp.firebaseapp.com",
  projectId: "rideshare-dapp",
  storageBucket: "rideshare-dapp.appspot.com",
  messagingSenderId: "385776294568",
  appId: "1:385776294568:web:8f55d0b5e5b2d5b1f0b5e5",
  measurementId: "G-5X5X5X5X5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize the database with default data if empty
export const initDB = async () => {
  const driversRef = collection(db, 'drivers');
  const driversSnapshot = await getDocs(driversRef);
  
  if (driversSnapshot.empty) {
    // Get initial drivers from localStorage as a fallback
    const localDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    
    // Add each driver to Firebase
    for (const driver of localDrivers) {
      await setDoc(doc(driversRef, driver.id), driver);
    }
  }
  
  const ridesRef = collection(db, 'rides');
  const ridesSnapshot = await getDocs(ridesRef);
  
  if (ridesSnapshot.empty) {
    // Get initial rides from localStorage as a fallback
    const localRides = JSON.parse(localStorage.getItem('rides') || '[]');
    
    // Add each ride to Firebase
    for (const ride of localRides) {
      await setDoc(doc(ridesRef, ride.id), ride);
    }
  }
  
  if (!localStorage.getItem('migratedToFirebase')) {
    localStorage.setItem('migratedToFirebase', 'true');
  }
};

// Drivers
export const getDrivers = async (): Promise<Driver[]> => {
  try {
    const driversRef = collection(db, 'drivers');
    const driversSnapshot = await getDocs(driversRef);
    return driversSnapshot.docs.map(doc => doc.data() as Driver);
  } catch (error) {
    console.error('Error getting drivers from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    return JSON.parse(localStorage.getItem('drivers') || '[]');
  }
};

export const getDriverById = async (id: string): Promise<Driver | undefined> => {
  try {
    const driverRef = doc(db, 'drivers', id);
    const driverSnapshot = await getDoc(driverRef);
    
    if (driverSnapshot.exists()) {
      return driverSnapshot.data() as Driver;
    }
    return undefined;
  } catch (error) {
    console.error('Error getting driver from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    return drivers.find((driver: Driver) => driver.id === id);
  }
};

export const addDriver = async (driver: Driver): Promise<Driver> => {
  try {
    const driversRef = collection(db, 'drivers');
    await setDoc(doc(driversRef, driver.id), driver);
    return driver;
  } catch (error) {
    console.error('Error adding driver to Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    const existingDriverIndex = drivers.findIndex((d: Driver) => d.id === driver.id);
    
    if (existingDriverIndex !== -1) {
      drivers[existingDriverIndex] = driver;
    } else {
      drivers.push(driver);
    }
    
    localStorage.setItem('drivers', JSON.stringify(drivers));
    return driver;
  }
};

// Rides
export const getRides = async (): Promise<Ride[]> => {
  try {
    const ridesRef = collection(db, 'rides');
    const ridesSnapshot = await getDocs(ridesRef);
    return ridesSnapshot.docs.map(doc => doc.data() as Ride);
  } catch (error) {
    console.error('Error getting rides from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    return JSON.parse(localStorage.getItem('rides') || '[]');
  }
};

export const getRideById = async (id: string): Promise<Ride | undefined> => {
  try {
    const rideRef = doc(db, 'rides', id);
    const rideSnapshot = await getDoc(rideRef);
    
    if (rideSnapshot.exists()) {
      return rideSnapshot.data() as Ride;
    }
    return undefined;
  } catch (error) {
    console.error('Error getting ride from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const rides = JSON.parse(localStorage.getItem('rides') || '[]');
    return rides.find((ride: Ride) => ride.id === id);
  }
};

export const addRide = async (ride: Ride): Promise<Ride> => {
  try {
    if (!ride.id) {
      const ridesRef = collection(db, 'rides');
      const ridesSnapshot = await getDocs(ridesRef);
      ride.id = (ridesSnapshot.size + 1).toString();
    }
    
    // Make sure the driver exists in the drivers collection
    await addDriver(ride.driver);
    
    const ridesRef = collection(db, 'rides');
    await setDoc(doc(ridesRef, ride.id), ride);
    return ride;
  } catch (error) {
    console.error('Error adding ride to Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const rides = JSON.parse(localStorage.getItem('rides') || '[]');
    ride.id = (rides.length + 1).toString();
    
    rides.push(ride);
    localStorage.setItem('rides', JSON.stringify(rides));
    return ride;
  }
};

export const updateRide = async (updatedRide: Ride): Promise<Ride> => {
  try {
    const rideRef = doc(db, 'rides', updatedRide.id);
    await updateDoc(rideRef, updatedRide as any);
    return updatedRide;
  } catch (error) {
    console.error('Error updating ride in Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const rides = JSON.parse(localStorage.getItem('rides') || '[]');
    const index = rides.findIndex((ride: Ride) => ride.id === updatedRide.id);
    
    if (index !== -1) {
      rides[index] = updatedRide;
      localStorage.setItem('rides', JSON.stringify(rides));
    }
    
    return updatedRide;
  }
};

// Ride status management functions
export const startRide = async (rideId: string): Promise<boolean> => {
  try {
    const ride = await getRideById(rideId);
    if (!ride) return false;
    
    ride.status = 'in_progress';
    ride.startedAt = new Date().toISOString();
    
    await updateRide(ride);
    return true;
  } catch (error) {
    console.error('Error starting ride in Firebase:', error);
    return false;
  }
};

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
    console.error('Error ending ride in Firebase:', error);
    return false;
  }
};

export const processPayment = async (rideId: string): Promise<boolean> => {
  try {
    const ride = await getRideById(rideId);
    if (!ride) return false;
    
    ride.paymentStatus = 'completed';
    
    await updateRide(ride);
    return true;
  } catch (error) {
    console.error('Error processing payment in Firebase:', error);
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
  try {
    let rides = await getRides();
    
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
  } catch (error) {
    console.error('Error searching rides in Firebase:', error);
    // Fallback to localStorage if Firebase fails
    return JSON.parse(localStorage.getItem('rides') || '[]');
  }
};

// User rides (booked rides)
export const getUserRides = async (userAddress: string): Promise<Ride[]> => {
  try {
    const ridesRef = collection(db, 'rides');
    const q = query(ridesRef, where('passengers', 'array-contains', userAddress));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Ride);
  } catch (error) {
    console.error('Error getting user rides from Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const userRides = JSON.parse(localStorage.getItem('userRides') || '[]');
    return userRides
      .filter((entry: {userAddress: string, ride: Ride}) => entry.userAddress === userAddress)
      .map((entry: {userAddress: string, ride: Ride}) => entry.ride);
  }
};

// New structure for userRides in Firebase
export type UserRide = {
  id: string;
  userAddress: string;
  rideId: string;
  timestamp: string;
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
    
    // Add to user's booked rides collection
    const userRidesRef = collection(db, 'userRides');
    await addDoc(userRidesRef, {
      userAddress,
      rideId,
      timestamp: new Date().toISOString()
    } as UserRide);
    
    return true;
  } catch (error) {
    console.error('Error booking ride in Firebase:', error);
    // Fallback to localStorage if Firebase fails
    const ride = JSON.parse(localStorage.getItem('rides') || '[]')
      .find((r: Ride) => r.id === rideId);
    
    if (!ride || ride.seatsAvailable < 1) return false;
    
    // Update the ride
    ride.seatsAvailable -= 1;
    if (!ride.passengers) ride.passengers = [];
    ride.passengers.push(userAddress);
    
    // Update rides in localStorage
    const rides = JSON.parse(localStorage.getItem('rides') || '[]');
    const index = rides.findIndex((r: Ride) => r.id === rideId);
    if (index !== -1) {
      rides[index] = ride;
      localStorage.setItem('rides', JSON.stringify(rides));
    }
    
    // Add to user's booked rides
    const userRides = JSON.parse(localStorage.getItem('userRides') || '[]');
    userRides.push({
      userAddress,
      ride
    });
    localStorage.setItem('userRides', JSON.stringify(userRides));
    
    return true;
  }
};

// Initialize Firebase on app load
initDB().catch(console.error);

// Export the Firebase specific functions
export { db };
