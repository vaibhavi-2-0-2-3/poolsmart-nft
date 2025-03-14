
import React, { useState } from 'react';
import { useRidesFilter } from '../../hooks/useRidesFilter';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../../utils/formatters';
import { useWeb3 } from '../../hooks/useWeb3';
import { usersApi } from '../../services/api';

const RidesListWithFilters = ({ initialFilters = {} }) => {
  const { 
    rides, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    resetFilters 
  } = useRidesFilter(initialFilters);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { address } = useWeb3();
  const navigate = useNavigate();

  const handleBookRide = async (rideId) => {
    if (!address) {
      alert('Please connect your wallet to book a ride');
      return;
    }

    try {
      // First check if user exists
      await usersApi.getUserByAddress(address);
      
      // Book the ride
      await ridesApi.bookRide(rideId);
      
      alert('Ride booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking ride:', error);
      alert(error.response?.data?.message || 'Failed to book ride');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="rides-list-container">
      <div className="filters-section">
        <button 
          className="filter-toggle-button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {isFilterOpen && (
          <div className="filters-form">
            <h3>Filter Rides</h3>
            
            <div className="filter-group">
              <label>Sort By:</label>
              <select 
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
              >
                <option value="">None</option>
                <option value="price">Price</option>
                <option value="date">Departure Date</option>
                <option value="rating">Driver Rating</option>
              </select>
              
              {filters.sortBy && (
                <div className="sort-order">
                  <button 
                    className={filters.sortOrder === 'asc' ? 'active' : ''}
                    onClick={() => updateFilters({ sortOrder: 'asc' })}
                  >
                    Ascending
                  </button>
                  <button 
                    className={filters.sortOrder === 'desc' ? 'active' : ''}
                    onClick={() => updateFilters({ sortOrder: 'desc' })}
                  >
                    Descending
                  </button>
                </div>
              )}
            </div>
            
            <div className="filter-group">
              <label>Price Range (ETH):</label>
              <div className="price-range">
                <input 
                  type="number" 
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                  step="0.001"
                  min="0"
                />
                <span>to</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                  step="0.001"
                  min="0"
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label>
                <input 
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => updateFilters({ verifiedOnly: e.target.checked })}
                />
                Verified Drivers Only
              </label>
            </div>
            
            <div className="filter-actions">
              <button onClick={resetFilters}>Reset</button>
              <button onClick={() => setIsFilterOpen(false)}>Apply</button>
            </div>
          </div>
        )}
      </div>
      
      <div className="rides-list">
        <h2>Available Rides ({rides.length})</h2>
        
        {rides.length === 0 ? (
          <div className="no-rides-message">
            No rides available matching your criteria.
          </div>
        ) : (
          rides.map(ride => (
            <div key={ride._id} className="ride-card">
              <div className="driver-info">
                <Link to={`/driver/${ride.driver._id}`} className="driver-link">
                  <div className="driver-avatar"></div>
                  <div className="driver-details">
                    <h3>{ride.driver.name || `Driver #${ride.driver._id.substring(0, 6)}`}</h3>
                    <div className="rating">
                      Rating: {ride.driver.rating || 'N/A'}
                    </div>
                  </div>
                </Link>
                
                {ride.driver.isVerified && (
                  <div className="verified-badge">Verified</div>
                )}
              </div>
              
              <div className="ride-details">
                <div className="locations">
                  <div className="from-location">
                    <span className="label">From:</span> 
                    <span>{ride.departure.location}</span>
                  </div>
                  
                  <div className="to-location">
                    <span className="label">To:</span> 
                    <span>{ride.destination.location}</span>
                  </div>
                </div>
                
                <div className="time-details">
                  <div className="date">
                    <span className="label">Date:</span>
                    <span>{formatDate(ride.departure.time)}</span>
                  </div>
                  
                  <div className="time">
                    <span className="label">Time:</span>
                    <span>{formatTime(ride.departure.time)}</span>
                  </div>
                </div>
              </div>
              
              <div className="ride-footer">
                <div className="seats-available">
                  <span className="label">Seats:</span>
                  <span>{ride.seatsAvailable} available</span>
                </div>
                
                <div className="booking-section">
                  <div className="price">
                    <span className="amount">{ride.price} ETH</span>
                  </div>
                  
                  <button 
                    className="book-button"
                    onClick={() => handleBookRide(ride._id)}
                    disabled={ride.seatsAvailable === 0}
                  >
                    {ride.seatsAvailable === 0 ? 'Fully Booked' : 'Book Ride'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RidesListWithFilters;
