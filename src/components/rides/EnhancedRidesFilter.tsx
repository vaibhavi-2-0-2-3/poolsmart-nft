
import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface EnhancedRidesFilterProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  timeWindow: { start: string; end: string };
  minSeats: number;
  genderPreference: string;
  languages: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Italian', 
  'Portuguese', 'Mandarin', 'Japanese', 'Korean', 'Arabic'
];

const GENDER_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'female-only', label: 'Female Only' },
  { value: 'male-only', label: 'Male Only' },
  { value: 'mixed', label: 'Mixed' }
];

export const EnhancedRidesFilter: React.FC<EnhancedRidesFilterProps> = ({ onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100],
    timeWindow: { start: '', end: '' },
    minSeats: 1,
    genderPreference: 'any',
    languages: [],
    sortBy: 'date',
    sortOrder: 'asc'
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const addLanguage = (language: string) => {
    if (!filters.languages.includes(language)) {
      const newLanguages = [...filters.languages, language];
      handleFilterChange('languages', newLanguages);
    }
  };

  const removeLanguage = (language: string) => {
    const newLanguages = filters.languages.filter(lang => lang !== language);
    handleFilterChange('languages', newLanguages);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 100],
      timeWindow: { start: '', end: '' },
      minSeats: 1,
      genderPreference: 'any',
      languages: [],
      sortBy: 'date',
      sortOrder: 'asc'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between p-0 h-auto font-medium"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter & Sort Rides</span>
            {(filters.languages.length > 0 || filters.genderPreference !== 'any' || filters.minSeats > 1) && (
              <Badge variant="secondary" className="ml-2">
                {filters.languages.length + (filters.genderPreference !== 'any' ? 1 : 0) + (filters.minSeats > 1 ? 1 : 0)} active
              </Badge>
            )}
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range ($)</Label>
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                  max={200}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Time Window */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Departure Time</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-time" className="text-xs text-muted-foreground">From</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={filters.timeWindow.start}
                    onChange={(e) => handleFilterChange('timeWindow', { ...filters.timeWindow, start: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="end-time" className="text-xs text-muted-foreground">To</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={filters.timeWindow.end}
                    onChange={(e) => handleFilterChange('timeWindow', { ...filters.timeWindow, end: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Minimum Seats */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Minimum Available Seats</Label>
              <Select value={filters.minSeats.toString()} onValueChange={(value) => handleFilterChange('minSeats', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'seat' : 'seats'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gender Preference */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Gender Preference</Label>
              <Select value={filters.genderPreference} onValueChange={(value) => handleFilterChange('genderPreference', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sort By</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="seats">Available Seats</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Languages Spoken</Label>
            <div className="space-y-3">
              <Select onValueChange={addLanguage}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Add language preference" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.filter(lang => !filters.languages.includes(lang)).map(language => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.languages.map(language => (
                    <Badge key={language} variant="secondary" className="flex items-center gap-1">
                      {language}
                      <button
                        onClick={() => removeLanguage(language)}
                        className="hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-border">
            <Button variant="ghost" onClick={resetFilters} className="text-sm">
              Reset All Filters
            </Button>
            <Button variant="outline" onClick={() => setIsExpanded(false)} className="text-sm">
              Apply & Close
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
