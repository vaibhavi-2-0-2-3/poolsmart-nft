import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/shared/Button';
import { Calendar, MapPin, User, ArrowLeft, Users, Clock, Car, MessageCircle, Phone, Star } from 'lucide-react';
import { getEventById, updateEventRSVP } from '@/lib/eventsApi';
import { Event } from '@/lib/eventsApi';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessagingModal } from '@/components/messaging/MessagingModal';
import { createRideRequest, getProfile } from '@/lib/supabase';
import { PhoneNumberModal } from '@/components/rides/PhoneNumberModal';
import { CreateRideModal } from '@/components/rides/CreateRideModal';
import { useEventRides } from '@/hooks/useEventRides';
import { formatDate, formatTime, formatDateTime } from '@/lib/utils';

const EventDetails = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRSVP, setIsUpdatingRSVP] = useState(false);
  const [showCarpoolOptions, setShowCarpoolOptions] = useState(false);
  const [showCreateRideModal, setShowCreateRideModal] = useState(false);
  const [messagingModal, setMessagingModal] = useState<{isOpen: boolean, recipientId: string, recipientName: string} | null>(null);
  const [phoneModal, setPhoneModal] = useState<{isOpen: boolean, onSuccess: () => void} | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get real-time event rides
  const { rides: eventRides, isLoading: ridesLoading, refreshRides } = useEventRides(eventId || null);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        if (eventId) {
          const eventData = await getEventById(eventId);
          setEvent(eventData);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleRSVP = async (status: 'attending' | 'maybe' | 'not_attending') => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "Please sign in to RSVP for this event.",
        variant: "destructive"
      });
      return;
    }
    
    if (!eventId) return;
    
    try {
      setIsUpdatingRSVP(true);
      await updateEventRSVP(eventId, status);
      
      const statusText = status === 'attending' ? 'attending' : 
                        status === 'maybe' ? 'maybe attending' : 'not attending';
      
      toast({
        title: "RSVP Updated!",
        description: `You are now marked as ${statusText} for this event.`,
      });
      
      // Show carpool options if user is attending
      if (status === 'attending') {
        setShowCarpoolOptions(true);
      }
      
      // Refresh event data
      const updatedEvent = await getEventById(eventId);
      setEvent(updatedEvent);
      
    } catch (error) {
      console.error("Error updating RSVP:", error);
      toast({
        title: "RSVP Failed",
        description: "There was an error updating your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingRSVP(false);
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'music':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'entertainment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'food':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'cultural':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'film':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleOfferRide = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to offer a ride.",
        variant: "destructive"
      });
      return;
    }

    const checkPhoneAndProceed = () => {
      if (!userProfile?.phone_number) {
        setPhoneModal({
          isOpen: true,
          onSuccess: () => setShowCreateRideModal(true)
        });
      } else {
        setShowCreateRideModal(true);
      }
    };

    checkPhoneAndProceed();
  };

  const handleRequestSeat = async (rideId: string, driverName: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to request a seat.",
        variant: "destructive"
      });
      return;
    }

    const proceedWithRequest = async () => {
      try {
        await createRideRequest(rideId);
        toast({
          title: "Seat requested!",
          description: `Your request has been sent to ${driverName}. They will be notified.`,
        });
        refreshRides(); // Refresh the rides data
      } catch (error) {
        console.error('Error requesting seat:', error);
        toast({
          title: "Request failed",
          description: "There was an error requesting the seat. Please try again.",
          variant: "destructive"
        });
      }
    };

    // Check if user has phone number
    if (!userProfile?.phone_number) {
      setPhoneModal({
        isOpen: true,
        onSuccess: proceedWithRequest
      });
    } else {
      await proceedWithRequest();
    }
  };

  const handleMessageDriver = (driverId: string, driverName: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to message drivers.",
        variant: "destructive"
      });
      return;
    }

    setMessagingModal({
      isOpen: true,
      recipientId: driverId,
      recipientName: driverName
    });
  };

  const handleCallDriver = (driverName: string, driverPhone: string | null) => {
    if (driverPhone) {
      // In a real app, this could open the phone dialer
      toast({
        title: "Contact Driver",
        description: `Call ${driverName} at ${driverPhone}`,
      });
    } else {
      toast({
        title: "Contact Driver",
        description: `Please use the message feature to coordinate with ${driverName}. Phone number not available.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Link to="/events">
                <Button variant="outline" size="sm" iconLeft={<ArrowLeft className="h-4 w-4" />}>
                  Back to Events
                </Button>
              </Link>
            </div>
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Event Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The event you're looking for doesn't exist or has been removed.
              </p>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="relative h-96 overflow-hidden">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Calendar className="h-32 w-32 text-white opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center mb-4">
                <Link to="/events" className="mr-4">
                  <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Events
                  </Button>
                </Link>
                {event.category && (
                  <Badge className={`${getCategoryColor(event.category)} backdrop-blur-sm`}>
                    {event.category}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-6 text-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{formatDateTime(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                {event.rsvpCount !== undefined && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{event.rsvpCount} attending</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-brand-600" />
                    About This Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {event.description}
                  </p>
                  
                  {event.organizerName && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-brand-600" />
                        <span className="font-medium">Organized by {event.organizerName}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Real Carpool Options (shown when user RSVPs as attending) */}
              {(showCarpoolOptions || event.rsvpStatus === 'attending') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Car className="h-6 w-6 mr-2 text-brand-600" />
                      Available Carpools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ridesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
                        <p className="text-muted-foreground mt-2">Loading available rides...</p>
                      </div>
                    ) : eventRides.length === 0 ? (
                      <div className="text-center py-8">
                        <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No rides available yet.</p>
                        <p className="text-sm text-muted-foreground">Be the first to offer a ride!</p>
                      </div>
                    ) : (
                      eventRides.map((ride) => (
                        <div key={ride.ride_id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{ride.driver_name}</span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-muted-foreground ml-1">4.8</span>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  From {ride.origin}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Departure at {formatTime(ride.departure_time)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-brand-600">₹{ride.price}/seat</div>
                              <div className="text-sm text-muted-foreground">
                                {ride.available_seats} seats left
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleRequestSeat(ride.ride_id, ride.driver_name)}
                              disabled={ride.available_seats <= 0}
                            >
                              {ride.available_seats <= 0 ? 'Full' : 'Request Seat'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMessageDriver(ride.ride_id, ride.driver_name)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCallDriver(ride.driver_name, ride.driver_phone)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <Separator />
                    
                    <div className="text-center">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleOfferRide}
                      >
                        <Car className="h-4 w-4 mr-2" />
                        Offer a Ride Instead
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* RSVP Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-brand-600 mb-1">
                      {event.price ? `₹${event.price}` : 'Free Event'}
                    </div>
                    {event.rsvpStatus && (
                      <div className="text-sm text-muted-foreground">
                        You are {event.rsvpStatus === 'attending' ? 'going' : 
                                 event.rsvpStatus === 'maybe' ? 'interested' : 'not going'} 
                      </div>
                    )}
                  </div>
                  
                  {user ? (
                    <div className="space-y-3">
                      <Button
                        variant={event.rsvpStatus === 'attending' ? 'primary' : 'outline'}
                        size="lg"
                        className="w-full"
                        onClick={() => handleRSVP('attending')}
                        disabled={isUpdatingRSVP}
                      >
                        {isUpdatingRSVP && event.rsvpStatus !== 'attending' ? 'Updating...' : 'Going'}
                      </Button>
                      
                      <Button
                        variant={event.rsvpStatus === 'maybe' ? 'secondary' : 'outline'}
                        size="lg"
                        className="w-full"
                        onClick={() => handleRSVP('maybe')}
                        disabled={isUpdatingRSVP}
                      >
                        {isUpdatingRSVP && event.rsvpStatus !== 'maybe' ? 'Updating...' : 'Interested'}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Please sign in",
                          description: "Please sign in to RSVP for this event.",
                          variant: "destructive"
                        });
                      }}
                    >
                      Sign in to RSVP
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Event Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-brand-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Date & Time</div>
                      <div className="text-sm text-muted-foreground">{formatDateTime(event.date)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-brand-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">{event.location}</div>
                    </div>
                  </div>
                  
                  {event.rsvpCount !== undefined && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-brand-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Attendees</div>
                        <div className="text-sm text-muted-foreground">{event.rsvpCount} people going</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mini Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Venue Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-brand-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Create Ride Modal */}
      {showCreateRideModal && (
        <CreateRideModal
          isOpen={showCreateRideModal}
          onClose={() => setShowCreateRideModal(false)}
          onRideCreated={() => {
            refreshRides();
            setShowCreateRideModal(false);
          }}
          eventId={eventId}
          eventName={event.title}
          prefilledData={{
            destination: event.location,
            date: event.date.split('T')[0],
            time: event.date.split('T')[1]?.substring(0, 5) || '09:00'
          }}
        />
      )}

      {/* Messaging Modal */}
      {messagingModal && (
        <MessagingModal
          isOpen={messagingModal.isOpen}
          onClose={() => setMessagingModal(null)}
          recipientId={messagingModal.recipientId}
          recipientName={messagingModal.recipientName}
          currentUserId={user?.id || ''}
          currentUserName={user?.user_metadata?.full_name || user?.email || 'Anonymous'}
        />
      )}

      {/* Phone Number Modal */}
      {phoneModal && (
        <PhoneNumberModal
          isOpen={phoneModal.isOpen}
          onClose={() => setPhoneModal(null)}
          onSuccess={() => {
            phoneModal.onSuccess();
            setPhoneModal(null);
          }}
          currentPhoneNumber={userProfile?.phone_number}
        />
      )}
    </div>
  );
};

export default EventDetails;
