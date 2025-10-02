import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getBookings, updateBookingStatus } from '../utils/bookingStorage';


// Comprehensive global countries and major cities/states data
const globalLocations = {
  // Major Countries
  'United States': { lat: 39.8283, lng: -98.5795, type: 'country' },
  'Canada': { lat: 56.1304, lng: -106.3468, type: 'country' },
  'United Kingdom': { lat: 55.3781, lng: -3.4360, type: 'country' },
  'Germany': { lat: 51.1657, lng: 10.4515, type: 'country' },
  'France': { lat: 46.2276, lng: 2.2137, type: 'country' },
  'Italy': { lat: 41.8719, lng: 12.5674, type: 'country' },
  'Spain': { lat: 40.4637, lng: -3.7492, type: 'country' },
  'Australia': { lat: -25.2744, lng: 133.7751, type: 'country' },
  'Japan': { lat: 36.2048, lng: 138.2529, type: 'country' },
  'China': { lat: 35.8617, lng: 104.1954, type: 'country' },
  'Brazil': { lat: -14.2350, lng: -51.9253, type: 'country' },
  'Russia': { lat: 61.5240, lng: 105.3188, type: 'country' },
  'India': { lat: 20.5937, lng: 78.9629, type: 'country' },
  'Mexico': { lat: 23.6345, lng: -102.5528, type: 'country' },
  'South Korea': { lat: 35.9078, lng: 127.7669, type: 'country' },
  'Thailand': { lat: 15.8700, lng: 100.9925, type: 'country' },
  'Singapore': { lat: 1.3521, lng: 103.8198, type: 'country' },
  'Malaysia': { lat: 4.2105, lng: 101.9758, type: 'country' },
  'Indonesia': { lat: -0.7893, lng: 113.9213, type: 'country' },
  'Philippines': { lat: 12.8797, lng: 121.7740, type: 'country' },
  'Vietnam': { lat: 14.0583, lng: 108.2772, type: 'country' },
  'Turkey': { lat: 38.9637, lng: 35.2433, type: 'country' },
  'Egypt': { lat: 26.0975, lng: 30.0444, type: 'country' },
  'South Africa': { lat: -30.5595, lng: 22.9375, type: 'country' },
  'Nigeria': { lat: 9.0820, lng: 8.6753, type: 'country' },
  'Kenya': { lat: -0.0236, lng: 37.9062, type: 'country' },
  'Argentina': { lat: -38.4161, lng: -63.6167, type: 'country' },
  'Chile': { lat: -35.6751, lng: -71.5430, type: 'country' },
  'Colombia': { lat: 4.5709, lng: -74.2973, type: 'country' },
  'Peru': { lat: -9.1900, lng: -75.0152, type: 'country' },
  'Venezuela': { lat: 6.4238, lng: -66.5897, type: 'country' },
  
  // Major US States
  'California': { lat: 36.7783, lng: -119.4179, type: 'state' },
  'Texas': { lat: 31.9686, lng: -99.9018, type: 'state' },
  'Florida': { lat: 27.7663, lng: -82.6404, type: 'state' },
  'New York': { lat: 43.2994, lng: -74.2179, type: 'state' },
  'Illinois': { lat: 40.6331, lng: -89.3985, type: 'state' },
  'Pennsylvania': { lat: 41.2033, lng: -77.1945, type: 'state' },
  'Ohio': { lat: 40.3888, lng: -82.7649, type: 'state' },
  'Georgia': { lat: 32.1656, lng: -82.9001, type: 'state' },
  'North Carolina': { lat: 35.5397, lng: -79.8431, type: 'state' },
  'Michigan': { lat: 44.3148, lng: -85.6024, type: 'state' },
  
  // Major Indian Cities/States
  'Delhi': { lat: 28.6139, lng: 77.209, type: 'city' },
  'Mumbai': { lat: 19.076, lng: 72.8777, type: 'city' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, type: 'city' },
  'Chennai': { lat: 13.0827, lng: 80.2707, type: 'city' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, type: 'city' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, type: 'city' },
  'Pune': { lat: 18.5204, lng: 73.8567, type: 'city' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, type: 'city' },
  'Jaipur': { lat: 26.9124, lng: 75.7873, type: 'city' },
  'Gurugram': { lat: 28.4595, lng: 77.0266, type: 'city' },
  'Andheri': { lat: 19.1197, lng: 72.8468, type: 'city' },
  'Bandra': { lat: 19.0606, lng: 72.8365, type: 'city' },
  'Whitefield': { lat: 12.9698, lng: 77.7499, type: 'city' },
  'Indiranagar': { lat: 12.9784, lng: 77.6408, type: 'city' },
  'Connaught Place': { lat: 28.6315, lng: 77.2167, type: 'city' },
  'Cyber City': { lat: 28.4946, lng: 77.0882, type: 'city' },
  
  // Major Global Cities
  'New York City': { lat: 40.7128, lng: -74.0060, type: 'city' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, type: 'city' },
  'Chicago': { lat: 41.8781, lng: -87.6298, type: 'city' },
  'Houston': { lat: 29.7604, lng: -95.3698, type: 'city' },
  'Phoenix': { lat: 33.4484, lng: -112.0740, type: 'city' },
  'Philadelphia': { lat: 39.9526, lng: -75.1652, type: 'city' },
  'San Antonio': { lat: 29.4241, lng: -98.4936, type: 'city' },
  'San Diego': { lat: 32.7157, lng: -117.1611, type: 'city' },
  'Dallas': { lat: 32.7767, lng: -96.7970, type: 'city' },
  'San Jose': { lat: 37.3382, lng: -121.8863, type: 'city' },
  'London': { lat: 51.5074, lng: -0.1278, type: 'city' },
  'Paris': { lat: 48.8566, lng: 2.3522, type: 'city' },
  'Berlin': { lat: 52.5200, lng: 13.4050, type: 'city' },
  'Madrid': { lat: 40.4168, lng: -3.7038, type: 'city' },
  'Rome': { lat: 41.9028, lng: 12.4964, type: 'city' },
  'Amsterdam': { lat: 52.3676, lng: 4.9041, type: 'city' },
  'Vienna': { lat: 48.2082, lng: 16.3738, type: 'city' },
  'Prague': { lat: 50.0755, lng: 14.4378, type: 'city' },
  'Warsaw': { lat: 52.2297, lng: 21.0122, type: 'city' },
  'Budapest': { lat: 47.4979, lng: 19.0402, type: 'city' },
  'Stockholm': { lat: 59.3293, lng: 18.0686, type: 'city' },
  'Oslo': { lat: 59.9139, lng: 10.7522, type: 'city' },
  'Copenhagen': { lat: 55.6761, lng: 12.5683, type: 'city' },
  'Helsinki': { lat: 60.1699, lng: 24.9384, type: 'city' },
  'Tokyo': { lat: 35.6762, lng: 139.6503, type: 'city' },
  'Osaka': { lat: 34.6937, lng: 135.5023, type: 'city' },
  'Kyoto': { lat: 35.0116, lng: 135.7681, type: 'city' },
  'Seoul': { lat: 37.5665, lng: 126.9780, type: 'city' },
  'Busan': { lat: 35.1796, lng: 129.0756, type: 'city' },
  'Beijing': { lat: 39.9042, lng: 116.4074, type: 'city' },
  'Shanghai': { lat: 31.2304, lng: 121.4737, type: 'city' },
  'Hong Kong': { lat: 22.3193, lng: 114.1694, type: 'city' },
  'Taipei': { lat: 25.0330, lng: 121.5654, type: 'city' },
  'Bangkok': { lat: 13.7563, lng: 100.5018, type: 'city' },
  'Sydney': { lat: -33.8688, lng: 151.2093, type: 'city' },
  'Melbourne': { lat: -37.8136, lng: 144.9631, type: 'city' },
  'Brisbane': { lat: -27.4698, lng: 153.0251, type: 'city' },
  'Perth': { lat: -31.9505, lng: 115.8605, type: 'city' },
  'Auckland': { lat: -36.8485, lng: 174.7633, type: 'city' },
  'Wellington': { lat: -41.2865, lng: 174.7762, type: 'city' },
  'Cairo': { lat: 30.0444, lng: 31.2357, type: 'city' },
  'Cape Town': { lat: -33.9249, lng: 18.4241, type: 'city' },
  'Johannesburg': { lat: -26.2041, lng: 28.0473, type: 'city' },
  'Nairobi': { lat: -1.2921, lng: 36.8219, type: 'city' },
  'Lagos': { lat: 6.5244, lng: 3.3792, type: 'city' },
  'Casablanca': { lat: 33.5731, lng: -7.5898, type: 'city' },
  'Tel Aviv': { lat: 32.0853, lng: 34.7818, type: 'city' },
  'Dubai': { lat: 25.2048, lng: 55.2708, type: 'city' },
  'Abu Dhabi': { lat: 24.4539, lng: 54.3773, type: 'city' },
  'Riyadh': { lat: 24.7136, lng: 46.6753, type: 'city' },
  'Jeddah': { lat: 21.4858, lng: 39.1925, type: 'city' },
  'Istanbul': { lat: 41.0082, lng: 28.9784, type: 'city' },
  'Ankara': { lat: 39.9334, lng: 32.8597, type: 'city' },
  'Tehran': { lat: 35.6892, lng: 51.3890, type: 'city' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, type: 'city' },
  'Buenos Aires': { lat: -34.6118, lng: -58.3960, type: 'city' },
  'Santiago': { lat: -33.4489, lng: -70.6693, type: 'city' },
  'Lima': { lat: -12.0464, lng: -77.0428, type: 'city' },
  'Bogotá': { lat: 4.7110, lng: -74.0721, type: 'city' },
  'Caracas': { lat: 10.4806, lng: -66.9036, type: 'city' },
  'Mexico City': { lat: 19.4326, lng: -99.1332, type: 'city' },
  'Guadalajara': { lat: 20.6597, lng: -103.3496, type: 'city' },
  'Monterrey': { lat: 25.6866, lng: -100.3161, type: 'city' },
  'Toronto': { lat: 43.6532, lng: -79.3832, type: 'city' },
  'Vancouver': { lat: 49.2827, lng: -123.1207, type: 'city' },
  'Montreal': { lat: 45.5017, lng: -73.5673, type: 'city' },
  'Ottawa': { lat: 45.4215, lng: -75.6972, type: 'city' },
  'Calgary': { lat: 51.0447, lng: -114.0719, type: 'city' }
};

