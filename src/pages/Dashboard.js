import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, AlertCircle, ShoppingCart } from 'lucide-react';
import BookingsList from '../components/dashboard/BookingsList';
import TripFlowChart from '../components/dashboard/TripFlowChart';
import MapView from '../components/dashboard/MapView';
import { getBookings, hasActiveBooking } from '../utils/bookingStorage';

function Dashboard() {
  const location = useLocation();
  // Get trips from bookings
  const [trips, setTrips] = useState([]);
  const [activeBookingExists, setActiveBookingExists] = useState(false);
  const [shoppingConfirmed, setShoppingConfirmed] = useState(false);

  useEffect(() => {
    // Convert bookings to trip format for the TripFlowChart
    const bookings = getBookings();
    const formattedTrips = bookings.map(booking => ({
      id: booking.id || Date.now().toString(),
      tripNumber: booking.id || `TRIP-${Date.now().toString().slice(-4)}`,
      origin: booking.from || 'Origin',
      originTime: booking.departureTime || new Date().toISOString(),
      destination: booking.to || 'Destination',
      destinationTime: booking.arrivalTime || new Date().toISOString(),
      mode: booking.type?.toLowerCase() || 'car',
      purpose: booking.purpose || 'travel',
      accompaniedBy: booking.passengers || [],
      notes: booking.notes || ''
    }));
    
    setTrips(formattedTrips);
    setActiveBookingExists(hasActiveBooking());

    // Check for shopping confirmation from payment page
    if (location.state?.shoppingConfirmed) {
      setShoppingConfirmed(true);
      // Clear the state after showing the message
      setTimeout(() => setShoppingConfirmed(false), 5000);
    }
  }, [location.state]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Book Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Trip Management Dashboard</h1>
        {activeBookingExists ? (
          <div className="flex items-center space-x-2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Complete or delete your current booking to make a new one</span>
          </div>
        ) : (
          <Link
            to="/trip-packages"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Make a Book</span>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings List Section */}
        <div className="lg:col-span-1">
          <BookingsList />
        </div>
        
        {/* Trip Flow Chart Section */}
        <div className="lg:col-span-2">
          <TripFlowChart trips={trips} />
        </div>
      </div>
      
      {/* Map View Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Route Visualization</h2>
        <MapView 
          origin="Home" 
          destination="Office" 
          waypoints={[
            { name: "Coffee Shop", lat: 12.9716, lng: 77.5946 },
            { name: "Gas Station", lat: 12.9815, lng: 77.6074 }
          ]}
        />
      </div>
      
      {/* Trip Statistics Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Trips Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-100 p-3 transition-colors duration-200">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Total Trips</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">{trips.length}</p>
              </div>
            </div>
          </div>
          
          {/* Most Used Transport Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Most Used Transport</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 capitalize">Car</p>
              </div>
            </div>
          </div>
          
          {/* Total Distance Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Total Distance</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">25 km</p>
              </div>
            </div>
          </div>
          
          {/* Average Trip Time Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-yellow-100 p-3">
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 truncate">Avg Trip Time</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">35 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;