
import React from 'react';
import { 
  Drawer, 
  DrawerContent,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Button } from '@/components/shared/Button';
import { MessageCircle } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

interface ChatDrawerProps {
  eventId: string;
  eventTitle: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ eventId, eventTitle }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full sm:w-auto"
          iconLeft={<MessageCircle className="h-4 w-4" />}
        >
          Discuss Carpooling
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="h-full max-w-md mx-auto w-full">
          <ChatInterface eventId={eventId} eventTitle={eventTitle} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
