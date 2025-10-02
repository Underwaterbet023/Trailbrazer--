import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to recenter map when user location changes
function RecenterMap({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14);
    }
  }, [map, position]);
  
  return null;
}

function DangerZoneMap({ dangerZones }) {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          console.error('Error getting location:', err);
          // Provide more specific error messages
          let errorMessage = 'Unable to access your location. ';
          switch(err.code) {
            case err.PERMISSION_DENIED:
              errorMessage += 'Please allow location access to view danger zones near you.';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is currently unavailable.';
              break;
            case err.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Using default location.';
          }
          setError(errorMessage);
          setLoading(false);
          // Still allow the map to load with default location
          setUserLocation(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setError('Geolocation is not supported by this browser. Using default location.');
      setLoading(false);
    }
  }, []);

  // Default center if user location is not available
  const defaultCenter = [20.5937, 78.9629]; // Center of India

  // Generate danger zone circles with different radiuses and opacities
  const renderDangerZones = (zone) => {
    const radiuses = [200, 400, 600]; // Smaller alert circles (in meters)
    const baseOpacity = zone.level === 'high' ? 0.3 : 0.2; // Reduced opacity
    
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
        />
      );
    });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <svg className="h-12 w-12 text-yellow-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <p className="mt-1 text-xs text-gray-500">Please enable location services to view danger zones near you.</p>
        </div>
      </div>
    );
  }

  // Process danger zones data to include coordinates
  const processedZones = dangerZones.map(zone => {
    // In a real app, these would come from the API
    // For demo, we'll generate coordinates near the user's location
    const lat = userLocation ? userLocation.lat + (Math.random() * 0.02 - 0.01) : defaultCenter[0];
    const lng = userLocation ? userLocation.lng + (Math.random() * 0.02 - 0.01) : defaultCenter[1];
    
    return {
      ...zone,
      lat,
      lng
    };
  });

  return (
    <div className="h-64 rounded-lg overflow-hidden">
      <MapContainer 
        center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && <RecenterMap position={[userLocation.lat, userLocation.lng]} />}
        
        {/* User location marker with blue dot and accuracy circle */}
        {userLocation && (
          <>
            <CircleMarker 
              center={[userLocation.lat, userLocation.lng]}
              radius={8}
              pathOptions={{ 
                color: '#3b82f6', 
                fillColor: '#3b82f6', 
                fillOpacity: 0.8,
                weight: 2
              }}
            >
              <Popup>
                Your current location
              </Popup>
            </CircleMarker>
            <CircleMarker 
              center={[userLocation.lat, userLocation.lng]}
              radius={15}
              pathOptions={{ 
                color: '#3b82f6', 
                fillColor: '#3b82f6', 
                fillOpacity: 0.2,
                weight: 1
              }}
            />
          </>
        )}
        
        {/* Render danger zones */}
        {processedZones.map(zone => (
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
  );
}

export default DangerZoneMap;