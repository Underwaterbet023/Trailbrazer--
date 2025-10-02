import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import { hasActiveBooking } from '../../utils/bookingStorage';
import { AlertCircle } from 'lucide-react';
import LocationSelector from '../../components/booking/LocationSelector';

function FlightPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { addToCart } = useCart();
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState('Economy');
  const [tripType, setTripType] = useState('round');
  const [activeBookingExists, setActiveBookingExists] = useState(false);
  
  // Sample flight options
  const flightOptions = [
    { id: 1, airline: 'IndiGo', departure: '06:30', arrival: '08:45', duration: '2h 15m', price: 4999, stops: 0 },
    { id: 2, airline: 'Air India', departure: '08:15', arrival: '10:45', duration: '2h 30m', price: 5499, stops: 0 },
    { id: 3, airline: 'SpiceJet', departure: '10:30', arrival: '13:15', duration: '2h 45m', price: 4799, stops: 1 },
    { id: 4, airline: 'Vistara', departure: '14:00', arrival: '16:15', duration: '2h 15m', price: 6299, stops: 0 },
    { id: 5, airline: 'GoAir', departure: '16:45', arrival: '19:30', duration: '2h 45m', price: 4599, stops: 1 },
    { id: 6, airline: 'AirAsia', departure: '19:30', arrival: '21:45', duration: '2h 15m', price: 4899, stops: 0 }
  ];

  useEffect(() => {
    const checkActiveBooking = async () => {
      const hasActive = await hasActiveBooking();
      setActiveBookingExists(hasActive);
    };
    checkActiveBooking();
  }, []);

  const handleBooking = (flight) => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/flight' } });
      return;
    }
    
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    if (!origin || !destination || !departDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const flightBooking = {
      id: `FL-${Date.now().toString().slice(-6)}`,
      type: 'Flight',
      from: origin,
      to: destination,
      departDate,
      returnDate: tripType === 'round' ? returnDate : null,
      passengers,
      class: flightClass,
      airline: flight.airline,
      departure: flight.departure,
      arrival: flight.arrival,
      price: flight.price * passengers,
      tripType
    };
    
    addToCart(flightBooking);
    alert('Flight added to cart!');
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
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Book Flight Tickets</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${tripType === 'round' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTripType('round')}
          >
            Round Trip
          </button>
          <button
            className={`px-4 py-2 rounded-md ${tripType === 'oneway' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTripType('oneway')}
          >
            One Way
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <LocationSelector 
            label="From"
            value={origin}
            onChange={setOrigin}
            placeholder="Enter origin city/airport"
            allowCurrentLocation={false}
          />
          
          <LocationSelector 
            label="To"
            value={destination}
            onChange={setDestination}
            placeholder="Enter destination city/airport"
            allowCurrentLocation={false}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Departure Date:</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          {tripType === 'round' && (
            <div>
              <label className="block text-sm font-medium mb-2">Return Date:</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Passengers:</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Class:</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={flightClass}
              onChange={(e) => setFlightClass(e.target.value)}
            >
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First">First Class</option>
            </select>
          </div>
        </div>
        
        <button
          className="w-full bg-primary-600 text-white py-3 rounded-md font-bold hover:bg-primary-700 transition"
          onClick={() => {
            if (!origin || !destination || !departDate) {
              alert('Please fill in all required fields');
              return;
            }
            document.getElementById('flight-results').scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Search Flights
        </button>
      </div>
      
      <div id="flight-results" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary-700">Available Flights</h2>
        
        <div className="space-y-4">
          {flightOptions.map((flight) => (
            <div key={flight.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <div className="font-bold text-lg">{flight.airline}</div>
                  <div className="text-sm text-gray-500">
                    {flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stop`}
                  </div>
                </div>
                
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="text-right mr-8">
                    <div className="font-bold">{flight.departure}</div>
                    <div className="text-sm text-gray-500">{origin}</div>
                  </div>
                  <div className="text-center mx-4">
                    <div className="text-xs text-gray-500">{flight.duration}</div>
                    <div className="w-20 h-0.5 bg-gray-300 relative">
                      <div className="absolute -top-1.5 -right-1 w-3 h-3 border-2 border-gray-300 bg-white rounded-full"></div>
                      <div className="absolute -top-1.5 -left-1 w-3 h-3 border-2 border-gray-300 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-left ml-8">
                    <div className="font-bold">{flight.arrival}</div>
                    <div className="text-sm text-gray-500">{destination}</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="font-bold text-xl text-primary-600 mb-2">₹{flight.price}</div>
                  <button
                    onClick={() => handleBooking(flight)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-4 text-lg">Flight Booking Tips</h3>
        <ul className="text-blue-700 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Book 3-4 weeks in advance for domestic flights to get the best prices</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Tuesday and Wednesday are typically the cheapest days to fly</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Early morning or late night flights are often less expensive</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Check baggage allowance before booking to avoid extra charges</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FlightPage;