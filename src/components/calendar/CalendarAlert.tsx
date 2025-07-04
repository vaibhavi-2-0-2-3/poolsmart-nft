
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalendarAlertProps {
  rideDate: string;
  origin: string;
  destination: string;
  driverName: string;
  notes?: string;
}

export const CalendarAlert: React.FC<CalendarAlertProps> = ({
  rideDate,
  origin,
  destination,
  driverName,
  notes = '',
}) => {
  const { toast } = useToast();

  const generateGoogleCalendarUrl = () => {
    // Create date objects and ensure proper timezone handling
    const startDate = new Date(rideDate);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

    const formatDate = (date: Date) => {
      // Format in local timezone but convert to UTC format for Google Calendar
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    };

    const title = encodeURIComponent(`Carpool: ${origin} → ${destination}`);
    const details = encodeURIComponent(
      `Driver: ${driverName}\n` +
      `Route: ${origin} to ${destination}\n` +
      `Notes: ${notes}\n\n` +
      `Organized via PoolSmart-NFT`
    );
    const location = encodeURIComponent(origin);

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;

    return calendarUrl;
  };

  const handleAddToCalendar = () => {
    const calendarUrl = generateGoogleCalendarUrl();
    window.open(calendarUrl, '_blank');
    
    toast({
      title: "Calendar event created",
      description: "Your ride has been added to Google Calendar.",
    });
  };

  return (
    <Button
      onClick={handleAddToCalendar}
      variant="outline"
      className="w-full"
    >
      <Calendar className="h-4 w-4 mr-2" />
      Add to Google Calendar
      <ExternalLink className="h-4 w-4 ml-2" />
    </Button>
  );
};
