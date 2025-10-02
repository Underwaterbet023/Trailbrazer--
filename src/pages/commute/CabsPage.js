import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import { hasActiveBooking } from '../../utils/bookingStorage';
import { AlertCircle } from 'lucide-react';
import LocationSelector from '../../components/booking/LocationSelector';

function CabsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { addToCart } = useCart();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [cabType, setCabType] = useState('Economy');
  const [activeBookingExists, setActiveBookingExists] = useState(false);
  
  // Sample cab packages
  const cabPackages = [
    { id: 1, name: 'Economy', price: 299, description: 'Affordable rides for everyday travel', image: 'https://tse4.mm.bing.net/th/id/OIP.CX4gDX1B3lcnjEtQFXqyvgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 2, name: 'Premium', price: 499, description: 'Comfortable cars with extra legroom', image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/2838cf54-504b-498c-9fa3-41e8136fdfdf/items/4a949ea1-fcc4-4bde-82da-658c6bc99a12/renditions/f2ddaa7b-e250-4818-8fa3-4944f79c0129?binary=true' },
    { id: 3, name: 'Luxury', price: 999, description: 'Premium vehicles with top-rated drivers', image: 'https://img.freepik.com/premium-photo/modern-luxury-car-transparent-white-isolated-background-p-white-background-white-background-hd-pho_873925-972118.jpg?w=2000' },
    { id: 4, name: 'SUV', price: 799, description: 'Spacious vehicles for groups and families', image: 'https://thumbs.dreamstime.com/b/white-metallic-generic-suv-car-white-background-isolated-path-white-metallic-generic-suv-car-off-road-crossover-123337285.jpg' }
  ];

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/cabs' } });
    }
    
    const checkActiveBooking = async () => {
      const hasActive = await hasActiveBooking();
      setActiveBookingExists(hasActive);
    };
    checkActiveBooking();
  }, [isAuthenticated, navigate]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/cabs' } });
      return;
    }
    
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    if (!pickup || !destination) {
      alert('Please enter both pickup and destination addresses.');
      return;
    }
    
    // Get selected cab package
    const selectedCab = cabPackages.find(cab => cab.name === cabType) || cabPackages[0];
    
    // Calculate estimated distance and price
    const estimatedDistance = Math.floor(Math.random() * 20) + 5; // 5-25 km
    const totalPrice = selectedCab.price + (estimatedDistance * 10);
    
    // Create booking object
    const cabBooking = {
      id: `CAB-${Date.now().toString().slice(-6)}`,
      type: 'Cab Service',
      cabType: cabType,
      from: pickup,
      to: destination,
      date: date || new Date().toLocaleDateString(),
      time: time || new Date().toLocaleTimeString(),
      estimatedDistance: `${estimatedDistance} km`,
      price: totalPrice,
      image: selectedCab.image
    };
    
    // Add to cart
    addToCart(cabBooking);
    alert(`${cabType} cab booking has been added to your cart!`);
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
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Book a Cab</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Trip Details</h2>
            <form onSubmit={handleBooking}>
              {/* Location selectors */}
              <LocationSelector 
                label="Pickup Location"
                value={pickup}
                onChange={setPickup}
                placeholder="Enter your pickup location"
                allowCurrentLocation={true}
              />
              
              <LocationSelector 
                label="Destination"
                value={destination}
                onChange={setDestination}
                placeholder="Enter your destination"
                allowCurrentLocation={false}
              />
              
              {/* Date and time selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time:</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Cab type selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Cab Type:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {cabPackages.map((cab) => (
                    <div 
                      key={cab.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${cabType === cab.name ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' : 'border-gray-200 hover:border-primary-300'}`}
                      onClick={() => setCabType(cab.name)}
                    >
                      <div className="font-medium">{cab.name}</div>
                      <div className="text-sm text-gray-500">₹{cab.price}</div>
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
            <h2 className="text-xl font-semibold mb-4">Cab Packages</h2>
            <div className="space-y-4">
              {cabPackages.map((cab) => (
                <div key={cab.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center">
                    <img src={cab.image} alt={cab.name} className="w-12 h-12 rounded-md object-cover" />
                    <div className="ml-4">
                      <h3 className="font-medium">{cab.name}</h3>
                      <p className="text-sm text-gray-500">{cab.description}</p>
                      <div className="mt-1 font-semibold text-primary-600">₹{cab.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Why book with us?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Verified drivers with background checks</li>
              <li>• 24/7 customer support</li>
              <li>• No cancellation fees</li>
              <li>• Clean and sanitized vehicles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CabsPage;