import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import LocationSelector from '../../components/booking/LocationSelector';
import { hasActiveBooking } from '../../utils/bookingStorage';
import { AlertCircle } from 'lucide-react';

function BikesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { addToCart } = useCart();
  const [pickup, setPickup] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bikeType, setBikeType] = useState('Standard');
  const [activeBookingExists, setActiveBookingExists] = useState(false);
  
  // Sample bike packages
  const bikePackages = [
    { id: 1, name: 'Standard', price: 199, description: 'Regular commuter bikes', image: 'https://tse2.mm.bing.net/th/id/OIP.vxMB0cYGN-yzWgU8suQAlAHaD4?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 2, name: 'Electric', price: 299, description: 'Battery-powered for effortless rides', image: 'https://img.freepik.com/premium-photo/electric-motorcycle-realistic-isolated-8k-white-backgroundgenerative-ai_760510-6569.jpg?w=2000' },
    { id: 3, name: 'Mountain', price: 349, description: 'Off-road capable with suspension', image: 'https://tse2.mm.bing.net/th/id/OIP.8GLTyrudWUwqbX3pipbfMQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 4, name: 'Sports', price: 399, description: 'High-performance racing bikes', image: 'https://tse4.mm.bing.net/th/id/OIP.8r2g7m3AtvroZ5FQilIx4AHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3' }
  ];

  // Check authentication and active booking on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/bikes' } });
    }
    setActiveBookingExists(hasActiveBooking());
  }, [isAuthenticated, navigate]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/bikes' } });
      return;
    }
    
    // Check for active booking
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    if (!pickup) {
      alert('Please enter pickup location.');
      return;
    }
    
    // Get selected bike package
    const selectedBike = bikePackages.find(bike => bike.name === bikeType) || bikePackages[0];
    
    // Calculate total price based on number of days
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const days = endDate ? Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) : 1;
    const totalPrice = selectedBike.price * days;
    
    // Create booking object
    const bikeBooking = {
      id: `BIKE-${Date.now().toString().slice(-6)}`,
      type: 'Bike Rental',
      bikeType: bikeType,
      from: pickup,
      to: returnLocation || pickup,
      startDate: startDate || new Date().toLocaleDateString(),
      endDate: endDate || new Date().toLocaleDateString(),
      days: days,
      price: totalPrice,
      image: selectedBike.image
    };
    
    // Add to cart
    addToCart(bikeBooking);
    alert(`${bikeType} bike rental has been added to your cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
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
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Rent a Bike</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Rental Details</h2>
            <form onSubmit={handleBooking}>
              {/* Location selectors */}
              <LocationSelector 
                label="Pickup Location"
                value={pickup}
                onChange={setPickup}
                placeholder="Enter pickup location"
                allowCurrentLocation={true}
              />
              
              <LocationSelector 
                label="Return Location (optional)"
                value={returnLocation}
                onChange={setReturnLocation}
                placeholder="Same as pickup location if left empty"
                allowCurrentLocation={false}
              />
              
              {/* Date selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Bike type selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Bike Type:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {bikePackages.map((bike) => (
                    <div 
                      key={bike.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${bikeType === bike.name ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' : 'border-gray-200 hover:border-primary-300'}`}
                      onClick={() => setBikeType(bike.name)}
                    >
                      <div className="font-medium">{bike.name}</div>
                      <div className="text-sm text-gray-500">₹{bike.price}/day</div>
                    </div>
                  ))}
                </div>
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
        
        {/* Packages/Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Bike Options</h2>
            <div className="space-y-4">
              {bikePackages.map((bike) => (
                <div key={bike.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center">
                    <img src={bike.image} alt={bike.name} className="w-12 h-12 rounded-md object-cover" />
                    <div className="ml-4">
                      <h3 className="font-medium">{bike.name}</h3>
                      <p className="text-sm text-gray-500">{bike.description}</p>
                      <div className="mt-1 font-semibold text-primary-600">₹{bike.price}/day</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-medium text-green-800 mb-2">Why rent with us?</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Well-maintained bikes</li>
              <li>• Helmets and safety gear included</li>
              <li>• Flexible pickup and return</li>
              <li>• 24/7 roadside assistance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BikesPage;