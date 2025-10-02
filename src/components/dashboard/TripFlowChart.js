import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { getBookings } from '../../utils/bookingStorage';
// import { deleteTrip, trackLocation } from '../../services/tripService';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function TripFlowChart({ trips: initialTrips }) {
  const [trips, setTrips] = useState(initialTrips);
  const [bookings, setBookings] = useState([]);
  const [showLiveLocation, setShowLiveLocation] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [selectedDangerZone, setSelectedDangerZone] = useState(null);
  const { isAuthenticated } = useUser();
  const mapRef = useRef(null);
  
  // Load bookings on component mount
  useEffect(() => {
    const loadedBookings = getBookings();
    setBookings(loadedBookings);
  }, []);
  
  // Get current position when tracking is enabled
  useEffect(() => {
    let watchId;
    
    if (showLiveLocation && selectedTrip) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          
          // Generate a simulated route for visualization
          generateSimulatedRoute([latitude, longitude], selectedTrip);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your current location. Please check your browser permissions.");
          setShowLiveLocation(false);
        }
      );
      
      // Watch position changes
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error watching location:", error);
        }
      );
    }
    
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [showLiveLocation, selectedTrip]);
  
  // Generate a simulated route for visualization purposes
  const generateSimulatedRoute = (startPosition, trip) => {
    // In a real app, you would fetch the actual route from a routing API
    // For demo purposes, we'll create a simple route with waypoints
    
    // Create destination point (slightly offset from start for demo)
    const destinationLat = startPosition[0] + 0.01;
    const destinationLng = startPosition[1] + 0.01;
    
    // Create some waypoints between start and destination
    const waypoints = [
      startPosition,
      [startPosition[0] + 0.002, startPosition[1] + 0.003],
      [startPosition[0] + 0.005, startPosition[1] + 0.005],
      [startPosition[0] + 0.008, startPosition[1] + 0.008],
      [destinationLat, destinationLng]
    ];
    
    setRoutePoints(waypoints);
  };
  
  const handleDeleteTrip = (tripId) => {
    if (!isAuthenticated()) {
      alert('Please sign in to delete trips');
      return;
    }
    
    // Filter out the deleted trip
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    setTrips(updatedTrips);
    
    // Also remove from bookings in localStorage
    const currentBookings = getBookings();
    const updatedBookings = currentBookings.filter(booking => booking.id !== tripId);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    
    // Also remove from trip packages if it exists there
    const tripPackages = JSON.parse(localStorage.getItem('tripPackages') || '[]');
    const updatedPackages = tripPackages.filter(pkg => pkg.id !== tripId);
    localStorage.setItem('tripPackages', JSON.stringify(updatedPackages));
    
    alert('Trip deleted successfully');
  };
  
  const handleTrackLocation = (tripId) => {
    const trip = [...(trips || []), ...(bookings || [])].find(t => t.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      setShowLiveLocation(true);
      
      // Scroll to map section
      const mapElement = document.getElementById('trip-route-map');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // If no trips are provided, show bookings or a placeholder
  if ((!trips || trips.length === 0) && (!bookings || bookings.length === 0)) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trips</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new trip.</p>
        </div>
      </div>
    );
  }
  
  // Render the live map if tracking is enabled
  if (showLiveLocation && currentPosition) {
    // Sample danger zones data - in a real app, this would come from an API
    const dangerZones = [
      { id: 1, name: 'Construction Site', level: 'high', lat: currentPosition[0] + 0.003, lng: currentPosition[1] + 0.002, description: 'Heavy machinery and construction work in progress.' },
      { id: 2, name: 'Flood Risk Area', level: 'moderate', lat: currentPosition[0] - 0.002, lng: currentPosition[1] + 0.004, description: 'Area prone to flooding during heavy rainfall.' },
      { id: 3, name: 'Traffic Congestion', level: 'moderate', lat: currentPosition[0] + 0.005, lng: currentPosition[1] - 0.003, description: 'Heavy traffic congestion reported in this area.' }
    ];
    
    // Function to render danger zone circles with different radiuses and opacities
    const renderDangerZones = (zone) => {
      const radiuses = [50, 100, 150]; // Smaller circles in meters
      const baseOpacity = zone.level === 'high' ? 0.4 : 0.3;
      
      return radiuses.map((radius, index) => {
        const opacity = baseOpacity - (index * 0.1); // Decrease opacity as radius increases
        
        return (
          <Circle
            key={`${zone.id}-${radius}`}
            center={[zone.lat, zone.lng]}
            radius={radius}
            pathOptions={{
              color: zone.level === 'high' ? '#ef4444' : '#f59e0b',
              fillColor: zone.level === 'high' ? '#ef4444' : '#f59e0b',
              fillOpacity: opacity
            }}
            eventHandlers={{
              click: () => setSelectedDangerZone(zone)
            }}
          />
        );
      });
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Live Trip Tracking: {selectedTrip?.name || (selectedTrip?.from && selectedTrip?.to ? `${selectedTrip.from} → ${selectedTrip.to}` : 'Trip')}
          </h3>
          <button
            onClick={() => setShowLiveLocation(false)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
          >
            Back to Trips
          </button>
        </div>
        
        <div id="trip-route-map" className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setShowLiveLocation(!showLiveLocation)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 shadow-md flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {showLiveLocation ? 'Stop Tracking' : 'Track Route'}
            </button>
          </div>
          <MapContainer 
            center={currentPosition} 
            zoom={14} 
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Current position marker */}
            <Marker position={currentPosition}>
              <Popup>
                Your current location
              </Popup>
            </Marker>
            
            {/* Destination marker (if we have route points) */}
            {routePoints.length > 0 && (
              <Marker position={routePoints[routePoints.length - 1]}>
                <Popup>
                  Destination: {selectedTrip?.to || 'Destination'}
                </Popup>
              </Marker>
            )}
            
            {/* Route line */}
            {routePoints.length > 0 && (
              <Polyline 
                positions={routePoints}
                color="blue"
                weight={5}
                opacity={0.7}
              />
            )}
            
            {/* Danger zones */}
            {dangerZones.map(zone => (
              <React.Fragment key={zone.id}>
                {renderDangerZones(zone)}
                <Marker position={[zone.lat, zone.lng]}>
                  <Popup>
                    <div>
                      <h3 className="font-medium">{zone.name}</h3>
                      <p className="text-sm">{zone.description}</p>
                      <p className="text-xs mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${zone.level === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'} capitalize`}>
                          {zone.level} risk
                        </span>
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}
          </MapContainer>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Trip Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">From:</p>
              <p className="font-medium">{selectedTrip?.from || 'Starting Point'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To:</p>
              <p className="font-medium">{selectedTrip?.to || 'Destination'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Arrival:</p>
              <p className="font-medium">
                {new Date(Date.now() + 20 * 60000).toLocaleTimeString()} 
                <span className="text-sm text-gray-500 ml-1">(~20 min)</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Danger Zone Details Modal */}
        {selectedDangerZone && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-medium text-gray-900">{selectedDangerZone.name}</h3>
                <button 
                  onClick={() => setSelectedDangerZone(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className={`p-3 mb-4 rounded-md ${selectedDangerZone.level === 'high' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${selectedDangerZone.level === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedDangerZone.level === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'} capitalize`}>
                      {selectedDangerZone.level} risk level
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                <p className="text-gray-600">{selectedDangerZone.description}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Safety Tips</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {selectedDangerZone.level === 'high' ? (
                    <>
                      <li>Avoid this area if possible</li>
                      <li>Stay alert and follow safety instructions</li>
                      <li>Consider alternative routes</li>
                    </>
                  ) : (
                    <>
                      <li>Proceed with caution</li>
                      <li>Be aware of your surroundings</li>
                      <li>Follow local guidance</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedDangerZone(null)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // If we have bookings but no trips, show the bookings
  if (!trips || trips.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Bookings</h3>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    {booking.name || (booking.from && booking.to ? `${booking.from} → ${booking.to}` : 'Booking')}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {booking.date} {booking.time && `at ${booking.time}`}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Type: {booking.type || 'Trip'}
                  </p>
                </div>
                <div className="flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => handleTrackLocation(booking.id)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                  >
                    Track
                  </button>
                  {isAuthenticated() && (
                    <button
                      onClick={() => handleDeleteTrip(booking.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Flow Visualization</h3>
      
      {/* Flow chart visualization */}
      <div className="min-w-max">
        <div className="flex flex-col space-y-8">
          {trips.map((trip, index) => (
            <div key={trip.id || index} className="relative">
              {/* Connect trips with lines */}
              {index < trips.length - 1 && (
                <div className="absolute left-6 top-full h-8 w-0.5 bg-gray-300 z-0"></div>
              )}
              
              <div className="flex items-start relative z-10">
                {/* Trip node */}
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-500">
                  <span className="text-primary-700 font-medium">{index + 1}</span>
                </div>
                
                {/* Trip details card */}
                <div className="ml-4 flex-grow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">
                          {trip.origin} → {trip.destination}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(trip.originTime).toLocaleString()} - {new Date(trip.destinationTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {trip.mode}
                        </span>
                        <button
                          onClick={() => handleTrackLocation(trip.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200"
                        >
                          Track
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {trip.purpose && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-700">Purpose: </span>
                        <span className="text-sm font-medium text-gray-900 capitalize">{trip.purpose}</span>
                      </div>
                    )}
                    
                    {trip.accompaniedBy && trip.accompaniedBy.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-700">Accompanied by: </span>
                        <span className="text-sm font-medium text-gray-900">
                          {trip.accompaniedBy.map(person => person.name).join(', ')}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-end space-x-2">
                      <button 
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Edit
                      </button>
                      <button 
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TripFlowChart;