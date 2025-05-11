
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { X, Navigation } from 'lucide-react';

interface DriverLocation {
  lat: number;
  lng: number;
  timestamp: number;
  driverName: string;
  driverId: string;
}

interface LiveTrackingProps {
  rideId: string;
  driverId: string;
  driverName: string;
  departure: string;
  destination: string;
  onClose: () => void;
}

export const LiveTracking: React.FC<LiveTrackingProps> = ({
  rideId,
  driverId,
  driverName,
  departure,
  destination,
  onClose
}) => {
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  
  // Simulate fetching driver's location (in a real app, this would use WebSockets or Firebase)
  useEffect(() => {
    setIsLoading(true);
    
    // Mock getting initial driver location
    const initialLocation = {
      lat: 40.7128 + (Math.random() * 0.02 - 0.01), // Random position near NYC
      lng: -74.0060 + (Math.random() * 0.02 - 0.01),
      timestamp: Date.now(),
      driverName: driverName,
      driverId: driverId
    };
    
    setDriverLocation(initialLocation);
    setIsLoading(false);
    
    // Simulate location updates
    const locationInterval = setInterval(() => {
      setDriverLocation(prevLocation => {
        if (!prevLocation) return initialLocation;
        
        // Simulate small movement
        return {
          lat: prevLocation.lat + (Math.random() * 0.001 - 0.0005),
          lng: prevLocation.lng + (Math.random() * 0.001 - 0.0005),
          timestamp: Date.now(),
          driverName: driverName,
          driverId: driverId
        };
      });
    }, 5000);
    
    return () => {
      clearInterval(locationInterval);
    };
  }, [driverId, driverName]);
  
  // Initialize and update the map
  useEffect(() => {
    if (!mapRef.current || !driverLocation) return;
    
    const initMap = async () => {
      try {
        // Check if map already initialized
        if (!mapInstanceRef.current) {
          // For simplicity, we're using a div with position indicators
          // In a real implementation, you'd integrate Google Maps, Mapbox, etc.
          mapInstanceRef.current = true;
          
          // Create marker for driver
          markerRef.current = document.createElement('div');
          markerRef.current.className = 'relative';
          markerRef.current.innerHTML = `
            <div class="absolute w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
              <div class="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div class="absolute w-12 h-12 bg-brand-600/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          `;
          
          mapRef.current.appendChild(markerRef.current);
        }
        
        // Update marker position based on location
        // In a simple visualization, we'll map the lat/lng to positions within the div
        updateMarkerPosition(driverLocation);
        
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to load map. Please try again.");
      }
    };
    
    initMap();
  }, [driverLocation]);
  
  const updateMarkerPosition = (location: DriverLocation) => {
    if (!mapRef.current || !markerRef.current) return;
    
    // Convert lat/lng to relative positions in the container
    // This is just a visual representation - in a real app you'd use actual map coordinates
    const mapWidth = mapRef.current.clientWidth;
    const mapHeight = mapRef.current.clientHeight;
    
    // Map lat/lng to positions within the div (this is just for visualization)
    const x = ((location.lng + 74.0060) * mapWidth * 10) % mapWidth;
    const y = ((location.lat - 40.7128) * mapHeight * 10) % mapHeight;
    
    markerRef.current.style.left = `${x}px`;
    markerRef.current.style.top = `${y}px`;
  };
  
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Live Tracking</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Live Tracking</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-300">
          {error}
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Live Tracking</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <Navigation className="h-4 w-4 mr-1 text-green-500" />
          <span>From: {departure}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Navigation className="h-4 w-4 mr-1 rotate-180 text-red-500" />
          <span>To: {destination}</span>
        </div>
      </div>
      
      <div ref={mapRef} className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-4">
        {/* Map container - marker will be placed here by the useEffect */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <p>Map showing {driverName}'s location</p>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Driver: {driverName}</span>
          {driverLocation && (
            <span>Updated: {new Date(driverLocation.timestamp).toLocaleTimeString()}</span>
          )}
        </div>
      </div>
    </Card>
  );
};
