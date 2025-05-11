import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserProfileData } from "@/components/profile/UserRegistrationModal";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs6DkE5CSaZc2JzLfQ-rIqbQmSklOWZsE",
  authDomain: "smart-pool-76570.firebaseapp.com",
  projectId: "smart-pool-76570",
  storageBucket: "smart-pool-76570.firebasestorage.app",
  messagingSenderId: "1080744358458",
  appId: "1:1080744358458:web:733e71831b3cbe519a7b03",
  measurementId: "G-TJXQ2E9EEG",
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
    reviewCount?: number; // Add reviewCount to match db.ts Driver interface
  };
  departure: {
    location: string;
    time: string;
  };
  destination: {
    location: string;
    time?: string;
  };
  price: number;
  seatsAvailable: number;
  passengers?: string[];
  status: "active" | "completed" | "in_progress" | "cancelled";
  paymentStatus?: "pending" | "processing" | "completed" | "failed";
  startedAt?: string;
  endedAt?: string;
  verified: boolean; // Changed from optional to required to match db.ts
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
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

export interface Driver {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  completedRides: number;
  joinedDate: string;
  verified: boolean;
  address: string;
  car?: {
    model: string;
    year: string;
    color: string;
    licensePlate?: string;
  };
}

export const migrateLocalStorageToFirebase = async () => {
  try {
    const localRides = localStorage.getItem("rides");
    if (localRides) {
      const rides = JSON.parse(localRides);
      for (const ride of rides) {
        await addDoc(collection(db, "rides"), ride);
      }
      localStorage.removeItem("rides");
      console.log("Successfully migrated rides from localStorage to Firebase");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error migrating data from localStorage:", error);
    return false;
  }
};

export const getRides = async (): Promise<Ride[]> => {
  try {
    console.log("Fetching rides from Firestore collection");
    const ridesCollection = collection(db, "rides");
    const querySnapshot = await getDocs(ridesCollection);

    console.log(`Found ${querySnapshot.size} rides in Firestore`);

    const rides: Ride[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Processing ride document ${doc.id}:`, data);

      // Make sure we have a properly structured ride object with all required fields
      const rideData = {
        ...data,
        id: doc.id,
        verified: true,
        // Ensure driver has reviewCount property
        driver: {
          ...(data.driver || {}),
          reviewCount: data.driver?.reviewCount || 0
        },
        // Ensure departure property
        departure: {
          ...(data.departure || {}),
          location: data.departure?.location || '',
          time: data.departure?.time || new Date().toISOString()
        },
        // Ensure destination property
        destination: {
          ...(data.destination || {}),
          location: data.destination?.location || ''
        },
        // Ensure other required properties
        price: data.price || 0,
        seatsAvailable: data.seatsAvailable || 0,
        status: data.status || 'active'
      };

      // Convert any Timestamp objects to strings
      if (rideData.departure && rideData.departure.time instanceof Timestamp) {
        rideData.departure.time = rideData.departure.time
          .toDate()
          .toISOString();
      }

      if (
        rideData.destination &&
        rideData.destination.time instanceof Timestamp
      ) {
        rideData.destination.time = rideData.destination.time
          .toDate()
          .toISOString();
      }

      rides.push(rideData as Ride);
    });

    console.log("Processed rides:", JSON.stringify(rides));
    return rides;
  } catch (error) {
    console.error("Error getting rides from Firebase:", error);
    // Fallback to localStorage
    const localRides = localStorage.getItem("rides");
    return localRides ? JSON.parse(localRides) : [];
  }
};

export const getUserRides = async (userAddress: string): Promise<Ride[]> => {
  try {
    const q = query(
      collection(db, "rides"),
      where("passengers", "array-contains", userAddress)
    );
    const querySnapshot = await getDocs(q);
    const rides: Ride[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure we have a complete ride object with all required fields
      const rideData = {
        ...data,
        id: doc.id,
        verified: true,
        driver: {
          ...(data.driver || {}),
          reviewCount: data.driver?.reviewCount || 0
        },
        departure: {
          ...(data.departure || {}),
          location: data.departure?.location || '',
          time: data.departure?.time || new Date().toISOString()
        },
        destination: {
          ...(data.destination || {}),
          location: data.destination?.location || ''
        },
        price: data.price || 0,
        seatsAvailable: data.seatsAvailable || 0,
        status: data.status || 'active'
      };
      rides.push(rideData as Ride);
    });
    return rides;
  } catch (error) {
    console.error("Error getting user rides from Firebase:", error);
    const localRides = localStorage.getItem("rides");
    if (localRides) {
      const rides = JSON.parse(localRides);
      return rides.filter((ride: Ride) =>
        ride.passengers?.includes(userAddress)
      );
    }
    return [];
  }
};

export const getDriverRides = async (
  driverAddress: string
): Promise<Ride[]> => {
  try {
    const q = query(
      collection(db, "rides"),
      where("driver.address", "==", driverAddress)
    );
    const querySnapshot = await getDocs(q);
    const rides: Ride[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure we have a complete ride object with all required fields
      const rideData = {
        ...data,
        id: doc.id,
        verified: true,
        driver: {
          ...(data.driver || {}),
          reviewCount: data.driver?.reviewCount || 0
        },
        departure: {
          ...(data.departure || {}),
          location: data.departure?.location || '',
          time: data.departure?.time || new Date().toISOString()
        },
        destination: {
          ...(data.destination || {}),
          location: data.destination?.location || ''
        },
        price: data.price || 0,
        seatsAvailable: data.seatsAvailable || 0,
        status: data.status || 'active'
      };
      rides.push(rideData as Ride);
    });
    return rides;
  } catch (error) {
    console.error("Error getting driver rides from Firebase:", error);
    const localRides = localStorage.getItem("rides");
    if (localRides) {
      const rides = JSON.parse(localRides);
      return rides.filter(
        (ride: Ride) => ride.driver.address === driverAddress
      );
    }
    return [];
  }
};

export const createRide = async (ride: Omit<Ride, "id">): Promise<string> => {
  try {
    console.log("==== CREATING RIDE IN FIREBASE ====");
    console.log("Input ride data:", JSON.stringify(ride));

    // Validate required fields
    if (
      !ride.driver ||
      !ride.departure ||
      !ride.destination ||
      ride.price === undefined
    ) {
      console.error("Missing required ride fields:", ride);
      throw new Error("Missing required ride fields in createRide");
    }

    // Format the time string properly if needed
    let departureTime = ride.departure.time;
    if (
      typeof departureTime === "string" &&
      !isNaN(Date.parse(departureTime))
    ) {
      departureTime = new Date(departureTime).toISOString();
    }

    // Create a properly formatted ride object
    const rideToSave = {
      driver: {
        id: ride.driver.id || `driver-${Date.now()}`,
        name: ride.driver.name || "Anonymous Driver",
        rating: ride.driver.rating || 0,
        address: ride.driver.address,
        avatar: ride.driver.avatar,
        reviewCount: ride.driver.reviewCount || 0, // Add reviewCount
      },
      departure: {
        location: ride.departure.location,
        time: departureTime,
      },
      destination: {
        location: ride.destination.location,
        time: ride.destination.time || null,
      },
      price: Number(ride.price),
      seatsAvailable: Number(ride.seatsAvailable || 1),
      status: ride.status || "active",
      passengers: ride.passengers || [],
      verified: true,
      createdAt: serverTimestamp(),
    };

    console.log(
      "Formatted ride object for Firestore:",
      JSON.stringify(rideToSave)
    );

    // Add the document to Firestore
    const ridesCollection = collection(db, "rides");
    const docRef = await addDoc(ridesCollection, rideToSave);

    console.log("Successfully created ride with ID:", docRef.id);

    // Verify the ride was created by fetching it back
    const rideDoc = await getDoc(docRef);
    if (!rideDoc.exists()) {
      throw new Error("Ride document was not created successfully");
    }

    // Also save to localStorage as backup
    const localRides = localStorage.getItem("rides") || "[]";
    const rides = JSON.parse(localRides);
    const newRide = { id: docRef.id, ...rideToSave };
    rides.push(newRide);
    localStorage.setItem("rides", JSON.stringify(rides));

    return docRef.id;
  } catch (error) {
    console.error("Error creating ride in Firebase:", error);

    // Fallback to localStorage if Firebase fails
    const localRides = localStorage.getItem("rides") || "[]";
    const rides = JSON.parse(localRides);
    const id = `ride-${Date.now()}`;
    const newRide = { 
      id, 
      ...ride,
      verified: true 
    };
    rides.push(newRide);
    localStorage.setItem("rides", JSON.stringify(rides));
    console.log("Fallback: Created ride in localStorage with ID:", id);
    return id;
  }
};

export const updateRideStatus = async (
  rideId: string,
  status: Ride["status"]
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, "rides", rideId), {
      status,
    });
    return true;
  } catch (error) {
    console.error("Error updating ride status in Firebase:", error);
    const localRides = localStorage.getItem("rides");
    if (localRides) {
      const rides = JSON.parse(localRides);
      const updatedRides = rides.map((ride: Ride) => {
        if (ride.id === rideId) {
          return { ...ride, status };
        }
        return ride;
      });
      localStorage.setItem("rides", JSON.stringify(updatedRides));
      return true;
    }
    return false;
  }
};

export const bookRide = async (
  rideId: string,
  passengerAddress: string
): Promise<boolean> => {
  try {
    const rideRef = doc(db, "rides", rideId);
    const rideSnap = await getDoc(rideRef);

    if (rideSnap.exists()) {
      const rideData = rideSnap.data() as Ride;
      const passengers = rideData.passengers || [];

      if (passengers.includes(passengerAddress)) {
        return false; // Already booked
      }

      if (rideData.seatsAvailable <= 0) {
        return false; // No seats available
      }

      passengers.push(passengerAddress);
      const seatsAvailable = rideData.seatsAvailable - 1;

      await updateDoc(rideRef, {
        passengers,
        seatsAvailable,
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error booking ride in Firebase:", error);
    const localRides = localStorage.getItem("rides");
    if (localRides) {
      const rides = JSON.parse(localRides);
      const updatedRides = rides.map((ride: Ride) => {
        if (ride.id === rideId) {
          const passengers = ride.passengers || [];
          if (passengers.includes(passengerAddress)) {
            return ride; // Already booked
          }
          
          if (ride.seatsAvailable <= 0) {
            return ride; // No seats available
          }
          
          passengers.push(passengerAddress);
          return {
            ...ride,
            passengers,
            seatsAvailable: ride.seatsAvailable - 1,
          };
        }
        return ride;
      });
      localStorage.setItem("rides", JSON.stringify(updatedRides));
      return true;
    }
    return false;
  }
};

export const startRide = async (rideId: string): Promise<boolean> => {
  try {
    const rideRef = doc(db, "rides", rideId);

    await updateDoc(rideRef, {
      status: "in_progress",
      startedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("Error starting ride in Firebase:", error);
    const localRides = localStorage.getItem("rides");
    if (localRides) {
      const rides = JSON.parse(localRides);
      const updatedRides = rides.map((ride: Ride) => {
        if (ride.id === rideId) {
          return {
            ...ride,
            status: "in_progress",
            startedAt: new Date().toISOString(),
          };
        }
        return ride;
      });
      localStorage.setItem("rides", JSON.stringify(updatedRides));
      return true;
    }
    return false;
  }
};

export const endRide = async (rideId: string): Promise<boolean> => {
  try {
    const rideRef = doc(db, "rides", rideId);

    await updateDoc(rideRef, {
      status: "completed",
      endedAt: new Date().toISOString(),
      paymentStatus: "pending",
    });

    return true;
  } catch (error) {
    console.error("Error ending ride in Firebase:", error);
    const localRides = localStorage.getItem("rides");
    if (localRides) {
      const rides = JSON.parse(localRides);
      const updatedRides = rides.map((ride: Ride) => {
        if (ride.id === rideId) {
          return {
            ...ride,
            status: "completed",
            endedAt: new Date().toISOString(),
            paymentStatus: "pending",
          };
        }
        return ride;
      });
      localStorage.setItem("rides", JSON.stringify(updatedRides));
      return true;
    }
    return false;
  }
};

export const processPayment = async (rideId: string): Promise<boolean> => {
  try {
    const rideRef = doc(db, "rides", rideId);

    await updateDoc(rideRef, {
      paymentStatus: "completed",
    });

    return true;
  } catch (error) {
    console.error("Error processing payment in Firebase:", error);
    const localRides = localStorage.getItem("rides");
    if (localRides) {
      const rides = JSON.parse(localRides);
      const updatedRides = rides.map((ride: Ride) => {
        if (ride.id === rideId) {
          return {
            ...ride,
            paymentStatus: "completed",
          };
        }
        return ride;
      });
      localStorage.setItem("rides", JSON.stringify(updatedRides));
      return true;
    }
    return false;
  }
};

export const createUserProfile = async (
  userData: UserProfileData
): Promise<string> => {
  try {
    const userProfile: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      rating: 0,
      totalRides: 0,
      isDriver: false,
    };

    await setDoc(doc(db, "users", userData.walletAddress), userProfile);

    return userData.walletAddress;
  } catch (error) {
    console.error("Error creating user profile in Firebase:", error);
    const userProfile: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      rating: 0,
      totalRides: 0,
      isDriver: false,
    };

    localStorage.setItem(
      `user_${userData.walletAddress}`,
      JSON.stringify(userProfile)
    );
    return userData.walletAddress;
  }
};

export const getUserProfile = async (
  walletAddress: string
): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", walletAddress));

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile from Firebase:", error);
    const localUser = localStorage.getItem(`user_${walletAddress}`);
    return localUser ? JSON.parse(localUser) : null;
  }
};

export const updateUserProfile = async (
  walletAddress: string,
  userData: Partial<UserProfile>
): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", walletAddress);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile in Firebase:", error);
    const localUser = localStorage.getItem(`user_${walletAddress}`);
    if (localUser) {
      const user = JSON.parse(localUser);
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: Date.now(),
      };
      localStorage.setItem(
        `user_${walletAddress}`,
        JSON.stringify(updatedUser)
      );
      return true;
    }
    return false;
  }
};

export const getDriverById = async (driverId: string): Promise<Driver | null> => {
  try {
    // First check if it's a user profile with isDriver=true
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("id", "==", driverId));
    const userQuerySnapshot = await getDocs(userQuery);
    
    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data() as UserProfile;
      
      if (userData.isDriver) {
        // Convert UserProfile to Driver
        return {
          id: userData.id,
          name: userData.fullName || userData.username,
          bio: userData.bio || '',
          avatar: userData.avatar,
          rating: userData.rating || 4.5,
          reviewCount: 5, // Default value
          completedRides: userData.totalRides || 0,
          joinedDate: new Date(userData.createdAt).toISOString(),
          verified: true,
          address: userData.walletAddress,
          car: userData.carDetails || undefined,
        };
      }
    }
    
    // If not found in users, check drivers collection or use mock data
    const driverRef = doc(db, "drivers", driverId);
    const driverSnap = await getDoc(driverRef);
    
    if (driverSnap.exists()) {
      return driverSnap.data() as Driver;
    }
    
    // Fallback to mock data
    return getMockDriverById(driverId);
    
  } catch (error) {
    console.error("Error getting driver from Firebase:", error);
    
    // Fallback to mock data
    return getMockDriverById(driverId);
  }
};

// Mock data for development
const getMockDriverById = (driverId: string): Driver => {
  // Create some mock driver data based on the ID
  const idNumber = parseInt(driverId.replace(/\D/g, '')) || 1;
  
  return {
    id: driverId,
    name: `Driver ${idNumber}`,
    bio: "Experienced driver with a focus on safety and comfort. I enjoy meeting new people and making your journey pleasant.",
    rating: 4.5 + (idNumber % 10) / 20,
    reviewCount: 5 + idNumber,
    completedRides: 10 + idNumber * 2,
    joinedDate: new Date(2023, 0, idNumber).toISOString(),
    verified: true,
    address: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    car: {
      model: ["Toyota Camry", "Honda Accord", "Tesla Model 3", "Ford Fusion", "Nissan Altima"][idNumber % 5],
      year: `${2018 + idNumber % 5}`,
      color: ["White", "Black", "Silver", "Blue", "Red"][idNumber % 5],
      licensePlate: `ABC${1000 + idNumber}`,
    },
  };
};

export { addDoc as addRide };

export const updateDriverLocation = async (
  rideId: string,
  latitude: number,
  longitude: number
): Promise<boolean> => {
  try {
    const rideRef = doc(db, "rides", rideId);
    
    await updateDoc(rideRef, {
      currentLocation: {
        lat: latitude,
        lng: longitude,
        updatedAt: new Date().toISOString()
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error updating driver location in Firebase:", error);
    
    // Fallback to localStorage
    const localRides = localStorage.getItem("rides");
    if (localRides) {
      const rides = JSON.parse(localRides);
      const updatedRides = rides.map((ride: Ride) => {
        if (ride.id === rideId) {
          return {
            ...ride,
            currentLocation: {
              lat: latitude,
              lng: longitude,
              updatedAt: new Date().toISOString()
            }
          };
        }
        return ride;
      });
      localStorage.setItem("rides", JSON.stringify(updatedRides));
      return true;
    }
    return false;
  }
};

export const subscribeToDriverLocation = (
  rideId: string,
  callback: (location: { lat: number; lng: number; updatedAt: string } | null) => void
): (() => void) => {
  try {
    const rideRef = doc(db, "rides", rideId);
    
    // Set up Firebase listener
    const unsubscribe = onSnapshot(rideRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as Ride;
        if (data.currentLocation) {
          callback(data.currentLocation);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    }, (error) => {
      console.error("Error listening for location updates:", error);
      callback(null);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up location subscription:", error);
    
    // Mock implementation for demo purposes
    const interval = setInterval(() => {
      // Get from localStorage or generate random location near NYC
      const mockLat = 40.7128 + (Math.random() * 0.02 - 0.01);
      const mockLng = -74.0060 + (Math.random() * 0.02 - 0.01);
      
      callback({
        lat: mockLat,
        lng: mockLng,
        updatedAt: new Date().toISOString()
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }
};

export default {
  getRides,
  getUserRides,
  getDriverRides,
  createRide,
  updateRideStatus,
  bookRide,
  startRide,
  endRide,
  processPayment,
  migrateLocalStorageToFirebase,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  getDriverById,
  updateDriverLocation,
  subscribeToDriverLocation,
};
