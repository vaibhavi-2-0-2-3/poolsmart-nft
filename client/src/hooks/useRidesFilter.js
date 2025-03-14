
import { useState, useEffect } from 'react';
import { ridesApi } from '../services/api';

export const useRidesFilter = (initialFilters = {}) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    date: '',
    seats: '',
    minPrice: '',
    maxPrice: '',
    sortBy: '',
    sortOrder: 'asc',
    verifiedOnly: false,
    ...initialFilters
  });

  // Fetch rides when filters change
  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await ridesApi.getRides(filters);
        setRides(response.data);
      } catch (err) {
        console.error('Error fetching rides:', err);
        setError(err.response?.data?.message || 'Failed to fetch rides');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRides();
  }, [filters]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      from: '',
      to: '',
      date: '',
      seats: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '',
      sortOrder: 'asc',
      verifiedOnly: false
    });
  };

  return {
    rides,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters
  };
};
