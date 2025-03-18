
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
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserProfileData } from "@/components/profile/UserRegistrationModal";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB19zdIU6kMMQxNvJdOgkWcwqE9_LbYB-4",
  authDomain: "carpool-8739b.firebaseapp.com",
  projectId: "carpool-8739b",
  storageBucket: "carpool-8739b.firebasestorage.app",
  messagingSenderId: "93767537081",
  appId: "1:93767537081:web:b0e18b80eb3b0db4a9e668",
  measurementId: "G-B9HW3RJ3TH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Add the 'export' keyword to ensure the Ride interface is exported
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
    time?: string;
  };
  price: number;
  seatsAvailable: number;
  passengers?: string[];
  status: "active" | "completed" | "in_progress" | "cancelled";
  paymentStatus?: "pending" | "processing" | "completed" | "failed";
  startedAt?: string;
  endedAt?: string;
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
    const querySnapshot = await getDocs(collection(db, "rides"));
    const rides: Ride[] = [];
    querySnapshot.forEach((doc) => {
      const rideData = doc.data() as Omit<Ride, "id">;
      rides.push({ id: doc.id, ...rideData });
    });
    return rides;
  } catch (error) {
    console.error("Error getting rides from Firebase:", error);
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
      const rideData = doc.data() as Omit<Ride, "id">;
      rides.push({ id: doc.id, ...rideData });
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
      const rideData = doc.data() as Omit<Ride, "id">;
      rides.push({ id: doc.id, ...rideData });
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
    const docRef = await addDoc(collection(db, "rides"), ride);
    return docRef.id;
  } catch (error) {
    console.error("Error creating ride in Firebase:", error);
    const localRides = localStorage.getItem("rides") || "[]";
    const rides = JSON.parse(localRides);
    const id = `ride-${Date.now()}`;
    const newRide = { id, ...ride };
    rides.push(newRide);
    localStorage.setItem("rides", JSON.stringify(rides));
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

export { addDoc as addRide };

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
};