function TripHeatmapMap({ tripDataList, temperatureData, isUpdating, lastUpdateTime, currentLocation, locationWeather, searchedLocation, searchedLocationWeather, isTrackingLocation }) {
  // Count trips by city/area (origin)
  const cityCounts = {};
  tripDataList.forEach(trip => {
    // Try to extract city/area from origin string
    let found = false;
    Object.keys(globalLocations).forEach(location => {
      if (trip.origin && trip.origin.includes(location)) {
        cityCounts[location] = (cityCounts[location] || 0) + 1;
        found = true;
      }
    });
    // Optionally, handle unknowns
    if (!found && trip.origin) {
      cityCounts['Other'] = (cityCounts['Other'] || 0) + 1;
    }
  });

  // Convert to points for map with temperature data - show ALL locations
  const points = Object.entries(globalLocations).map(([location, coords]) => {
    const count = cityCounts[location] || 0; // Default to 0 if no trips
    const temp = temperatureData[location] || { temp: 20, condition: 'Pleasant', humidity: 65, windSpeed: 8 };
    return { 
      ...coords, 
      count, 
      city: location, 
      temperature: temp.temp, 
      condition: temp.condition,
      humidity: temp.humidity,
      windSpeed: temp.windSpeed
    };
  });

  // Get temperature-based color for markers
  const getTemperatureColor = (temp) => {
    if (temp >= 35) return { color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.7 }; // Very Hot - Red
    if (temp >= 30) return { color: '#ea580c', fillColor: '#f97316', fillOpacity: 0.6 }; // Hot - Orange
    if (temp >= 25) return { color: '#ca8a04', fillColor: '#eab308', fillOpacity: 0.5 }; // Warm - Yellow
    if (temp >= 20) return { color: '#16a34a', fillColor: '#22c55e', fillOpacity: 0.4 }; // Pleasant - Green
    return { color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.3 }; // Cool - Blue
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border mb-6 relative">
      <style jsx>{`
        .temperature-tooltip {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          backdrop-filter: blur(10px) !important;
        }
        .temperature-tooltip .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 8px !important;
        }
        .temperature-tooltip .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
        }
        .temperature-tooltip .leaflet-popup-tip-container {
          display: none !important;
        }
      `}</style>
      {/* Status Bar */}
      <div className="absolute top-2 left-2 z-50 bg-white bg-opacity-90 rounded-lg px-3 py-2 shadow-md">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-xs font-medium text-gray-700">
            {isUpdating ? 'Updating weather...' : 'Live Weather Data'}
          </span>
          {lastUpdateTime && (
            <span className="text-xs text-gray-500 ml-2">
              Last update: {lastUpdateTime.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      <MapContainer 
        center={currentLocation && isTrackingLocation ? [currentLocation.lat, currentLocation.lng] : searchedLocation ? [searchedLocation.lat, searchedLocation.lng] : [20, 0]} 
        zoom={currentLocation && isTrackingLocation ? 12 : searchedLocation ? 8 : 2} 
        style={{ height: '100%', width: '100%' }} 
        scrollWheelZoom={true}
        key={currentLocation && isTrackingLocation ? `${currentLocation.lat}-${currentLocation.lng}` : searchedLocation ? `${searchedLocation.lat}-${searchedLocation.lng}` : 'default-center'}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point, idx) => {
          const pathOptions = getTemperatureColor(point.temperature);
          return (
            <CircleMarker
              key={idx}
              center={[point.lat, point.lng]}
              radius={Math.max(8, Math.min(25, 8 + point.count * 1.5))}
              pathOptions={pathOptions}
            >
              <Tooltip 
                direction="top" 
                offset={[0, -10]} 
                opacity={1} 
                permanent
                className="temperature-tooltip"
              >
                <div className="text-center min-w-[140px] bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                  <div className="font-bold text-gray-900 text-sm mb-1">{point.city}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    {point.count > 0 ? `${point.count} trip${point.count > 1 ? 's' : ''}` : 'No trips'}
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">{point.temperature}°C</span>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {point.condition}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <span className="mr-1">💧</span>
                      <span>{point.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">💨</span>
                      <span>{point.windSpeed}m/s</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                    🔄 Live Weather Data
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
        
        {/* Current Location Marker */}
        {currentLocation && (
          <CircleMarker
            center={[currentLocation.lat, currentLocation.lng]}
            radius={15}
            pathOptions={{
              color: '#ff0000',
              fillColor: '#ff4444',
              fillOpacity: 0.8
            }}
          >
            <Tooltip 
              direction="top" 
              offset={[0, -10]} 
              opacity={1} 
              permanent
              className="temperature-tooltip"
            >
              <div className="text-center min-w-[160px] bg-white rounded-lg shadow-lg p-3 border border-red-200">
                <div className="font-bold text-red-600 text-sm mb-1">📍 Your Location</div>
                {locationWeather && (
                  <>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-red-600">{locationWeather.temp}°C</span>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {locationWeather.condition}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-1">💧</span>
                        <span>{locationWeather.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">💨</span>
                        <span>{locationWeather.windSpeed}m/s</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                      🔄 Live Location Weather
                    </div>
                  </>
                )}
                {!locationWeather && (
                  <div className="text-xs text-gray-500">
                    Loading weather...
                  </div>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        )}

        {/* Searched Location Marker */}
        {searchedLocation && (
          <CircleMarker
            center={[searchedLocation.lat, searchedLocation.lng]}
            radius={18}
            pathOptions={{
              color: '#8b5cf6',
              fillColor: '#a855f7',
              fillOpacity: 0.8
            }}
          >
            <Tooltip 
              direction="top" 
              offset={[0, -10]} 
              opacity={1} 
              permanent
              className="temperature-tooltip"
            >
              <div className="text-center min-w-[160px] bg-white rounded-lg shadow-lg p-3 border border-purple-200">
                <div className="font-bold text-purple-600 text-sm mb-1">🔍 Searched Location</div>
                <div className="text-xs text-gray-600 mb-2 truncate" style={{maxWidth: '200px'}}>
                  {searchedLocation.displayName || searchedLocation.locationName}
                </div>
                {searchedLocationWeather && (
                  <>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-purple-600">{searchedLocationWeather.temp}°C</span>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {searchedLocationWeather.condition}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-1">💧</span>
                        <span>{searchedLocationWeather.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">💨</span>
                        <span>{searchedLocationWeather.windSpeed}m/s</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                      🔄 Auto-updating every 60s
                    </div>
                  </>
                )}
                {!searchedLocationWeather && (
                  <div className="text-xs text-gray-500">
                    Loading weather...
                  </div>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}


function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dateRange, setDateRange] = useState('week');
  const [exportFormat, setExportFormat] = useState('csv');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Load bookings when the dashboard tab is active
    if (activeTab === 'dashboard' || activeTab === 'bookings') {
      setBookings(getBookings());
    }
  }, [activeTab]);
  
  // Trip data collection state
  const [tripDetails, setTripDetails] = useState({
    origin: '',
    destination: '',
    startTime: '',
    endTime: '',
    mode: 'car',
    purpose: 'work',
    accompaniedBy: 0,
    consentGiven: false
  });
  const [detailedTripData, setDetailedTripData] = useState([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  
  // Admin credentials with organization-provided authentication
  const adminCredentials = [
    { email: 'admin@natpac.org', password: 'natpac123', organization: 'NATPAC', role: 'Administrator' },
    { email: 'manager@natpac.org', password: 'manager456', organization: 'NATPAC', role: 'Manager' },
    { email: 'analyst@natpac.org', password: 'analyst789', organization: 'NATPAC', role: 'Data Analyst' },
    { email: 'admintravell5525@gmail.com', password: 'admin55@55travell', organization: 'NATPAC', role: 'Super Administrator' }
  ];
  
  // User organization state
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  
  // Sample trip data for visualization
  const tripData = {
    totalTrips: 12458,
    activeUsers: 3245,
    averageTripLength: 8.7,
    popularModes: [
      { mode: 'Car', percentage: 45 },
      { mode: 'Public Transit', percentage: 30 },
      { mode: 'Walking', percentage: 15 },
      { mode: 'Cycling', percentage: 10 }
    ],
    tripsByDay: [
      { day: 'Mon', count: 1850 },
      { day: 'Tue', count: 2100 },
      { day: 'Wed', count: 1950 },
      { day: 'Thu', count: 2300 },
      { day: 'Fri', count: 2450 },
      { day: 'Sat', count: 1200 },
      { day: 'Sun', count: 950 }
    ],
    tripsByWeek: [
      { week: 'Week 1', count: 8500 },
      { week: 'Week 2', count: 9200 },
      { week: 'Week 3', count: 7800 },
      { week: 'Week 4', count: 8900 }
    ],
    peakHours: [
      { hour: '7-8 AM', count: 1250 },
      { hour: '8-9 AM', count: 1850 },
      { hour: '5-6 PM', count: 1650 },
      { hour: '6-7 PM', count: 1450 }
    ],
    popularDestinations: [
      { name: 'Central Business District', count: 3250 },
      { name: 'University Area', count: 2100 },
      { name: 'Shopping Mall', count: 1850 },
      { name: 'Tech Park', count: 1650 },
      { name: 'Airport', count: 950 }
    ]
  };
  
  // Sample user data
  const userData = [
    { id: 1, userId: 'U78945', age: '25-34', gender: 'Female', tripCount: 37, avgDistance: 12.5, mostUsedMode: 'Car' },
    { id: 2, userId: 'U23456', age: '18-24', gender: 'Male', tripCount: 42, avgDistance: 8.3, mostUsedMode: 'Public Transit' },
    { id: 3, userId: 'U34567', age: '35-44', gender: 'Female', tripCount: 28, avgDistance: 15.7, mostUsedMode: 'Car' },
    { id: 4, userId: 'U45678', age: '25-34', gender: 'Male', tripCount: 53, avgDistance: 5.2, mostUsedMode: 'Cycling' },
    { id: 5, userId: 'U56789', age: '45-54', gender: 'Female', tripCount: 19, avgDistance: 18.9, mostUsedMode: 'Car' },
    { id: 6, userId: 'U67890', age: '18-24', gender: 'Non-binary', tripCount: 31, avgDistance: 7.6, mostUsedMode: 'Public Transit' },
    { id: 7, userId: 'U78901', age: '55-64', gender: 'Male', tripCount: 15, avgDistance: 22.3, mostUsedMode: 'Car' },
    { id: 8, userId: 'U89012', age: '25-34', gender: 'Female', tripCount: 47, avgDistance: 9.1, mostUsedMode: 'Walking' }
  ];
  
  // Sample detailed trip data with enhanced information
  const initialTripData = [
    {
      id: 'T1001',
      userId: 'U5432',
      username: 'rahul_sharma',
      origin: 'Connaught Place, Delhi',
      destination: 'Cyber City, Gurugram',
      startTime: '2023-09-15T08:30:00',
      endTime: '2023-09-15T09:45:00',
      mode: 'Car',
      distance: 28.5,
      duration: 75,
      accompaniedBy: 2,
      purpose: 'Work',
      consentGiven: true,
      automaticallyDetected: true
    },
    {
      id: 'T1002',
      userId: 'U2187',
      username: 'priya_patel',
      origin: 'Indiranagar, Bangalore',
      destination: 'Whitefield, Bangalore',
      startTime: '2023-09-15T09:15:00',
      endTime: '2023-09-15T10:30:00',
      mode: 'Bus',
      distance: 15.2,
      duration: 75,
      accompaniedBy: 0,
      purpose: 'Work',
      consentGiven: true,
      automaticallyDetected: false
    },
    {
      id: 'T1003',
      userId: 'U7891',
      username: 'amit_kumar',
      origin: 'Andheri, Mumbai',
      destination: 'Bandra, Mumbai',
      startTime: '2023-09-15T18:00:00',
      endTime: '2023-09-15T18:45:00',
      mode: 'Train',
      distance: 8.7,
      duration: 45,
      accompaniedBy: 1,
      purpose: 'Shopping',
      consentGiven: true,
      automaticallyDetected: true
    }
  ];
  
  // Initialize detailed trip data
  useEffect(() => {
    setDetailedTripData(initialTripData);
  }, []);

  // Weather update tracking state
  const [isUpdatingWeather, setIsUpdatingWeather] = useState(false);
  const [lastWeatherUpdate, setLastWeatherUpdate] = useState(new Date());

  // Location tracking state
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationWeather, setLocationWeather] = useState(null);
  const [locationWatchId, setLocationWatchId] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [searchedLocationWeather, setSearchedLocationWeather] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchIntervalId, setSearchIntervalId] = useState(null);

  // Temperature data state
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  // Comprehensive temperature data for all global locations
  const [temperatureData, setTemperatureData] = useState({
    // Countries
    'United States': { temp: 15, condition: 'Cool', humidity: 60, windSpeed: 8 },
    'Canada': { temp: 8, condition: 'Cold', humidity: 70, windSpeed: 12 },
    'United Kingdom': { temp: 12, condition: 'Cool', humidity: 75, windSpeed: 10 },
    'Germany': { temp: 10, condition: 'Cool', humidity: 65, windSpeed: 9 },
    'France': { temp: 14, condition: 'Mild', humidity: 68, windSpeed: 7 },
    'Italy': { temp: 16, condition: 'Mild', humidity: 62, windSpeed: 6 },
    'Spain': { temp: 18, condition: 'Warm', humidity: 58, windSpeed: 8 },
    'Australia': { temp: 22, condition: 'Pleasant', humidity: 55, windSpeed: 11 },
    'Japan': { temp: 13, condition: 'Cool', humidity: 72, windSpeed: 9 },
    'China': { temp: 11, condition: 'Cool', humidity: 64, windSpeed: 7 },
    'Brazil': { temp: 26, condition: 'Warm', humidity: 78, windSpeed: 5 },
    'Russia': { temp: 2, condition: 'Very Cold', humidity: 80, windSpeed: 15 },
    'India': { temp: 28, condition: 'Warm', humidity: 70, windSpeed: 6 },
    'Mexico': { temp: 20, condition: 'Pleasant', humidity: 65, windSpeed: 8 },
    'South Korea': { temp: 12, condition: 'Cool', humidity: 68, windSpeed: 10 },
    'Thailand': { temp: 30, condition: 'Hot', humidity: 82, windSpeed: 4 },
    'Singapore': { temp: 29, condition: 'Hot', humidity: 85, windSpeed: 3 },
    'Malaysia': { temp: 28, condition: 'Warm', humidity: 80, windSpeed: 5 },
    'Indonesia': { temp: 27, condition: 'Warm', humidity: 83, windSpeed: 4 },
    'Philippines': { temp: 28, condition: 'Warm', humidity: 81, windSpeed: 6 },
    'Vietnam': { temp: 26, condition: 'Warm', humidity: 78, windSpeed: 5 },
    'Turkey': { temp: 15, condition: 'Cool', humidity: 62, windSpeed: 8 },
    'Egypt': { temp: 25, condition: 'Warm', humidity: 55, windSpeed: 7 },
    'South Africa': { temp: 18, condition: 'Mild', humidity: 60, windSpeed: 9 },
    'Nigeria': { temp: 30, condition: 'Hot', humidity: 75, windSpeed: 6 },
    'Kenya': { temp: 22, condition: 'Pleasant', humidity: 68, windSpeed: 8 },
    'Argentina': { temp: 16, condition: 'Mild', humidity: 65, windSpeed: 12 },
    'Chile': { temp: 14, condition: 'Cool', humidity: 70, windSpeed: 14 },
    'Colombia': { temp: 24, condition: 'Pleasant', humidity: 72, windSpeed: 7 },
    'Peru': { temp: 20, condition: 'Pleasant', humidity: 68, windSpeed: 9 },
    'Venezuela': { temp: 28, condition: 'Warm', humidity: 76, windSpeed: 5 },
    
    // US States
    'California': { temp: 18, condition: 'Mild', humidity: 60, windSpeed: 10 },
    'Texas': { temp: 22, condition: 'Pleasant', humidity: 65, windSpeed: 12 },
    'Florida': { temp: 25, condition: 'Warm', humidity: 78, windSpeed: 8 },
    'New York': { temp: 12, condition: 'Cool', humidity: 68, windSpeed: 11 },
    'Illinois': { temp: 10, condition: 'Cool', humidity: 70, windSpeed: 13 },
    'Pennsylvania': { temp: 11, condition: 'Cool', humidity: 69, windSpeed: 10 },
    'Ohio': { temp: 9, condition: 'Cool', humidity: 71, windSpeed: 12 },
    'Georgia': { temp: 20, condition: 'Pleasant', humidity: 72, windSpeed: 9 },
    'North Carolina': { temp: 17, condition: 'Cool', humidity: 70, windSpeed: 10 },
    'Michigan': { temp: 6, condition: 'Cold', humidity: 75, windSpeed: 14 },
    
    // Indian Cities
    'Delhi': { temp: 32, condition: 'Hot', humidity: 65, windSpeed: 5 },
    'Mumbai': { temp: 28, condition: 'Humid', humidity: 78, windSpeed: 7 },
    'Bangalore': { temp: 24, condition: 'Pleasant', humidity: 68, windSpeed: 8 },
    'Chennai': { temp: 30, condition: 'Warm', humidity: 80, windSpeed: 6 },
    'Kolkata': { temp: 29, condition: 'Humid', humidity: 75, windSpeed: 6 },
    'Hyderabad': { temp: 31, condition: 'Hot', humidity: 70, windSpeed: 7 },
    'Pune': { temp: 26, condition: 'Nice', humidity: 62, windSpeed: 8 },
    'Ahmedabad': { temp: 33, condition: 'Very Hot', humidity: 60, windSpeed: 9 },
    'Jaipur': { temp: 34, condition: 'Very Hot', humidity: 55, windSpeed: 8 },
    'Gurugram': { temp: 31, condition: 'Hot', humidity: 63, windSpeed: 6 },
    'Andheri': { temp: 28, condition: 'Humid', humidity: 76, windSpeed: 7 },
    'Bandra': { temp: 28, condition: 'Humid', humidity: 77, windSpeed: 6 },
    'Whitefield': { temp: 24, condition: 'Pleasant', humidity: 69, windSpeed: 8 },
    'Indiranagar': { temp: 24, condition: 'Pleasant', humidity: 67, windSpeed: 7 },
    'Connaught Place': { temp: 32, condition: 'Hot', humidity: 64, windSpeed: 5 },
    'Cyber City': { temp: 31, condition: 'Hot', humidity: 62, windSpeed: 6 },
    
    // Major Global Cities
    'New York City': { temp: 13, condition: 'Cool', humidity: 66, windSpeed: 12 },
    'Los Angeles': { temp: 20, condition: 'Pleasant', humidity: 58, windSpeed: 9 },
    'Chicago': { temp: 8, condition: 'Cold', humidity: 72, windSpeed: 15 },
    'Houston': { temp: 24, condition: 'Warm', humidity: 73, windSpeed: 8 },
    'Phoenix': { temp: 28, condition: 'Warm', humidity: 35, windSpeed: 7 },
    'Philadelphia': { temp: 12, condition: 'Cool', humidity: 67, windSpeed: 11 },
    'San Antonio': { temp: 23, condition: 'Pleasant', humidity: 70, windSpeed: 9 },
    'San Diego': { temp: 19, condition: 'Mild', humidity: 65, windSpeed: 8 },
    'Dallas': { temp: 21, condition: 'Pleasant', humidity: 68, windSpeed: 11 },
    'San Jose': { temp: 16, condition: 'Cool', humidity: 63, windSpeed: 10 },
    'London': { temp: 11, condition: 'Cool', humidity: 78, windSpeed: 13 },
    'Paris': { temp: 13, condition: 'Cool', humidity: 71, windSpeed: 9 },
    'Berlin': { temp: 9, condition: 'Cool', humidity: 73, windSpeed: 12 },
    'Madrid': { temp: 15, condition: 'Cool', humidity: 60, windSpeed: 8 },
    'Rome': { temp: 16, condition: 'Mild', humidity: 68, windSpeed: 7 },
    'Amsterdam': { temp: 10, condition: 'Cool', humidity: 80, windSpeed: 14 },
    'Vienna': { temp: 8, condition: 'Cold', humidity: 75, windSpeed: 11 },
    'Prague': { temp: 7, condition: 'Cold', humidity: 77, windSpeed: 10 },
    'Warsaw': { temp: 5, condition: 'Very Cold', humidity: 82, windSpeed: 13 },
    'Budapest': { temp: 9, condition: 'Cool', humidity: 74, windSpeed: 9 },
    'Stockholm': { temp: 3, condition: 'Very Cold', humidity: 85, windSpeed: 16 },
    'Oslo': { temp: 1, condition: 'Very Cold', humidity: 88, windSpeed: 18 },
    'Copenhagen': { temp: 6, condition: 'Cold', humidity: 81, windSpeed: 15 },
    'Helsinki': { temp: 2, condition: 'Very Cold', humidity: 87, windSpeed: 17 },
    'Tokyo': { temp: 14, condition: 'Cool', humidity: 70, windSpeed: 11 },
    'Osaka': { temp: 15, condition: 'Cool', humidity: 68, windSpeed: 9 },
    'Kyoto': { temp: 13, condition: 'Cool', humidity: 72, windSpeed: 8 },
    'Seoul': { temp: 10, condition: 'Cool', humidity: 65, windSpeed: 12 },
    'Busan': { temp: 12, condition: 'Cool', humidity: 66, windSpeed: 10 },
    'Beijing': { temp: 8, condition: 'Cold', humidity: 58, windSpeed: 9 },
    'Shanghai': { temp: 12, condition: 'Cool', humidity: 71, windSpeed: 8 },
    'Hong Kong': { temp: 22, condition: 'Pleasant', humidity: 75, windSpeed: 6 },
    'Taipei': { temp: 20, condition: 'Pleasant', humidity: 73, windSpeed: 7 },
    'Bangkok': { temp: 31, condition: 'Hot', humidity: 84, windSpeed: 3 },
    'Sydney': { temp: 22, condition: 'Pleasant', humidity: 62, windSpeed: 13 },
    'Melbourne': { temp: 18, condition: 'Mild', humidity: 65, windSpeed: 15 },
    'Brisbane': { temp: 24, condition: 'Pleasant', humidity: 68, windSpeed: 11 },
    'Perth': { temp: 21, condition: 'Pleasant', humidity: 58, windSpeed: 14 },
    'Auckland': { temp: 16, condition: 'Cool', humidity: 75, windSpeed: 12 },
    'Wellington': { temp: 13, condition: 'Cool', humidity: 78, windSpeed: 18 },
    'Cairo': { temp: 24, condition: 'Pleasant', humidity: 48, windSpeed: 8 },
    'Cape Town': { temp: 19, condition: 'Mild', humidity: 65, windSpeed: 11 },
    'Johannesburg': { temp: 17, condition: 'Cool', humidity: 62, windSpeed: 10 },
    'Nairobi': { temp: 20, condition: 'Pleasant', humidity: 70, windSpeed: 9 },
    'Lagos': { temp: 31, condition: 'Hot', humidity: 78, windSpeed: 5 },
    'Casablanca': { temp: 18, condition: 'Mild', humidity: 72, windSpeed: 12 },
    'Tel Aviv': { temp: 21, condition: 'Pleasant', humidity: 68, windSpeed: 10 },
    'Dubai': { temp: 32, condition: 'Very Hot', humidity: 60, windSpeed: 7 },
    'Abu Dhabi': { temp: 33, condition: 'Very Hot', humidity: 58, windSpeed: 8 },
    'Riyadh': { temp: 35, condition: 'Very Hot', humidity: 25, windSpeed: 9 },
    'Jeddah': { temp: 33, condition: 'Very Hot', humidity: 65, windSpeed: 8 },
    'Istanbul': { temp: 14, condition: 'Cool', humidity: 70, windSpeed: 11 },
    'Ankara': { temp: 11, condition: 'Cool', humidity: 68, windSpeed: 10 },
    'Tehran': { temp: 12, condition: 'Cool', humidity: 52, windSpeed: 8 },
    'Buenos Aires': { temp: 17, condition: 'Cool', humidity: 72, windSpeed: 13 },
    'Santiago': { temp: 14, condition: 'Cool', humidity: 65, windSpeed: 10 },
    'Lima': { temp: 19, condition: 'Mild', humidity: 78, windSpeed: 9 },
    'Bogotá': { temp: 14, condition: 'Cool', humidity: 75, windSpeed: 8 },
    'Caracas': { temp: 26, condition: 'Warm', humidity: 73, windSpeed: 6 },
    'Mexico City': { temp: 16, condition: 'Cool', humidity: 56, windSpeed: 7 },
    'Guadalajara': { temp: 20, condition: 'Pleasant', humidity: 60, windSpeed: 8 },
    'Monterrey': { temp: 22, condition: 'Pleasant', humidity: 62, windSpeed: 10 },
    'Toronto': { temp: 7, condition: 'Cold', humidity: 74, windSpeed: 14 },
    'Vancouver': { temp: 9, condition: 'Cool', humidity: 78, windSpeed: 12 },
    'Montreal': { temp: 5, condition: 'Very Cold', humidity: 76, windSpeed: 15 },
    'Ottawa': { temp: 4, condition: 'Very Cold', humidity: 78, windSpeed: 16 },
    'Calgary': { temp: 2, condition: 'Very Cold', humidity: 68, windSpeed: 18 },
    
    // Default for any other location
    'Other': { temp: 20, condition: 'Pleasant', humidity: 65, windSpeed: 8 }
  });

  // Function to fetch real weather data from OpenWeatherMap API
  const fetchRealWeatherData = useCallback(async () => {
    setIsUpdatingWeather(true);
    const cities = {
      // Major global cities for comprehensive coverage
      'New York': { lat: 40.7128, lon: -74.0060 },
      'Los Angeles': { lat: 34.0522, lon: -118.2437 },
      'Chicago': { lat: 41.8781, lon: -87.6298 },
      'London': { lat: 51.5074, lon: -0.1278 },
      'Paris': { lat: 48.8566, lon: 2.3522 },
      'Berlin': { lat: 52.5200, lon: 13.4050 },
      'Tokyo': { lat: 35.6762, lon: 139.6503 },
      'Beijing': { lat: 39.9042, lon: 116.4074 },
      'Sydney': { lat: -33.8688, lon: 151.2093 },
      'Mumbai': { lat: 19.076, lon: 72.8777 },
      'Delhi': { lat: 28.6139, lon: 77.209 },
      'Bangalore': { lat: 12.9716, lon: 77.5946 },
      'São Paulo': { lat: -23.5505, lon: -46.6333 },
      'Buenos Aires': { lat: -34.6037, lon: -58.3816 },
      'Cairo': { lat: 30.0444, lon: 31.2357 },
      'Cape Town': { lat: -33.9249, lon: 18.4241 },
      'Dubai': { lat: 25.2048, lon: 55.2708 },
      'Singapore': { lat: 1.3521, lon: 103.8198 },
      'Hong Kong': { lat: 22.3193, lon: 114.1694 },
      'Toronto': { lat: 43.6532, lon: -79.3832 },
      'Mexico City': { lat: 19.4326, lon: -99.1332 }
    };

    const apiKey = 'demo_key'; // Using demo key for development
    const newTemperatureData = { ...temperatureData };

    try {
      // Fetch weather data for all cities in parallel
      const weatherPromises = Object.entries(cities).map(async ([cityName, coords]) => {
        try {
          // Using OpenWeatherMap API (free tier available)
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`
          );

          if (response.ok) {
            const data = await response.json();
            return {
              city: cityName,
              temp: Math.round(data.main.temp * 10) / 10,
              condition: data.weather[0].main,
              humidity: data.main.humidity,
              windSpeed: data.wind.speed
            };
          } else {
            // Fallback to simulated data if API fails
            return {
              city: cityName,
              temp: Math.round((temperatureData[cityName].temp + (Math.random() - 0.5) * 2) * 10) / 10,
              condition: temperatureData[cityName].condition,
              humidity: 65,
              windSpeed: 5
            };
          }
        } catch (error) {
          // Fallback to simulated data on network error
          return {
            city: cityName,
            temp: Math.round((temperatureData[cityName].temp + (Math.random() - 0.5) * 2) * 10) / 10,
            condition: temperatureData[cityName].condition,
            humidity: 65,
            windSpeed: 5
          };
        }
      });

      const weatherResults = await Promise.all(weatherPromises);

      // Update temperature data with real/simulated data
      weatherResults.forEach(result => {
        if (result && result.city) {
          newTemperatureData[result.city] = {
            temp: result.temp,
            condition: result.condition,
            humidity: result.humidity,
            windSpeed: result.windSpeed
          };
        }
      });

      setTemperatureData(newTemperatureData);
      setLastWeatherUpdate(new Date());
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Use global temperature simulation for all locations
      simulateGlobalTemperatureUpdates();
    } finally {
      setIsUpdatingWeather(false);
    }
  }, [temperatureData]);

  // Function to simulate temperature updates for all global locations
  const simulateGlobalTemperatureUpdates = useCallback(() => {
    const newData = { ...temperatureData };
    
    // Update all locations with realistic temperature variations
    Object.keys(newData).forEach(location => {
      if (location !== 'Other') {
        // Simulate realistic temperature changes (-2 to +2 degrees)
        const change = (Math.random() - 0.5) * 4;
        newData[location].temp = Math.round((newData[location].temp + change) * 10) / 10;
        
        // Update condition based on temperature ranges
        if (newData[location].temp >= 35) newData[location].condition = 'Very Hot';
        else if (newData[location].temp >= 30) newData[location].condition = 'Hot';
        else if (newData[location].temp >= 25) newData[location].condition = 'Warm';
        else if (newData[location].temp >= 15) newData[location].condition = 'Pleasant';
        else if (newData[location].temp >= 5) newData[location].condition = 'Cool';
        else newData[location].condition = 'Cold';
        
        // Simulate humidity and wind speed variations
        const humidityChange = Math.floor((Math.random() - 0.5) * 10);
        newData[location].humidity = Math.max(20, Math.min(95, newData[location].humidity + humidityChange));
        
        const windSpeedChange = (Math.random() - 0.5) * 4;
        newData[location].windSpeed = Math.max(0, Math.round((newData[location].windSpeed + windSpeedChange) * 10) / 10);
      }
    });
    
    setTemperatureData(newData);
    setLastWeatherUpdate(new Date());
  }, [temperatureData]);

  // 60-second update functionality for temperature data
  useEffect(() => {
    // Update immediately when heatmap tab is active
    if (activeTab === 'heatmap') {
      fetchRealWeatherData();
    }

    // Set up 60-second interval for real-time updates
    const interval = setInterval(() => {
      if (activeTab === 'heatmap') {
        fetchRealWeatherData();
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [activeTab, fetchRealWeatherData]);

  // Function to handle admin login with organization credentials
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Find matching admin credentials
    const adminUser = adminCredentials.find(
      user => user.email === email && user.password === password
    );
    
    if (adminUser) {
      setIsAuthenticated(true);
      setOrganization(adminUser.organization);
      setRole(adminUser.role);
      setError('');
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminOrg', adminUser.organization);
      localStorage.setItem('adminRole', adminUser.role);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  // Check for existing authentication on component mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      setOrganization(localStorage.getItem('adminOrg') || '');
      setRole(localStorage.getItem('adminRole') || '');
    }
  }, []);
  
  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setOrganization('');
    setRole('');
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminOrg');
    localStorage.removeItem('adminRole');
  };
  
  // Function to handle data export
  const handleExportData = () => {
    alert(`Exporting data in ${exportFormat.toUpperCase()} format for the selected ${dateRange} period`);
    // In a real application, this would trigger an API call to generate and download the export file
  };
  
  // Function to handle trip data collection
  const handleTripDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTripDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Function to save trip data
  const handleSaveTripData = () => {
    if (!tripDetails.consentGiven) {
      setShowConsentModal(true);
      return;
    }
    
    const newTrip = {
      id: `T${Math.floor(1000 + Math.random() * 9000)}`,
      userId: `U${Math.floor(1000 + Math.random() * 9000)}`,
      username: 'current_user',
      ...tripDetails,
      distance: Math.floor(Math.random() * 30) + 1,
      duration: Math.floor(Math.random() * 90) + 15,
      automaticallyDetected: Math.random() > 0.5
    };
    
    setDetailedTripData(prev => [newTrip, ...prev]);
    
    // Reset form
    setTripDetails({
      origin: '',
      destination: '',
      startTime: '',
      endTime: '',
      mode: 'car',
      purpose: 'work',
      accompaniedBy: 0,
      consentGiven: false
    });
    
    alert('Trip data saved successfully!');
  };
  
  // Function to handle consent
  const handleConsent = (consent) => {
    setShowConsentModal(false);
    if (consent) {
      setTripDetails(prev => ({ ...prev, consentGiven: true }));
      setTimeout(() => handleSaveTripData(), 100);
    }
  };

  // Function to handle location tracking
  const handleTrackLocation = () => {
    if (isTrackingLocation) {
      // Stop tracking
      if (locationWatchId) {
        navigator.geolocation.clearWatch(locationWatchId);
        setLocationWatchId(null);
      }
      setIsTrackingLocation(false);
      setCurrentLocation(null);
      setLocationWeather(null);
    } else {
      // Start tracking
      if (navigator.geolocation) {
        setIsTrackingLocation(true);
        
        // Check if we're in a secure context (HTTPS or localhost)
        if (!window.isSecureContext) {
          alert('Location tracking requires a secure connection (HTTPS) or localhost.');
          setIsTrackingLocation(false);
          return;
        }
        
        // Get current position
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Location obtained:', position.coords);
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
            
            // Fetch weather for current location
            fetchLocationWeather(latitude, longitude);
            
            // Start watching for location changes
            const watchId = navigator.geolocation.watchPosition(
              (newPosition) => {
                console.log('Location updated:', newPosition.coords);
                const { latitude, longitude } = newPosition.coords;
                setCurrentLocation({ lat: latitude, lng: longitude });
                fetchLocationWeather(latitude, longitude);
              },
              (error) => {
                console.error('Location watch error:', error);
                let errorMessage = 'Unable to track your location.';
                switch (error.code) {
                  case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
                    break;
                  case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable. Please check your device settings.';
                    break;
                  case error.TIMEOUT:
                    errorMessage = 'Location request timed out. Please try again.';
                    break;
                  default:
                    errorMessage = 'Unable to track your location. Please check your location settings.';
                }
                alert(errorMessage);
                setIsTrackingLocation(false);
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
              }
            );
            
            setLocationWatchId(watchId);
          },
          (error) => {
            console.error('Location error:', error);
            let errorMessage = 'Unable to access your location.';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable. Please check your device settings.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out. Please try again.';
                break;
              default:
                errorMessage = 'Unable to access your location. Please check your location settings.';
            }
            alert(errorMessage);
            setIsTrackingLocation(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    }
  };

  // Function to fetch weather for current location
  const fetchLocationWeather = async (lat, lng) => {
    try {
      const apiKey = 'demo_key'; // Using demo key for development
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();
        setLocationWeather({
          temp: Math.round(data.main.temp * 10) / 10,
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          location: data.name || 'Your Location'
        });
      } else {
        // Fallback to simulated weather data based on coordinates
        const simulatedTemp = Math.round((20 + Math.random() * 15) * 10) / 10;
        const conditions = ['Pleasant', 'Warm', 'Cool', 'Sunny', 'Cloudy'];
        setLocationWeather({
          temp: simulatedTemp,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          humidity: Math.round(50 + Math.random() * 30),
          windSpeed: Math.round((3 + Math.random() * 7) * 10) / 10,
          location: 'Your Location'
        });
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      // Fallback to simulated weather data
      const simulatedTemp = Math.round((20 + Math.random() * 15) * 10) / 10;
      const conditions = ['Pleasant', 'Warm', 'Cool', 'Sunny', 'Cloudy'];
      setLocationWeather({
        temp: simulatedTemp,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.round(50 + Math.random() * 30),
        windSpeed: Math.round((3 + Math.random() * 7) * 10) / 10,
        location: 'Your Location'
      });
    }
  };

  // Effect to update location weather every 60 seconds when tracking
  useEffect(() => {
    let interval;
    if (isTrackingLocation && currentLocation) {
      interval = setInterval(() => {
        fetchLocationWeather(currentLocation.lat, currentLocation.lng);
      }, 60000); // 60 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTrackingLocation, currentLocation]);

  // Function to geocode location name to coordinates
  const geocodeLocation = async (locationName) => {
    try {
      // Using Nominatim API (OpenStreetMap's geocoding service)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Function to fetch weather for searched location
  const fetchSearchedLocationWeather = async (lat, lng) => {
    try {
      const apiKey = 'demo_key'; // Using demo key for development
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchedLocationWeather({
          temp: Math.round(data.main.temp * 10) / 10,
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          locationName: data.name || searchLocation
        });
      } else {
        // Fallback to simulated weather data if API fails
        const simulatedTemp = Math.round((20 + Math.random() * 15) * 10) / 10;
        const conditions = ['Pleasant', 'Warm', 'Cool', 'Sunny', 'Cloudy'];
        setSearchedLocationWeather({
          temp: simulatedTemp,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          humidity: Math.round(50 + Math.random() * 30),
          windSpeed: Math.round((3 + Math.random() * 7) * 10) / 10,
          locationName: searchLocation
        });
      }
    } catch (error) {
      console.error('Weather fetch error for searched location:', error);
      // Fallback to simulated weather data
      const simulatedTemp = Math.round((20 + Math.random() * 15) * 10) / 10;
      const conditions = ['Pleasant', 'Warm', 'Cool', 'Sunny', 'Cloudy'];
      setSearchedLocationWeather({
        temp: simulatedTemp,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.round(50 + Math.random() * 30),
        windSpeed: Math.round((3 + Math.random() * 7) * 10) / 10,
        locationName: searchLocation
      });
    }
  };

  // Function to search for a location and get its weather
  const handleSearchLocation = async () => {
    if (!searchLocation.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Geocode the location
      const locationData = await geocodeLocation(searchLocation);
      
      if (locationData) {
        setSearchedLocation(locationData);
        
        // Fetch weather for the searched location
        await fetchSearchedLocationWeather(locationData.lat, locationData.lng);
        
        // Start auto-updating weather every 60 seconds
        if (searchIntervalId) {
          clearInterval(searchIntervalId);
        }
        
        const intervalId = setInterval(() => {
          fetchSearchedLocationWeather(locationData.lat, locationData.lng);
        }, 60000); // 60 seconds
        
        setSearchIntervalId(intervalId);
        
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Clean up search interval on unmount
  useEffect(() => {
    return () => {
      if (searchIntervalId) {
        clearInterval(searchIntervalId);
      }
    };
  }, [searchIntervalId]);

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Access</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Authorized NATPAC personnel only
            </p>
            <div className="mt-3 p-4 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-center text-orange-700">
                Please log in with your organization-provided credentials
              </p>
            </div>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Access and analyze anonymized user trip data</p>
          <div className="mt-2 flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">
              {organization}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {role}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-3"
        >
          Logout
        </button>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <div className="flex">
            <select 
              value={exportFormat} 
              onChange={(e) => setExportFormat(e.target.value)}
              className="border border-gray-300 rounded-l-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF Report</option>
            </select>
            <button 
              onClick={handleExportData}
              className="bg-primary-600 text-white px-4 py-1.5 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`${activeTab === 'dashboard' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`${activeTab === 'bookings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`${activeTab === 'heatmap' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Trip Heatmap
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`${activeTab === 'patterns' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Trip Patterns
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${activeTab === 'users' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            User Data
          </button>
          <button
            onClick={() => setActiveTab('tripdata')}
            className={`${activeTab === 'tripdata' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Trip Data Collection
          </button>
        </nav>
      </div>
      
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Total Trips</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{tripData.totalTrips.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-green-500 text-sm font-medium flex items-center">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    8.2%
                  </span>
                  <span className="text-gray-500 text-sm ml-2">from previous period</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Active Users</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{tripData.activeUsers.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-green-500 text-sm font-medium flex items-center">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    5.7%
                  </span>
                  <span className="text-gray-500 text-sm ml-2">from previous period</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                  <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Avg. Trip Length</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{tripData.averageTripLength} km</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-red-500 text-sm font-medium flex items-center">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                    </svg>
                    2.3%
                  </span>
                  <span className="text-gray-500 text-sm ml-2">from previous period</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-yellow-100 p-3">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Peak Travel Time</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">8-9 AM</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm">1,850 trips during this hour</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Trips by Day Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trips by Day of Week</h2>
              <div className="h-64">
                {/* Line chart for trips by day */}
                <div className="h-full relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between text-xs text-gray-500 font-medium">
                    <span>2500</span>
                    <span>2000</span>
                    <span>1500</span>
                    <span>1000</span>
                    <span>500</span>
                    <span>0</span>
                  </div>
                  
                  {/* Chart area */}
                  <div className="ml-10 h-full flex flex-col">
                    {/* Grid lines */}
                    <div className="h-full w-full absolute grid grid-rows-5 gap-0">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="border-t border-gray-200 w-full"></div>
                      ))}
                    </div>
                    
                    {/* Line chart */}
                    <div className="h-full w-full relative">
                      <svg className="h-full w-full" viewBox="0 0 700 300" preserveAspectRatio="none">
                        {/* Gradient definitions */}
                        <defs>
                          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        
                        {/* Area under the line */}
                        <path
                          d="
                            M 0,${300 - (tripData.tripsByDay[0].count / 2500) * 300}
                            L 100,${300 - (tripData.tripsByDay[1].count / 2500) * 300}
                            L 200,${300 - (tripData.tripsByDay[2].count / 2500) * 300}
                            L 300,${300 - (tripData.tripsByDay[3].count / 2500) * 300}
                            L 400,${300 - (tripData.tripsByDay[4].count / 2500) * 300}
                            L 500,${300 - (tripData.tripsByDay[5].count / 2500) * 300}
                            L 600,${300 - (tripData.tripsByDay[6].count / 2500) * 300}
                            L 600,300
                            L 0,300
                            Z
                          "
                          fill="url(#blueGradient)"
                          opacity="0.7"
                        />
                        
                        {/* Line */}
                        <polyline
                          points="
                            0,${300 - (tripData.tripsByDay[0].count / 2500) * 300}
                            100,${300 - (tripData.tripsByDay[1].count / 2500) * 300}
                            200,${300 - (tripData.tripsByDay[2].count / 2500) * 300}
                            300,${300 - (tripData.tripsByDay[3].count / 2500) * 300}
                            400,${300 - (tripData.tripsByDay[4].count / 2500) * 300}
                            500,${300 - (tripData.tripsByDay[5].count / 2500) * 300}
                            600,${300 - (tripData.tripsByDay[6].count / 2500) * 300}
                          "
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#glow)"
                        />
                        
                        {/* Data points with hover effect */}
                        {tripData.tripsByDay.map((day, i) => (
                          <g key={i} transform={`translate(${i * 100}, ${300 - (day.count / 2500) * 300})`}>
                            <circle 
                              r="6" 
                              fill="#fff" 
                              stroke="#3b82f6" 
                              strokeWidth="2"
                              filter="url(#glow)"
                            />
                            <circle 
                              r="3" 
                              fill="#3b82f6" 
                            />
                            <title>{day.day}: {day.count} trips</title>
                          </g>
                        ))}
                        
                        {/* X-axis labels */}
                        <g transform="translate(0, 300)" className="text-xs text-gray-600 font-medium">
                          {tripData.tripsByDay.map((day, i) => (
                            <text key={i} x={i * 100} y="20" textAnchor="middle">{day.day.substring(0, 3)}</text>
                          ))}
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="ml-10 flex justify-between mt-2">
                  {tripData.tripsByDay.map((day) => (
                    <div key={day.day} className="text-xs text-center">
                      <div className="text-gray-500">{day.day}</div>
                      <div className="font-medium">{day.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Trips by Week Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trips by Week</h2>
              <div className="h-64">
                {/* Line chart for trips by week */}
                <div className="h-full relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between text-xs text-gray-500 font-medium">
                    <span>10k</span>
                    <span>8k</span>
                    <span>6k</span>
                    <span>4k</span>
                    <span>2k</span>
                    <span>0</span>
                  </div>
                  
                  {/* Chart area */}
                  <div className="ml-10 h-full flex flex-col">
                    {/* Grid lines */}
                    <div className="h-full w-full absolute grid grid-rows-5 gap-0">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="border-t border-gray-200 w-full"></div>
                      ))}
                    </div>
                    
                    {/* Line chart */}
                    <div className="h-full w-full relative">
                      <svg className="h-full w-full" viewBox="0 0 300 300" preserveAspectRatio="none">
                        {/* Gradient and filter definitions */}
                        <defs>
                          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                          </linearGradient>
                          <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        
                        {/* Area under the line */}
                        <path
                          d="
                            M 0,${300 - (tripData.tripsByWeek[0].count / 10000) * 300}
                            L 100,${300 - (tripData.tripsByWeek[1].count / 10000) * 300}
                            L 200,${300 - (tripData.tripsByWeek[2].count / 10000) * 300}
                            L 300,${300 - (tripData.tripsByWeek[3].count / 10000) * 300}
                            L 300,300
                            L 0,300
                            Z
                          "
                          fill="url(#greenGradient)"
                          opacity="0.7"
                        />
                        
                        {/* Line */}
                        <polyline
                          points="
                            0,${300 - (tripData.tripsByWeek[0].count / 10000) * 300}
                            100,${300 - (tripData.tripsByWeek[1].count / 10000) * 300}
                            200,${300 - (tripData.tripsByWeek[2].count / 10000) * 300}
                            300,${300 - (tripData.tripsByWeek[3].count / 10000) * 300}
                          "
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#greenGlow)"
                        />
                        
                        {/* Data points with hover effect */}
                        {tripData.tripsByWeek.map((week, index) => (
                          <g key={week.week} transform={`translate(${index * 100}, ${300 - (week.count / 10000) * 300})`}>
                            <circle 
                              r="6" 
                              fill="#fff" 
                              stroke="#10b981" 
                              strokeWidth="2"
                              filter="url(#greenGlow)"
                            />
                            <circle 
                              r="3" 
                              fill="#10b981" 
                            />
                            <title>Week {week.week}: {week.count} trips</title>
                          </g>
                        ))}
                        
                        {/* X-axis labels */}
                        <g transform="translate(0, 300)" className="text-xs text-gray-600 font-medium">
                          {tripData.tripsByWeek.map((week, i) => (
                            <text key={i} x={i * 100} y="20" textAnchor="middle">Week {week.week}</text>
                          ))}
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="ml-10 flex justify-between mt-2">
                  {tripData.tripsByWeek.map((week) => (
                    <div key={week.week} className="text-xs text-center">
                      <div className="text-gray-500">{week.week}</div>
                      <div className="font-medium">{week.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Transport Mode Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Transport Mode Distribution</h2>
              <div className="h-64 flex items-center justify-center">
                {/* Donut chart visualization would go here - using a placeholder */}
                <div className="relative h-48 w-48">
                  <svg viewBox="0 0 36 36" className="h-full w-full">
                    <circle 
                      cx="18" cy="18" r="16" 
                      fill="none" 
                      stroke="#3B82F6" 
                      strokeWidth="32" 
                      strokeDasharray={`${tripData.popularModes[0].percentage} 100`} 
                      strokeDashoffset="25"
                    />
                    <circle 
                      cx="18" cy="18" r="16" 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="32" 
                      strokeDasharray={`${tripData.popularModes[1].percentage} 100`} 
                      strokeDashoffset={`${100 - tripData.popularModes[0].percentage + 25}`}
                    />
                    <circle 
                      cx="18" cy="18" r="16" 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth="32" 
                      strokeDasharray={`${tripData.popularModes[2].percentage} 100`} 
                      strokeDashoffset={`${100 - tripData.popularModes[0].percentage - tripData.popularModes[1].percentage + 25}`}
                    />
                    <circle 
                      cx="18" cy="18" r="16" 
                      fill="none" 
                      stroke="#EF4444" 
                      strokeWidth="32" 
                      strokeDasharray={`${tripData.popularModes[3].percentage} 100`} 
                      strokeDashoffset={`${100 - tripData.popularModes[0].percentage - tripData.popularModes[1].percentage - tripData.popularModes[2].percentage + 25}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold">100%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {tripData.popularModes.map((mode, index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                  return (
                    <div key={mode.mode} className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${colors[index]} mr-2`}></div>
                      <span className="text-sm text-gray-600">{mode.mode}: {mode.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Popular Destinations */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Destinations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Count</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tripData.popularDestinations.map((destination) => (
                    <tr key={destination.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{destination.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{destination.count.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((destination.count / tripData.totalTrips) * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {Math.random() > 0.5 ? (
                            <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className="ml-1">{(Math.random() * 10).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-primary-700 mb-4">Bookings</h2>
            <div className="overflow-x-auto">
              {bookings.length === 0 ? (
                <div className="text-gray-500">No bookings found.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((b, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.pickup}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.mode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹ {b.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Trip Heatmap Tab */}
      {activeTab === 'heatmap' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Trip Density Heatmap</h2>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search location (e.g., New York, London)"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
                      className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSearchLocation}
                    disabled={!searchLocation.trim() || isSearching}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>
                <button
                  onClick={handleTrackLocation}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${
                    isTrackingLocation
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30'
                      : 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {isTrackingLocation ? 'Stop Tracking' : 'Track My Location'}
                </button>
              </div>
            </div>
            
            {/* Search Results Display */}
            {searchedLocation && searchedLocationWeather && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">
                      🔍 Search Results for "{searchLocation}"
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {searchedLocationWeather.temp}°C
                        </div>
                        <div className="text-sm text-gray-600">Temperature</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-800">
                          {searchedLocationWeather.condition}
                        </div>
                        <div className="text-sm text-gray-600">Condition</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {searchedLocationWeather.humidity}%
                        </div>
                        <div className="text-sm text-gray-600">Humidity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {searchedLocationWeather.windSpeed} m/s
                        </div>
                        <div className="text-sm text-gray-600">Wind Speed</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Coordinates: {searchedLocation.lat.toFixed(4)}, {searchedLocation.lng.toFixed(4)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSearchedLocation(null);
                      setSearchedLocationWeather(null);
                      if (searchIntervalId) {
                        clearInterval(searchIntervalId);
                        setSearchIntervalId(null);
                      }
                    }}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
            
            {/* Trip Heatmap Visualization Map */}
            <TripHeatmapMap 
              tripDataList={detailedTripData} 
              temperatureData={temperatureData} 
              isUpdating={isUpdatingWeather}
              lastUpdateTime={lastWeatherUpdate}
              currentLocation={currentLocation}
              locationWeather={locationWeather}
              searchedLocation={searchedLocation}
              searchedLocationWeather={searchedLocationWeather}
              isTrackingLocation={isTrackingLocation}
            />
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trip Density Legend */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Trip Density:</span>
                <div className="flex items-center">
                  <div className="h-4 w-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded mr-2"></div>
                  <span className="text-xs text-gray-500">Low Density</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded mr-2"></div>
                  <span className="text-xs text-gray-500">High Density</span>
                </div>
              </div>
              
              {/* Temperature Legend */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Temperature:</span>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Cool (&lt;20°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Pleasant (20-25°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Warm (25-30°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Hot (&gt;30°C)</span>
                </div>
              </div>
            </div>
            
            {/* Update Status */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {isUpdating ? (
                    <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                  )}
                  <span className="text-sm text-gray-600">
                    {isUpdating ? 'Updating temperature data...' : 'Temperature data updated'}
                  </span>
                </div>
                
                {/* Location tracking status */}
                {isTrackingLocation && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium">Tracking Location</span>
                    {currentLocation && (
                      <span className="text-gray-500">
                        ({currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)})
                      </span>
                    )}
                  </div>
                )}

                {/* Searched location status */}
                {searchedLocation && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-purple-600 font-medium">Searched Location</span>
                    <span className="text-gray-500">
                      ({searchedLocation.lat.toFixed(4)}, {searchedLocation.lng.toFixed(4)})
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdateTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Origin-Destination Pairs</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Residential Area A</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Central Business District</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,245</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Residential Area B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tech Park</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">987</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">University Area</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Shopping Mall</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">876</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Residential Area C</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">University Area</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">754</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Shopping Mall</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Residential Area A</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">689</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Congestion Analysis</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Main Highway (North)</span>
                    <span className="text-sm font-medium text-red-600">Severe</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Downtown Area</span>
                    <span className="text-sm font-medium text-orange-500">Heavy</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">East-West Connector</span>
                    <span className="text-sm font-medium text-yellow-500">Moderate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Suburban Routes</span>
                    <span className="text-sm font-medium text-green-600">Light</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Residential Streets</span>
                    <span className="text-sm font-medium text-green-600">Light</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Trip Patterns Tab */}
      {activeTab === 'patterns' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours Analysis</h2>
              
              {/* Peak hours chart with enhanced visualization */}
              <div className="h-80 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4">
                <div className="relative h-full">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between text-xs font-medium text-gray-600">
                    <span>2000</span>
                    <span>1500</span>
                    <span>1000</span>
                    <span>500</span>
                    <span>0</span>
                  </div>
                  
                  {/* Chart area */}
                  <div className="ml-10 h-full flex flex-col">
                    {/* Grid lines */}
                    <div className="h-full w-full absolute grid grid-rows-4 gap-0">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-t border-gray-200 w-full opacity-60"></div>
                      ))}
                    </div>
                    
                    {/* Line chart */}
                    <div className="h-full w-full relative">
                      <svg className="h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                        {/* Gradient and filter definitions */}
                        <defs>
                          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                          </linearGradient>
                          
                          <filter id="purpleGlow" height="300%" width="300%" x="-100%" y="-100%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        
                        {/* Area under the line */}
                        <path
                          d={`M 0,${300 - (tripData.peakHours[0].count / 2000) * 300}
                            L 133,${300 - (tripData.peakHours[1].count / 2000) * 300}
                            L 266,${300 - (tripData.peakHours[2].count / 2000) * 300}
                            L 400,${300 - (tripData.peakHours[3].count / 2000) * 300}
                            L 400,300
                            L 0,300
                            Z`}
                          fill="url(#purpleGradient)"
                          opacity="0.4"
                        />
                        
                        {/* Line */}
                        <polyline
                          points={`0,${300 - (tripData.peakHours[0].count / 2000) * 300}
                            133,${300 - (tripData.peakHours[1].count / 2000) * 300}
                            266,${300 - (tripData.peakHours[2].count / 2000) * 300}
                            400,${300 - (tripData.peakHours[3].count / 2000) * 300}`}
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#purpleGlow)"
                        />
                        
                        {/* Data points with enhanced visibility */}
                        {tripData.peakHours.map((hour, index) => (
                          <g key={hour.hour} transform={`translate(${index * 133}, ${300 - (hour.count / 2000) * 300})`}>
                            {/* Outer glow circle */}
                            <circle
                              r="12"
                              fill="#8b5cf6"
                              opacity="0.1"
                              className="transition-all duration-300"
                            />
                            {/* Main data point */}
                            <circle
                              r="8"
                              fill="#8b5cf6"
                              className="transition-all duration-300 hover:r-10 cursor-pointer"
                              filter="url(#purpleGlow)"
                              onMouseEnter={(e) => {
                                e.target.setAttribute('r', '10');
                                e.target.style.opacity = '0.9';
                              }}
                              onMouseLeave={(e) => {
                                e.target.setAttribute('r', '8');
                                e.target.style.opacity = '1';
                              }}
                            >
                              <title>{hour.hour}: {hour.count} trips</title>
                            </circle>
                            {/* Inner highlight */}
                            <circle
                              r="4"
                              fill="white"
                              opacity="0.8"
                              className="transition-all duration-300"
                            />
                            {/* Value label */}
                            <text
                              y="-15"
                              textAnchor="middle"
                              className="text-xs font-bold fill-purple-700"
                              style={{ fontSize: '12px' }}
                            >
                              {hour.count}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced X-axis labels */}
                <div className="ml-10 flex justify-between mt-4">
                  {tripData.peakHours.map((hour, index) => (
                    <div key={hour.hour} className="text-center flex flex-col items-center">
                      <div className="text-sm font-semibold text-gray-700">{hour.hour}</div>
                      <div className="text-lg font-bold text-purple-600 mt-1">{hour.count}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {index === 0 && '🌅 Morning'}
                        {index === 1 && '☀️ Peak'}
                        {index === 2 && '🌇 Evening'}
                        {index === 3 && '🌙 Late'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {/* Key Insights */}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-purple-900">Peak Volume</p>
                      <p className="text-sm text-purple-700">8-9 AM shows highest trip volume (1,850 trips)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Evening Spread</p>
                      <p className="text-sm text-blue-700">Evening peaks are more distributed across time</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-green-900">Weekend Patterns</p>
                      <p className="text-sm text-green-700">Weekend travel differs significantly from weekdays</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-yellow-900">School Zones</p>
                      <p className="text-sm text-yellow-700">Educational areas show specialized peak patterns</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border border-purple-100">
                  <p className="text-sm text-purple-800">
                    <span className="font-semibold">💡 Recommendation:</span> Consider implementing dynamic pricing or 
                    additional services during peak hours to optimize resource allocation and improve user experience.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Purpose Distribution</h2>
              
              {/* Trip purpose chart would go here - using a placeholder */}
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Work Commute</span>
                      <span className="text-sm font-medium text-gray-700">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Shopping/Errands</span>
                      <span className="text-sm font-medium text-gray-700">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Education</span>
                      <span className="text-sm font-medium text-gray-700">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Leisure/Recreation</span>
                      <span className="text-sm font-medium text-gray-700">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Other</span>
                      <span className="text-sm font-medium text-gray-700">5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Chain Analysis</h2>
            
            {/* Dummy Trip Chain Visualization */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Chain Flow Visualization</h3>
              
              {/* Flow diagram */}
              <div className="flex flex-col space-y-4">
                {/* Home → Work → Home Chain */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Most Common Chain (42%)</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">High Frequency</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 rounded relative">
                      <div className="absolute inset-0 bg-blue-500 rounded" style={{width: '42%'}}></div>
                    </div>
                    <div className="bg-orange-500 text-white rounded-full p-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 rounded relative">
                      <div className="absolute inset-0 bg-blue-500 rounded" style={{width: '42%'}}></div>
                    </div>
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Home</span>
                    <span>Work</span>
                    <span>Home</span>
                  </div>
                </div>

                {/* Home → School → Home Chain */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Second Most Common (18%)</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Medium Frequency</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 rounded relative">
                      <div className="absolute inset-0 bg-green-500 rounded" style={{width: '18%'}}></div>
                    </div>
                    <div className="bg-purple-500 text-white rounded-full p-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 rounded relative">
                      <div className="absolute inset-0 bg-green-500 rounded" style={{width: '18%'}}></div>
                    </div>
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Home</span>
                    <span>School</span>
                    <span>Home</span>
                  </div>
                </div>

                {/* Multi-stop Chain Example */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Complex Multi-stop Chain (12%)</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Complex Pattern</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 rounded relative">
                      <div className="absolute inset-0 bg-orange-500 rounded" style={{width: '12%'}}></div>
                    </div>
                    <div className="bg-orange-500 text-white rounded-full p-2">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 rounded relative">
                      <div className="absolute inset-0 bg-purple-500 rounded" style={{width: '8%'}}></div>
                    </div>
                    <div className="bg-purple-500 text-white rounded-full p-2">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 rounded relative">
                      <div className="absolute inset-0 bg-green-500 rounded" style={{width: '12%'}}></div>
                    </div>
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Home</span>
                    <span>Work</span>
                    <span>Shopping</span>
                    <span>Home</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Interactive trip chain patterns showing common movement flows</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Common Trip Chains:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Mode</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Home → Work → Home</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">9.5 hours</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Car (65%)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Home → School → Home</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.2 hours</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Public Transit (42%)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Home → Work → Shopping → Home</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10.3 hours</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Car (78%)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Home → Shopping → Home</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.1 hours</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Walking (35%)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Home → Leisure → Dining → Home</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.5 hours</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Car (52%)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Trip Data Collection Tab */}
      {activeTab === 'tripdata' && (
        <div className="animate-fade-in">
          {/* Data Collection Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Trips</p>
                  <p className="text-2xl font-semibold text-gray-900">{detailedTripData.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{new Set(detailedTripData.map(t => t.userId)).size}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Distance</p>
                  <p className="text-2xl font-semibold text-gray-900">{detailedTripData.length > 0 ? (detailedTripData.reduce((sum, trip) => sum + trip.distance, 0) / detailedTripData.length).toFixed(1) : 0} km</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Duration</p>
                  <p className="text-2xl font-semibold text-gray-900">{detailedTripData.length > 0 ? Math.round(detailedTripData.reduce((sum, trip) => sum + trip.duration, 0) / detailedTripData.length) : 0} min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8 transform transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Trip Data Collection</h2>
                <p className="text-gray-600 mt-1">Collect trip data with user consent. Some fields can be automatically detected while others require user input.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <span className="text-sm text-blue-800 font-medium">Auto Detection: {detailedTripData.filter(t => t.automaticallyDetected).length} trips</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <span className="text-sm text-green-800 font-medium">User Input: {detailedTripData.filter(t => !t.automaticallyDetected).length} trips</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Origin Location
                </label>
                <input
                  type="text"
                  name="origin"
                  value={tripDetails.origin}
                  onChange={handleTripDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Starting location (e.g., Connaught Place, Delhi)"
                />
                <p className="text-xs text-gray-500">Can be auto-detected using GPS</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg className="h-4 w-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Destination Location
                </label>
                <input
                  type="text"
                  name="destination"
                  value={tripDetails.destination}
                  onChange={handleTripDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Ending location (e.g., Cyber City, Gurugram)"
                />
                <p className="text-xs text-gray-500">Can be auto-detected using GPS</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={tripDetails.startTime}
                  onChange={handleTripDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
                <p className="text-xs text-gray-500">Can be auto-detected using device sensors</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg className="h-4 w-4 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={tripDetails.endTime}
                  onChange={handleTripDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
                <p className="text-xs text-gray-500">Can be auto-detected using device sensors</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg className="h-4 w-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Transport Mode
                </label>
                <select
                  name="mode"
                  value={tripDetails.mode}
                  onChange={handleTripDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="car">🚗 Car</option>
                  <option value="bus">🚌 Bus</option>
                  <option value="train">🚆 Train</option>
                  <option value="walking">🚶 Walking</option>
                  <option value="cycling">🚴 Cycling</option>
                  <option value="auto">🛺 Auto Rickshaw</option>
                  <option value="taxi">🚕 Taxi</option>
                  <option value="other">📦 Other</option>
                </select>
                <p className="text-xs text-gray-500">User input required</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg className="h-4 w-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Trip Purpose
                </label>
                <select
                  name="purpose"
                  value={tripDetails.purpose}
                  onChange={handleTripDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="work">💼 Work</option>
                  <option value="education">🎓 Education</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="leisure">🎮 Leisure</option>
                  <option value="medical">🏥 Medical</option>
                  <option value="other">📋 Other</option>
                </select>
                <p className="text-xs text-gray-500">User input required</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg className="h-4 w-4 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Accompanied By
                </label>
                <input
                  type="number"
                  name="accompaniedBy"
                  value={tripDetails.accompaniedBy}
                  onChange={handleTripDetailsChange}
                  min="0"
                  max="20"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                />
                <p className="text-xs text-gray-500">Number of people traveling with</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="consentGiven"
                    name="consentGiven"
                    checked={tripDetails.consentGiven}
                    onChange={handleTripDetailsChange}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="consentGiven" className="ml-3 block text-sm font-medium text-gray-900">
                    I consent to share this trip data for planning purposes
                  </label>
                </div>
                <button
                  onClick={() => setShowConsentModal(true)}
                  className="text-sm text-primary-600 hover:text-primary-800 underline"
                >
                  Learn more
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  Auto Detection Available
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  User Consent Required
                </span>
              </div>
              <button
                onClick={handleSaveTripData}
                disabled={!tripDetails.consentGiven}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Save Trip Data
              </button>
            </div>
          </div>
          
          {/* Enhanced Trip Data Table */}
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Collected Trip Data</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const newData = detailedTripData.filter(trip => 
                      !trip.origin.includes('Test') && 
                      !trip.destination.includes('Sample') &&
                      trip.origin !== 'Delhi' &&
                      trip.destination !== 'Mumbai'
                    );
                    setDetailedTripData(newData);
                    localStorage.setItem('detailedTripData', JSON.stringify(newData));
                  }}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Remove Dummy Data
                </button>
                <button
                  onClick={() => {
                    const newData = detailedTripData.map(trip => ({
                      ...trip,
                      distance: Math.random() * 50 + 5,
                      duration: Math.random() * 120 + 15
                    }));
                    setDetailedTripData(newData);
                    localStorage.setItem('detailedTripData', JSON.stringify(newData));
                  }}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  Add Analytics
                </button>
                <button
                  onClick={() => {
                    const newData = [...detailedTripData].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                    setDetailedTripData(newData);
                  }}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Sort by Latest
                </button>
              </div>
            </div>
            
            {detailedTripData.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trip data collected yet</h3>
                <p className="text-gray-500 mb-4">Start collecting trip data using the form above to see insights here.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Quick Start Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Fill in the trip details above</li>
                    <li>• Enable consent for data sharing</li>
                    <li>• Click "Save Trip Data" to add your first trip</li>
                    <li>• View real-time analytics and insights</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                {/* Data Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Distance</p>
                        <p className="text-2xl font-bold text-blue-900">{detailedTripData.reduce((sum, trip) => sum + (trip.distance || 0), 0).toFixed(1)} km</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Total Duration</p>
                        <p className="text-2xl font-bold text-green-900">{Math.round(detailedTripData.reduce((sum, trip) => sum + (trip.duration || 0), 0))} min</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Unique Users</p>
                        <p className="text-2xl font-bold text-purple-900">{new Set(detailedTripData.map(t => t.userId)).size}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Data Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Source</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detailedTripData.map((trip, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {trip.origin}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <svg className="h-4 w-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {trip.destination}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              <div>{new Date(trip.startTime).toLocaleDateString()}</div>
                              <div className="text-gray-500">
                                {new Date(trip.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                {new Date(trip.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                              <div className="text-xs text-blue-600 font-medium">
                                {trip.distance ? `${trip.distance} km` : 'Distance N/A'} • {trip.duration ? `${trip.duration} min` : 'Duration N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {trip.mode === 'car' && '🚗'} {trip.mode === 'bus' && '🚌'} {trip.mode === 'train' && '🚆'} {trip.mode === 'walking' && '🚶'} {trip.mode === 'cycling' && '🚴'} {trip.mode === 'auto' && '🛺'} {trip.mode === 'taxi' && '🚕'} {trip.mode === 'other' && '📦'}
                              {trip.mode}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                              {trip.purpose === 'work' && '💼'} {trip.purpose === 'education' && '🎓'} {trip.purpose === 'shopping' && '🛍️'} {trip.purpose === 'leisure' && '🎮'} {trip.purpose === 'medical' && '🏥'} {trip.purpose === 'other' && '📋'}
                              {trip.purpose}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-sm text-gray-900">{trip.accompaniedBy}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              trip.automaticallyDetected ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {trip.automaticallyDetected ? '🤖 Auto' : '👤 User'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  const newData = detailedTripData.filter((_, i) => i !== index);
                                  setDetailedTripData(newData);
                                  localStorage.setItem('detailedTripData', JSON.stringify(newData));
                                }}
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => {
                                  setTripDetails(trip);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination Info */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{detailedTripData.length}</span> of <span className="font-medium">{detailedTripData.length}</span> results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                      Previous
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-primary-600 text-white">
                      1
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Consent Modal */}
          {showConsentModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Consent Required</h3>
                <p className="text-gray-600 mb-6">
                  We need your consent to collect and store this trip data. The data will be used by NATPAC scientists for planning purposes only.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleConsent(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleConsent(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Give Consent
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Booking Management</h2>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Search bookings..."
                  className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
                />
                <select className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500">
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.type || 'Guide'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.customerName || 'Customer'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.timestamp || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {booking.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${booking.amount || (Math.floor(Math.random() * 200) + 50)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => {
                            setSelectedBooking(booking);
                            // Handle status update logic
                            const newStatus = booking.status === 'pending' ? 'confirmed' : 
                                            booking.status === 'confirmed' ? 'completed' : 'pending';
                            updateBookingStatus(booking.id, newStatus);
                            
                            // Update local state
                            setBookings(bookings.map(b => 
                              b.id === booking.id ? {...b, status: newStatus} : b
                            ));
                          }}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          {booking.status === 'pending' ? 'Confirm' : 
                           booking.status === 'confirmed' ? 'Complete' : 'Reopen'}
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedBooking(booking);
                            // Handle view details logic
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {bookings.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No bookings found</p>
              </div>
            )}
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {bookings.length} bookings
              </div>
              <div className="flex space-x-2">
                <button className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* User Data Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Anonymized User Data</h2>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Search users..."
                  className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500"
                />
                <select className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Age Groups</option>
                  <option>18-24</option>
                  <option>25-34</option>
                  <option>35-44</option>
                  <option>45-54</option>
                  <option>55+</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Count</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Distance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Most Used Mode</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.tripCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.avgDistance} km</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mostUsedMode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">View Details</button>
                        <button className="text-primary-600 hover:text-primary-900">Export</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">245</span> users
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Demographics</h2>
              
              {/* Demographics visualization would go here - using a placeholder */}
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Age Distribution</h3>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">18-24</span>
                      <span className="text-xs text-gray-600">22%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">25-34</span>
                      <span className="text-xs text-gray-600">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">35-44</span>
                      <span className="text-xs text-gray-600">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">45-54</span>
                      <span className="text-xs text-gray-600">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">55+</span>
                      <span className="text-xs text-gray-600">6%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '6%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h2>
              
              {/* User engagement visualization would go here - using a placeholder */}
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">App Usage Frequency</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-blue-100 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-700">45%</div>
                        <div className="text-xs text-blue-700 mt-1">Daily</div>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-700">32%</div>
                        <div className="text-xs text-blue-700 mt-1">Weekly</div>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-700">23%</div>
                        <div className="text-xs text-blue-700 mt-1">Monthly</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Feature Usage</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Trip Logging</span>
                        <span className="text-xs text-gray-600">92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Route Recommendations</span>
                        <span className="text-xs text-gray-600">78%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Safety Features</span>
                        <span className="text-xs text-gray-600">65%</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Community Features</span>
                        <span className="text-xs text-gray-600">42%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;