
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowDownAZ, ArrowUpAZ, ArrowUp10, ArrowDown10, SlidersHorizontal } from 'lucide-react';

export interface RidesFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  sortBy: 'price' | 'date' | 'rating' | '';
  sortOrder: 'asc' | 'desc';
  priceRange: {
    min: string;
    max: string;
  };
  verifiedOnly: boolean;
}

export const RidesFilter = ({ open, onOpenChange, onApplyFilters }: RidesFilterProps) => {
  const [filters, setFilters] = React.useState<FilterOptions>({
    sortBy: '',
    sortOrder: 'asc',
    priceRange: {
      min: '',
      max: ''
    },
    verifiedOnly: false
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceRangeChange = (key: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [key]: value
      }
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      sortBy: '',
      sortOrder: 'asc',
      priceRange: {
        min: '',
        max: ''
      },
      verifiedOnly: false
    });
  };

  return (
    <div className="mb-6">
      <Button 
        variant="outline" 
        onClick={() => onOpenChange(true)}
        iconLeft={<SlidersHorizontal className="h-4 w-4" />}
      >
        Filter Rides
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Rides</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sort-by">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: 'price' | 'date' | 'rating' | '') => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Select sort criteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="date">Departure Date</SelectItem>
                  <SelectItem value="rating">Driver Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filters.sortBy && (
              <div className="grid gap-2">
                <Label htmlFor="sort-order">Sort Order</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={filters.sortOrder === 'asc' ? 'primary' : 'outline'}
                    onClick={() => handleFilterChange('sortOrder', 'asc')}
                    className="flex-1"
                    iconLeft={filters.sortBy === 'price' ? <ArrowUp10 className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
                  >
                    Ascending
                  </Button>
                  <Button
                    type="button"
                    variant={filters.sortOrder === 'desc' ? 'primary' : 'outline'}
                    onClick={() => handleFilterChange('sortOrder', 'desc')}
                    className="flex-1"
                    iconLeft={filters.sortBy === 'price' ? <ArrowDown10 className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />}
                  >
                    Descending
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label>Price Range (ETH)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-price" className="sr-only">Minimum Price</Label>
                  <Input
                    id="min-price"
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="max-price" className="sr-only">Maximum Price</Label>
                  <Input
                    id="max-price"
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="verified-only"
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                checked={filters.verifiedOnly}
                onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
              />
              <Label htmlFor="verified-only">Verified Drivers Only</Label>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              type="button"
              variant="ghost"
              onClick={handleReset}
            >
              Reset
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" variant="primary" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
