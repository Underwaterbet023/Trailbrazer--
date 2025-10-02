import React from 'react';
import LiveMap from '../components/map/LiveMap';

function LiveLocation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Live Location Tracking</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          This page shows your current location in real-time. Your location data is only used for display purposes and is not stored unless you explicitly save a trip.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <LiveMap />
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Location Tracking</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Privacy Information</h3>
            <p className="text-gray-600">
              Your location data is only processed on your device and is not sent to our servers unless you explicitly save a trip. 
              You can stop location tracking at any time by clicking the "Stop Tracking" button.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Location Accuracy</h3>
            <p className="text-gray-600">
              Location accuracy depends on your device's GPS capabilities and environmental factors. 
              The accuracy radius shown on the map indicates the approximate precision of your location.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Battery Usage</h3>
            <p className="text-gray-600">
              Continuous location tracking may increase battery consumption. We recommend disabling tracking when not in use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveLocation;