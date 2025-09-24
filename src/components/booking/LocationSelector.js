import React, { useState } from 'react';

function LocationSelector({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  allowCurrentLocation = false 
}) {
  const [selectionMethod, setSelectionMethod] = useState('manual');
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [locationDetails, setLocationDetails] = useState({
    country: '',
    state: '',
    city: '',
    district: '',
    landmark: ''
  });

  // Handle getting current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would use a reverse geocoding service here
          // For demo purposes, we'll just use the coordinates
          const location = `Current Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`;
          onChange(location);
          setSelectionMethod('current');
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Unable to retrieve your location. ";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is currently unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "Please enter your location manually.";
          }
          alert(errorMessage);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      alert("Geolocation is not supported by this browser. Please enter your location manually.");
    }
  };

  // Handle manual location input
  const handleManualInput = (e) => {
    onChange(e.target.value);
    setSelectionMethod('manual');
  };

  // Handle detailed location input
  const handleDetailedLocationChange = (field, value) => {
    const updatedDetails = { ...locationDetails, [field]: value };
    setLocationDetails(updatedDetails);
    
    // Create a formatted address from the details
    const formattedAddress = Object.values(updatedDetails)
      .filter(val => val.trim() !== '')
      .join(', ');
    
    onChange(formattedAddress);
  };

  // Toggle between simple input and detailed form
  const toggleLocationDetails = () => {
    setShowLocationDetails(!showLocationDetails);
  };

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium mb-2">{label}:</label>
      
      {/* Selection method toggle */}
      <div className="flex mb-2 space-x-2">
        <button
          type="button"
          className={`px-3 py-1 rounded-md text-sm font-medium ${selectionMethod === 'manual' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setSelectionMethod('manual')}
        >
          Manual Entry
        </button>
        
        {allowCurrentLocation && (
          <button
            type="button"
            className={`px-3 py-1 rounded-md text-sm font-medium ${selectionMethod === 'current' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={getCurrentLocation}
          >
            Use Current Location
          </button>
        )}
        
        <button
          type="button"
          className={`px-3 py-1 rounded-md text-sm font-medium ${showLocationDetails ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={toggleLocationDetails}
        >
          {showLocationDetails ? 'Simple Entry' : 'Detailed Entry'}
        </button>
      </div>
      
      {/* Simple manual input */}
      {selectionMethod === 'manual' && !showLocationDetails && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder={placeholder}
          value={value}
          onChange={handleManualInput}
        />
      )}
      
      {/* Detailed location form */}
      {selectionMethod === 'manual' && showLocationDetails && (
        <div className="space-y-2 border border-primary-300 rounded-md p-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={locationDetails.country}
                onChange={(e) => handleDetailedLocationChange('country', e.target.value)}
                placeholder="Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={locationDetails.state}
                onChange={(e) => handleDetailedLocationChange('state', e.target.value)}
                placeholder="State"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={locationDetails.city}
                onChange={(e) => handleDetailedLocationChange('city', e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">District</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={locationDetails.district}
                onChange={(e) => handleDetailedLocationChange('district', e.target.value)}
                placeholder="District"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Landmark</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={locationDetails.landmark}
              onChange={(e) => handleDetailedLocationChange('landmark', e.target.value)}
              placeholder="Landmark or specific location"
            />
          </div>
        </div>
      )}
      
      {/* Map selection button - in a real app, this would open a map interface */}
      {selectionMethod === 'manual' && (
        <button
          type="button"
          className="mt-2 flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
          onClick={() => alert("Map selection would open here in a real application")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Select on Map
        </button>
      )}
    </div>
  );
}

export default LocationSelector;