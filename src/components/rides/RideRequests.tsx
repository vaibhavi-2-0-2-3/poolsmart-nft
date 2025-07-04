
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Clock, MessageSquare, Check, X } from 'lucide-react';
import { getRideRequests, updateRideRequestStatus, SupabaseRideRequest } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface RideRequestsProps {
  rideId: string;
  onRequestUpdate?: () => void;
}

interface RideRequestWithProfile extends SupabaseRideRequest {
  profiles?: {
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

const RideRequests: React.FC<RideRequestsProps> = ({ rideId, onRequestUpdate }) => {
  const [requests, setRequests] = useState<RideRequestWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
  }, [rideId]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const rideRequests = await getRideRequests(rideId);
      setRequests(rideRequests);
    } catch (error) {
      console.error('Error loading ride requests:', error);
      toast({
        title: "Error",
        description: "Failed to load ride requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'accepted' | 'rejected') => {
    setProcessingRequest(requestId);
    try {
      await updateRideRequestStatus(requestId, action);
      
      toast({
        title: action === 'accepted' ? "Request accepted" : "Request declined",
        description: action === 'accepted' 
          ? "The passenger has been added to your ride!"
          : "The ride request has been declined.",
      });
      
      await loadRequests();
      onRequestUpdate?.();
    } catch (error) {
      console.error(`Error ${action} request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action === 'accepted' ? 'accept' : 'decline'} request.`,
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700">Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No ride requests yet</h3>
          <p className="text-sm text-gray-500">
            Requests to join your ride will appear here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Ride Requests ({requests.filter(r => r.status === 'pending').length} pending)
      </h3>
      
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                {request.profiles?.avatar_url ? (
                  <AvatarImage src={request.profiles.avatar_url} alt="Passenger" />
                ) : (
                  <AvatarFallback>
                    {request.profiles?.full_name?.charAt(0) || 'P'}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">
                    {request.profiles?.full_name || 'Anonymous User'}
                  </h4>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(request.created_at)}
                  </div>
                  {request.message && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span className="truncate max-w-32">{request.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {request.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRequestAction(request.id, 'rejected')}
                  disabled={processingRequest === request.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleRequestAction(request.id, 'accepted')}
                  disabled={processingRequest === request.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RideRequests;
