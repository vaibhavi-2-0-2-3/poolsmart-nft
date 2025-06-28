
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Users, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  timestamp: Date;
  is_own_message: boolean;
}

interface EventParticipant {
  id: string;
  name: string;
  avatar?: string;
  is_online: boolean;
  last_seen?: Date;
}

interface EventGroupChatProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}

export const EventGroupChat: React.FC<EventGroupChatProps> = ({
  isOpen,
  onClose,
  eventId,
  eventName
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for demo
  useEffect(() => {
    if (isOpen) {
      // Simulate loading participants
      const mockParticipants: EventParticipant[] = [
        { id: '1', name: 'Sarah Johnson', is_online: true },
        { id: '2', name: 'Mike Chen', is_online: true },
        { id: '3', name: 'Anna Rodriguez', is_online: false, last_seen: new Date(Date.now() - 900000) },
        { id: '4', name: 'David Kumar', is_online: true },
      ];

      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          content: "Hey everyone! Excited for tonight's event! 🎉",
          sender_id: '1',
          sender_name: 'Sarah Johnson',
          timestamp: new Date(Date.now() - 3600000),
          is_own_message: false,
        },
        {
          id: '2',
          content: "Same here! What time should we meet at the parking lot?",
          sender_id: '2',
          sender_name: 'Mike Chen',
          timestamp: new Date(Date.now() - 3300000),
          is_own_message: false,
        },
        {
          id: '3',
          content: "I can pick everyone up at 7 PM sharp. My car is a blue Tesla Model 3",
          sender_id: user?.id || 'current',
          sender_name: 'You',
          timestamp: new Date(Date.now() - 1800000),
          is_own_message: true,
        },
        {
          id: '4',
          content: "Perfect! I'll be waiting at the main entrance 👍",
          sender_id: '4',
          sender_name: 'David Kumar',
          timestamp: new Date(Date.now() - 900000),
          is_own_message: false,
        },
      ];

      setParticipants(mockParticipants);
      setMessages(mockMessages);
    }
  }, [isOpen, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender_id: user?.id || 'current',
      sender_name: 'You',
      timestamp: new Date(),
      is_own_message: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    toast({
      title: "Message sent",
      description: "Your message has been sent to the group.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const onlineCount = participants.filter(p => p.is_online).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[700px] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-brand-50 to-brand-100">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-brand-800">
                {eventName} Group
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-brand-600" />
                <span className="text-sm text-brand-600">
                  {participants.length} members • {onlineCount} online
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Online Participants */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {participants.filter(p => p.is_online).map((participant) => (
              <div key={participant.id} className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm flex-shrink-0">
                <div className="relative">
                  <Avatar className="h-6 w-6">
                    {participant.avatar ? (
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                    ) : (
                      <AvatarFallback className="bg-brand-100 text-brand-600 text-xs">
                        {getInitials(participant.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{participant.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.is_own_message ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`flex gap-2 max-w-[70%] ${message.is_own_message ? 'flex-row-reverse' : ''}`}>
                  {!message.is_own_message && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {message.sender_avatar ? (
                        <AvatarImage src={message.sender_avatar} alt={message.sender_name} />
                      ) : (
                        <AvatarFallback className="bg-brand-100 text-brand-600 text-xs">
                          {getInitials(message.sender_name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${message.is_own_message ? 'items-end' : 'items-start'}`}>
                    {!message.is_own_message && (
                      <span className="text-xs text-gray-500 mb-1">{message.sender_name}</span>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-full break-words ${
                        message.is_own_message
                          ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-6 pt-0 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="px-2">
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border-2 border-gray-200 focus:border-brand-500 rounded-full px-4"
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || loading}
              size="sm"
              className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 rounded-full px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
