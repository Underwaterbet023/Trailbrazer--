import React, { useState, useEffect } from 'react';
import { saveBooking } from '../utils/bookingStorage';
import { hasActiveBooking } from '../utils/bookingStorage';
import LocationSelector from '../components/booking/LocationSelector';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { AlertCircle } from 'lucide-react';

// Mock data for transport modes
const transportModes = [
  { name: 'Flight', icon: '✈️' },
  { name: 'Train', icon: '🚆' },
  { name: 'Bus', icon: '🚌' },
  { name: 'Car', icon: '🚗' },
  { name: 'Bike', icon: '🏍️' },
  { name: 'Auto', icon: '🛺' },
];

// Mock prices for demo
const mockPrices = {
  'Flight': 5999,
  'Train': 1499,
  'Bus': 899,
  'Car': 2499,
  'Bike': 1299,
  'Auto': 599,
};

function Booking() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [selectedMode, setSelectedMode] = useState('Flight');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState(mockPrices['Flight']);
  const [success, setSuccess] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [activeBookingExists, setActiveBookingExists] = useState(false);
  
  // Check authentication and active booking on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking' } });
    }
    setActiveBookingExists(hasActiveBooking());
  }, [isAuthenticated, navigate]);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setPrice(mockPrices[mode]);
    
    // Check for active booking before navigating
    if (hasActiveBooking()) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    // Navigate to specific commute pages based on selection
    if (mode === 'Flight') {
      navigate('/booking/flight');
    } else if (mode === 'Train') {
      navigate('/booking/train');
    } else if (mode === 'Car') {
      navigate('/booking/cabs');
    } else if (mode === 'Bike') {
      navigate('/booking/bikes');
    } else if (mode === 'Auto') {
      navigate('/booking/auto');
    } else if (mode === 'Bus') {
      navigate('/booking/metro');
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    
    // Check for active booking
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    if (!pickup || !destination) {
      alert('Please enter both pickup and destination addresses.');
      return;
    }
    
    const booking = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      from: pickup,
      to: destination,
      type: selectedMode,
      price,
      date: date || new Date().toLocaleDateString(),
      time: time || new Date().toLocaleTimeString(),
      status: 'Active',
      details: {
        'Booking ID': `BK-${Date.now().toString().slice(-6)}`,
        'Traveler': 'You',
        'Payment': 'Completed'
      }
    };
    
    saveBooking(booking);
    setSuccess(true);
    setPickup('');
    setDestination('');
    setDate('');
    setTime('');
    setSelectedMode('Flight');
    setPrice(mockPrices['Flight']);
    
    // Redirect to dashboard after successful booking
    setTimeout(() => {
      setSuccess(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Active Booking Warning */}
      {activeBookingExists && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Active Booking Detected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You already have an active booking. Please complete or delete your current booking before making a new one.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Book Your Transport</h1>
      <form onSubmit={handleBooking}>
        {/* Enhanced location selector for pickup with current location option */}
        <LocationSelector 
          label="From"
          value={pickup}
          onChange={setPickup}
          placeholder="Enter your pickup location"
          allowCurrentLocation={true}
        />
        
        {/* Enhanced location selector for destination */}
        <LocationSelector 
          label="To"
          value={destination}
          onChange={setDestination}
          placeholder="Enter your destination"
          allowCurrentLocation={false}
        />
        
        {/* Date and time selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-lg font-medium mb-2">Date:</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Time:</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Select Mode of Transport:</label>
          <div className="flex gap-4 flex-wrap">
            {transportModes.map((mode) => (
              <button
                type="button"
                key={mode.name}
                className={`px-4 py-2 rounded-md border ${selectedMode === mode.name ? 'bg-primary-600 text-white' : 'bg-white text-primary-700 border-primary-300'} font-medium flex items-center gap-2`}
                onClick={() => handleModeChange(mode.name)}
              >
                <span>{mode.icon}</span> {mode.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Ticket Price:</label>
          <div className="text-xl font-semibold text-primary-700">₹ {price}</div>
        </div>
        <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-md font-bold hover:bg-primary-700 transition">Book Now</button>
        {success && <div className="mt-4 text-green-600 font-semibold text-center">Booking successful! Redirecting to dashboard...</div>}
      </form>
    </div>
  );
}

export default Booking;
