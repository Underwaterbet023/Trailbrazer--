import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import { hasActiveBooking } from '../../utils/bookingStorage';
import { AlertCircle } from 'lucide-react';
import LocationSelector from '../../components/booking/LocationSelector';

function MetroPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { addToCart } = useCart();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [ticketType, setTicketType] = useState('Single Journey');
  const [activeBookingExists, setActiveBookingExists] = useState(false);
  
  // Sample ticket types
  const ticketTypes = [
    { id: 1, name: 'Single Journey', price: 30, description: 'One-way trip between stations' },
    { id: 2, name: 'Return Journey', price: 50, description: 'Round trip on the same day' },
    { id: 3, name: 'Day Pass', price: 100, description: 'Unlimited travel for one day' },
    { id: 4, name: 'Tourist Pass', price: 250, description: '3-day unlimited travel' }
  ];

  // Sample metro lines
  const metroLines = [
    { id: 1, name: 'Blue Line', color: 'bg-blue-500', stations: ['Dwarka', 'Rajiv Chowk', 'Noida City Centre'] },
    { id: 2, name: 'Yellow Line', color: 'bg-yellow-500', stations: ['Samaypur Badli', 'Kashmere Gate', 'Huda City Centre'] },
    { id: 3, name: 'Red Line', color: 'bg-red-500', stations: ['Rithala', 'Kashmere Gate', 'Shaheed Sthal'] },
    { id: 4, name: 'Green Line', color: 'bg-green-500', stations: ['Kirti Nagar', 'Inderlok', 'Brigadier Hoshiar Singh'] }
  ];

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/metro' } });
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
      navigate('/login', { state: { from: '/booking/metro' } });
      return;
    }
    
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    if (!origin || !destination) {
      alert('Please enter both origin and destination stations.');
      return;
    }
    
    // Get selected ticket type
    const selectedTicket = ticketTypes.find(ticket => ticket.name === ticketType) || ticketTypes[0];
    
    // Calculate total price based on number of passengers
    const totalPrice = selectedTicket.price * passengers;
    
    // Create booking object
    const metroBooking = {
      id: `METRO-${Date.now().toString().slice(-6)}`,
      type: 'Metro Ticket',
      ticketType: ticketType,
      from: origin,
      to: destination,
      date: date || new Date().toLocaleDateString(),
      passengers: passengers,
      price: totalPrice,
      description: selectedTicket.description
    };
    
    // Add to cart
    addToCart(metroBooking);
    alert(`${ticketType} metro ticket has been added to your cart!`);
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
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Book Metro Tickets</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Journey Details</h2>
            <form onSubmit={handleBooking}>
              {/* Location selectors */}
              <LocationSelector 
                label="From Station"
                value={origin}
                onChange={setOrigin}
                placeholder="Enter origin station"
                allowCurrentLocation={false}
              />
              
              <LocationSelector 
                label="To Station"
                value={destination}
                onChange={setDestination}
                placeholder="Enter destination station"
                allowCurrentLocation={false}
              />
              
              {/* Date and passengers selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Journey Date:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Passengers:</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>
              
              {/* Ticket type selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Ticket Type:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ticketTypes.map((ticket) => (
                    <div 
                      key={ticket.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${ticketType === ticket.name ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' : 'border-gray-200 hover:border-primary-300'}`}
                      onClick={() => setTicketType(ticket.name)}
                    >
                      <div className="font-medium">{ticket.name}</div>
                      <div className="text-sm text-gray-500">₹{ticket.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-primary-600 text-white py-3 rounded-md font-bold hover:bg-primary-700 transition"
              >
                Book Tickets
              </button>
            </form>
          </div>
          
          {/* Metro Map */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Metro Network</h2>
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="text-center text-gray-500 italic">
                Interactive metro map would be displayed here
              </div>
              
              {/* Metro Lines */}
              <div className="mt-6 space-y-4">
                {metroLines.map((line) => (
                  <div key={line.id} className="border border-gray-200 rounded-lg bg-white p-4">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${line.color}`}></div>
                      <h3 className="ml-2 font-medium">{line.name}</h3>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="text-sm text-gray-600">
                        {line.stations.map((station, index) => (
                          <span key={station}>
                            {station}
                            {index < line.stations.length - 1 && (
                              <span className="mx-1">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Info Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Ticket Information</h2>
            <div className="space-y-4">
              {ticketTypes.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-medium">{ticket.name}</h3>
                  <p className="text-sm text-gray-500">{ticket.description}</p>
                  <div className="mt-1 font-semibold text-primary-600">₹{ticket.price}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-medium text-purple-800 mb-2">Metro Guidelines</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Security check is mandatory at all stations</li>
              <li>• Last train timings vary by station</li>
              <li>• Children below 3 feet height travel free</li>
              <li>• No eating or drinking inside the metro</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetroPage;