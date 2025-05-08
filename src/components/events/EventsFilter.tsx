
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/shared/Button';
import { Calendar } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface EventsFilterProps {
  onSearch: (criteria: {
    keyword: string;
    location: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export const EventsFilter: React.FC<EventsFilterProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const handleSearch = () => {
    onSearch({
      keyword,
      location,
      startDate: startDate ? startDate.toISOString() : '',
      endDate: endDate ? endDate.toISOString() : '',
    });
  };

  const handleClear = () => {
    setKeyword('');
    setLocation('');
    setStartDate(undefined);
    setEndDate(undefined);
    onSearch({
      keyword: '',
      location: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <Card className="p-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="keyword" className="text-sm font-medium">
            Keyword
          </label>
          <Input
            id="keyword"
            placeholder="Search events..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            placeholder="Any location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium">
            Start Date
          </label>
          <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="startDate"
                iconRight={<Calendar className="h-4 w-4" />}
              >
                {startDate ? format(startDate, 'PPP') : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setIsStartDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium">
            End Date
          </label>
          <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="endDate"
                iconRight={<Calendar className="h-4 w-4" />}
              >
                {endDate ? format(endDate, 'PPP') : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setIsEndDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={handleClear}>
          Clear Filters
        </Button>
        <Button variant="primary" onClick={handleSearch}>
          Search Events
        </Button>
      </div>
    </Card>
  );
};
