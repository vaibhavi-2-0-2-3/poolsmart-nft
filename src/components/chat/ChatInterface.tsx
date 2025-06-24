import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User } from 'lucide-react';

// Mock user utilities
const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Mock user session
const mockUser = {
  address: 'user123',
  userProfile: {
    username: 'Demo User'
  }
};

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

interface ChatInterfaceProps {
  eventId?: string;
  eventTitle?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ eventId, eventTitle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { address, userProfile } = mockUser;
  
  // Initial bot message when chat opens
  useEffect(() => {
    if (eventTitle) {
      const initialMessage: Message = {
        id: 'welcome',
        text: `Welcome to the carpooling chat for "${eventTitle}"! Share your location, time preferences, and how many seats you have available or need. I can help coordinate carpooling arrangements.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    } else {
      const initialMessage: Message = {
        id: 'welcome',
        text: 'Welcome to the carpooling chat! Select an event to connect with others attending the same event.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [eventTitle]);
  
  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');
    
    // Process with simple AI response
    setTimeout(() => {
      generateAIResponse(newMessage);
    }, 1000);
  };
  
  // Generate AI response based on user input
  const generateAIResponse = (userInput: string) => {
    const lowerCaseInput = userInput.toLowerCase();
    let responseText = '';
    
    if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
      responseText = 'Hello! How can I help you with carpooling today?';
    } else if (lowerCaseInput.includes('offer') || lowerCaseInput.includes('seat') || lowerCaseInput.includes('can drive')) {
      responseText = 'Great! How many seats do you have available in your car, and what area are you driving from?';
    } else if (lowerCaseInput.includes('need') || lowerCaseInput.includes('looking for') || lowerCaseInput.includes('ride')) {
      responseText = 'I see you need a ride. What area will you be coming from, and how many people need transportation?';
    } else if (lowerCaseInput.includes('time') || lowerCaseInput.includes('when') || lowerCaseInput.includes('schedule')) {
      responseText = 'What time are you planning to arrive at the event? And are you flexible with your schedule?';
    } else if (lowerCaseInput.includes('location') || lowerCaseInput.includes('address') || lowerCaseInput.includes('where')) {
      responseText = 'Could you share your approximate location or neighborhood? This will help match you with others nearby.';
    } else if (lowerCaseInput.includes('thank')) {
      responseText = "You're welcome! I'm here to help make carpooling easier and more efficient.";
    } else {
      responseText = `Thanks for your message. To better assist with carpooling arrangements for ${eventTitle || 'this event'}, could you specify if you need a ride or are offering one? Also, sharing your general location would be helpful.`;
    }
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: responseText,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">
          {eventTitle ? `Carpooling Chat: ${eventTitle}` : 'Event Carpooling'}
        </h3>
        <p className="text-sm text-muted-foreground">
          Connect with others attending this event to arrange shared rides
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-brand-100 text-brand-950'
                    : 'bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'ai' ? (
                    <Avatar className="h-6 w-6 bg-brand-200">
                      <span className="text-xs font-semibold">AI</span>
                    </Avatar>
                  ) : (
                    <Avatar className="h-6 w-6">
                      <User className="h-4 w-4" />
                    </Avatar>
                  )}
                  <span className="text-xs font-medium">
                    {message.sender === 'user'
                      ? userProfile?.username || shortenAddress(address || '')
                      : 'Carpool Assistant'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="resize-none"
            rows={2}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Chat with other attendees to coordinate carpooling
        </p>
      </div>
    </div>
  );
};
