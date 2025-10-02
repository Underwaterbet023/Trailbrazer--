import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function LiveMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(false);
  const watchIdRef = useRef(null);

  // Start watching the user's location
  const startWatchingLocation = () => {
    if (navigator.geolocation) {
      setWatching(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
          setError(null);
        },
        (err) => {
          setError(`Error: ${err.message}`);
          console.error('Error getting location:', err);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Stop watching the user's location
  const stopWatchingLocation = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setWatching(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Live Location</h3>
          <p className="text-sm text-gray-500">
            {watching ? 'Tracking your location in real-time' : 'Start tracking to see your location'}
          </p>
        </div>
        <div>
          {!watching ? (
            <button
              onClick={startWatchingLocation}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Start Tracking
            </button>
          ) : (
            <button
              onClick={stopWatchingLocation}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Stop Tracking
            </button>
          )}
        </div>
      </div>

      <div className="relative h-96 w-full">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-4 text-red-600">
              <svg className="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full">
            <MapContainer 
              center={userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629]} 
              zoom={userLocation ? 15 : 5} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {userLocation && <LocationMarker position={[userLocation.lat, userLocation.lng]} accuracy={userLocation.accuracy} />}
            </MapContainer>
            
            {userLocation && (
              <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-3 rounded-md shadow-md z-[1000]">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">Latitude:</span> {userLocation.lat.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span> {userLocation.lng.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">Accuracy:</span> {userLocation.accuracy.toFixed(1)} meters
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {new Date(userLocation.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
            
            {!userLocation && !watching && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center p-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Click "Start Tracking" to see your location</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Powered by OpenStreetMap and Leaflet. Location accuracy depends on your device's GPS capabilities.
        </p>
      </div>
    </div>
  );
}

// LocationMarker component to handle user's location
function LocationMarker({ position, accuracy }) {
  const map = useMap();
  
  // Center map on user location when position changes
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [map, position]);

  return (
    <>
      {/* Accuracy circle */}
      <CircleMarker 
        center={position}
        radius={accuracy / 2} // Scale down for better visualization
        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15 }}
      />
      
      {/* Position marker */}
      <Marker position={position}>
        <Popup>
          You are here <br />
          Accuracy: {accuracy.toFixed(1)} meters
        </Popup>
      </Marker>
    </>
  );
}

export default LiveMap;