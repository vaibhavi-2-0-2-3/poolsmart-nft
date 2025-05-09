
import { collection, getDocs, getDoc, doc, query, where, addDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { DEMO_EVENTS } from "@/components/home/EventsSlider";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  organizerName: string;
  price?: number;
  attendees?: string[]; // Add attendees array to track who registered
}

// Get Firestore instance
const db = getFirestore();

// Initialize events in Firebase if they don't exist
export const initializeEventsInFirebase = async (): Promise<void> => {
  try {
    // Check if events already exist
    const eventsSnapshot = await getDocs(collection(db, "events"));
    
    if (eventsSnapshot.empty) {
      console.log("No events found, initializing with demo data");
      
      // Add demo events to Firebase
      for (const event of DEMO_EVENTS) {
        const { id, ...eventData } = event;
        await addDoc(collection(db, "events"), {
          ...eventData,
          attendees: [] // Initialize with empty attendees array
        });
      }
      
      console.log("Successfully initialized events in Firebase");
    } else {
      console.log(`Found ${eventsSnapshot.size} events in Firebase`);
    }
  } catch (error) {
    console.error("Error initializing events in Firebase:", error);
  }
};

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const eventsSnapshot = await getDocs(collection(db, "events"));
    
    if (eventsSnapshot.empty) {
      console.log("No events found in Firebase, returning demo data");
      return DEMO_EVENTS;
    }
    
    const events: Event[] = [];
    eventsSnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        imageUrl: data.imageUrl,
        organizerName: data.organizerName,
        price: data.price,
        attendees: data.attendees || [],
      });
    });
    
    return events;
  } catch (error) {
    console.error("Error getting events from Firebase:", error);
    // Fallback to demo data
    return DEMO_EVENTS;
  }
};

// Get event by ID
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    // First check Firebase
    const eventDoc = await getDoc(doc(db, "events", eventId));
    
    if (eventDoc.exists()) {
      const data = eventDoc.data();
      return {
        id: eventDoc.id,
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        imageUrl: data.imageUrl,
        organizerName: data.organizerName,
        price: data.price,
        attendees: data.attendees || [],
      };
    }
    
    // If not found in Firebase, check demo events
    const demoEvent = DEMO_EVENTS.find(event => event.id === eventId);
    if (demoEvent) {
      return demoEvent;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting event by ID:", error);
    
    // Fallback to demo data
    const demoEvent = DEMO_EVENTS.find(event => event.id === eventId);
    return demoEvent || null;
  }
};

// Register for an event
export const registerForEvent = async (eventId: string, userAddress: string): Promise<boolean> => {
  try {
    console.log(`Registering user ${userAddress} for event ${eventId}`);
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (eventDoc.exists()) {
      const eventData = eventDoc.data();
      const attendees = eventData.attendees || [];
      
      // Check if user is already registered
      if (attendees.includes(userAddress)) {
        console.log("User already registered for this event");
        return false;
      }
      
      // Add user to attendees list
      attendees.push(userAddress);
      
      // Update the event document with the new attendees list
      await updateDoc(eventRef, { attendees });
      
      console.log("User successfully registered for event");
      console.log("Updated attendees list:", attendees);
      return true;
    }
    
    // If the event doesn't exist in Firebase but exists in demo data
    // We should create the event in Firebase first
    const demoEvent = DEMO_EVENTS.find(event => event.id === eventId);
    if (demoEvent) {
      const { id, ...eventData } = demoEvent;
      const newEventRef = doc(db, "events", eventId);
      await updateDoc(newEventRef, {
        ...eventData,
        attendees: [userAddress]
      });
      console.log("Created new event in Firebase and registered user");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error registering for event:", error);
    return false;
  }
};

// Get user's registered events
export const getUserRegisteredEvents = async (userAddress: string): Promise<Event[]> => {
  try {
    console.log("Fetching registered events for user:", userAddress);
    const eventsSnapshot = await getDocs(collection(db, "events"));
    
    if (eventsSnapshot.empty) {
      console.log("No events found in Firebase");
      return [];
    }
    
    const registeredEvents: Event[] = [];
    
    eventsSnapshot.forEach((doc) => {
      const data = doc.data();
      const attendees = data.attendees || [];
      
      // Check if the user is in the attendees list
      if (attendees.includes(userAddress)) {
        console.log(`User ${userAddress} is registered for event ${doc.id}`);
        registeredEvents.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          imageUrl: data.imageUrl,
          organizerName: data.organizerName,
          price: data.price,
          attendees: attendees
        });
      }
    });
    
    console.log(`Found ${registeredEvents.length} registered events for user`);
    return registeredEvents;
  } catch (error) {
    console.error("Error getting user's registered events:", error);
    return [];
  }
};

// Search events by criteria
export const searchEvents = async (criteria: {
  keyword?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Event[]> => {
  try {
    let events = await getAllEvents();
    
    if (criteria.keyword) {
      const keyword = criteria.keyword.toLowerCase();
      events = events.filter(event => 
        event.title.toLowerCase().includes(keyword) || 
        event.description.toLowerCase().includes(keyword) ||
        event.organizerName.toLowerCase().includes(keyword)
      );
    }
    
    if (criteria.location) {
      const location = criteria.location.toLowerCase();
      events = events.filter(event => 
        event.location.toLowerCase().includes(location)
      );
    }
    
    if (criteria.startDate) {
      const startDate = new Date(criteria.startDate);
      events = events.filter(event => 
        new Date(event.date) >= startDate
      );
    }
    
    if (criteria.endDate) {
      const endDate = new Date(criteria.endDate);
      events = events.filter(event => 
        new Date(event.date) <= endDate
      );
    }
    
    return events;
  } catch (error) {
    console.error("Error searching events:", error);
    return [];
  }
};
