import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import LocationSelector from '../../components/booking/LocationSelector';
import { hasActiveBooking } from '../../utils/bookingStorage';
import { AlertCircle } from 'lucide-react';

function AutoPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { addToCart } = useCart();
  
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  
  // Check for active booking on component mount
  useEffect(() => {
    setActiveBookingExists(hasActiveBooking());
  }, []);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/auto' } });
      return;
    }
    
    // Check for active booking
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    if (!pickup || !destination) {
      alert('Please enter both pickup and destination addresses.');
      return;
    }
    
    const autoBooking = {
      id: `AU-${Date.now().toString().slice(-6)}`,
      type: 'Auto Rickshaw',
      from: pickup,
      to: destination,
      date: date || new Date().toLocaleDateString(),
      time: time || new Date().toLocaleTimeString(),
      passengers,
      price: calculatePrice(pickup, destination),
    };
    
    addToCart(autoBooking);
    alert('Auto rickshaw booking added to cart!');
  };
  
  // Enhanced price calculation with different auto options
  const autoOptions = [
    { id: 1, type: 'Regular Auto', basePrice: 50, perKmRate: 15, capacity: 3, features: ['Metered', 'Standard'] },
    { id: 2, type: 'Premium Auto', basePrice: 70, perKmRate: 18, capacity: 3, features: ['Metered', 'Comfortable Seating', 'Mobile Charging'] },
    { id: 3, type: 'Shared Auto', basePrice: 30, perKmRate: 10, capacity: 6, features: ['Fixed Routes', 'Shared Ride', 'Economical'] },
    { id: 4, type: 'Electric Auto', basePrice: 60, perKmRate: 16, capacity: 3, features: ['Eco-friendly', 'Quiet Ride', 'Modern'] }
  ];
  
  const [selectedAutoType, setSelectedAutoType] = useState(autoOptions[0]);
  const [activeBookingExists, setActiveBookingExists] = useState(false);
  
  // Simple price calculation based on a dummy formula
  const calculatePrice = (pickup, destination) => {
    // This is just a dummy calculation
    const basePrice = selectedAutoType.basePrice;
    const perKmRate = selectedAutoType.perKmRate;
    // Simulate distance calculation (in a real app, this would use maps API)
    const dummyDistance = Math.floor(Math.random() * 10) + 1; // 1-10 km
    return basePrice + (perKmRate * dummyDistance);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Auto Rickshaw</h1>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <LocationSelector 
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={setPickup}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <LocationSelector 
                    placeholder="Enter destination"
                    value={destination}
                    onChange={setDestination}
                  />
                </div>
              </div>
              
              {/* Auto Type Selection */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Auto Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {autoOptions.map((auto) => (
                    <div 
                      key={auto.id}
                      onClick={() => setSelectedAutoType(auto)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAutoType.id === auto.id 
                          ? 'border-primary-500 bg-primary-50 shadow-md' 
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">{auto.type}</h3>
                      <p className="text-sm text-gray-500 mt-1">Base fare: ₹{auto.basePrice}</p>
                      <p className="text-sm text-gray-500">Per km: ₹{auto.perKmRate}</p>
                      <p className="text-sm text-gray-500">Capacity: {auto.capacity} persons</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {auto.features.map((feature, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                  
              {/* Date and time selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time:</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Passengers */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Passengers:</label>
                <select
                  className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Auto rickshaws can accommodate up to 3 passengers</p>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-primary-600 text-white py-3 rounded-md font-bold hover:bg-primary-700 transition"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
        
        {/* Info Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Auto Rickshaw Info</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Quick & Convenient</h3>
                  <p className="text-xs text-gray-500">Perfect for short distances within the city</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Affordable</h3>
                  <p className="text-xs text-gray-500">Economical option with metered fares</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Navigate Narrow Streets</h3>
                  <p className="text-xs text-gray-500">Can access areas where larger vehicles can't go</p>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Safety Guidelines</h3>
                  <p className="text-xs text-gray-500">Always check driver ID and vehicle number before boarding</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <h3 className="font-medium text-yellow-800 mb-2">Fare Information</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Base fare: ₹50 for first 1.5 km</li>
              <li>• ₹15 per additional km</li>
              <li>• Waiting charges: ₹30 per 15 minutes</li>
              <li>• Night charges (10 PM - 5 AM): 1.5x regular fare</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutoPage;