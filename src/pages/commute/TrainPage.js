import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import LocationSelector from '../../components/booking/LocationSelector';
import { hasActiveBooking } from '../../utils/bookingStorage';
import { AlertCircle } from 'lucide-react';

function TrainPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [trainClass, setTrainClass] = useState('Sleeper');
  const [activeBookingExists, setActiveBookingExists] = useState(false);
  
  // Sample train classes
  const trainClasses = [
    { id: 1, name: 'Sleeper', price: 499, description: 'Comfortable berths for overnight travel' },
    { id: 2, name: '3AC', price: 899, description: 'Air-conditioned three-tier sleeper coach' },
    { id: 3, name: '2AC', price: 1299, description: 'Air-conditioned two-tier sleeper coach' },
    { id: 4, name: '1AC', price: 2499, description: 'Premium air-conditioned private cabins' }
  ];

  // Sample train routes
  const sampleTrains = [
    { id: 101, name: 'Rajdhani Express', departure: '16:50', arrival: '10:20', duration: '17h 30m' },
    { id: 102, name: 'Shatabdi Express', departure: '06:15', arrival: '12:45', duration: '6h 30m' },
    { id: 103, name: 'Duronto Express', departure: '23:00', arrival: '14:30', duration: '15h 30m' }
  ];

  // Check authentication and active booking on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/train' } });
    }
    setActiveBookingExists(hasActiveBooking());
  }, [isAuthenticated, navigate]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/train' } });
      return;
    }
    
    // Check for active booking
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    if (!origin || !destination) {
      alert('Please enter both origin and destination stations.');
      return;
    }
    
    // Process booking
    alert(`Train booking successful! Your ${trainClass} class tickets from ${origin} to ${destination} on ${date} have been confirmed.`);
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
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Book Train Tickets</h1>
      
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
              
              {/* Train class selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Class:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {trainClasses.map((cls) => (
                    <div 
                      key={cls.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${trainClass === cls.name ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' : 'border-gray-200 hover:border-primary-300'}`}
                      onClick={() => setTrainClass(cls.name)}
                    >
                      <div className="font-medium">{cls.name}</div>
                      <div className="text-sm text-gray-500">₹{cls.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-primary-600 text-white py-3 rounded-md font-bold hover:bg-primary-700 transition"
              >
                Search Trains
              </button>
            </form>
          </div>
          
          {/* Sample trains */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Available Trains</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleTrains.map((train) => (
                    <tr key={train.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{train.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{train.departure}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{train.arrival}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{train.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary-600 hover:text-primary-900 font-medium">Select</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Info Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Class Information</h2>
            <div className="space-y-4">
              {trainClasses.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-medium">{cls.name}</h3>
                  <p className="text-sm text-gray-500">{cls.description}</p>
                  <div className="mt-1 font-semibold text-primary-600">₹{cls.price}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <h3 className="font-medium text-yellow-800 mb-2">Important Information</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Arrive 30 minutes before departure</li>
              <li>• Carry valid ID proof for all passengers</li>
              <li>• Children below 5 years travel free</li>
              <li>• Cancellation charges apply as per rules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainPage;