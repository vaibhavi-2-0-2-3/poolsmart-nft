
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  currentUserId: string;
  currentUserName: string;
}

export const MessagingModal: React.FC<MessagingModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  recipientAvatar,
  currentUserId,
  currentUserName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock messages for demo
  useEffect(() => {
    if (isOpen) {
      // Simulate loading existing conversation
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: recipientId,
          senderName: recipientName,
          content: "Hi! Thanks for booking my ride. Looking forward to the trip!",
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          isCurrentUser: false,
        },
        {
          id: '2',
          senderId: currentUserId,
          senderName: currentUserName,
          content: "Great! What time should I be ready?",
          timestamp: new Date(Date.now() - 1800000), // 30 min ago
          isCurrentUser: true,
        },
        {
          id: '3',
          senderId: recipientId,
          senderName: recipientName,
          content: "I'll pick you up at 8:45 AM sharp. Please be ready 5 minutes early.",
          timestamp: new Date(Date.now() - 900000), // 15 min ago
          isCurrentUser: false,
        },
      ];
      setMessages(mockMessages);
    }
  }, [isOpen, recipientId, recipientName, currentUserId, currentUserName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: currentUserName,
        content: newMessage.trim(),
        timestamp: new Date(),
        isCurrentUser: true,
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate auto-reply after 2 seconds
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: recipientId,
          senderName: recipientName,
          content: "Thanks for the message! I'll get back to you soon.",
          timestamp: new Date(),
          isCurrentUser: false,
        };
        setMessages(prev => [...prev, autoReply]);
      }, 2000);

      toast({
        title: "Message sent",
        description: `Your message has been sent to ${recipientName}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                {recipientAvatar ? (
                  <AvatarImage src={recipientAvatar} alt={recipientName} />
                ) : (
                  <AvatarFallback className="bg-brand-100 text-brand-600">
                    {getInitials(recipientName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <DialogTitle className="text-lg">{recipientName}</DialogTitle>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isCurrentUser
                      ? 'bg-brand-600 text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isCurrentUser ? 'text-brand-100' : 'text-muted-foreground'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || loading}
              size="sm"
              className="bg-brand-600 hover:bg-brand-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
