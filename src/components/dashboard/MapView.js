import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Car, Users, Star, Route, Info } from 'lucide-react';

function MapView({ origin, destination, waypoints = [] }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeData, setRouteData] = useState({
    distance: '12.5 km',
    duration: '25 mins',
    traffic: 'Light',
    tolls: 2
  });

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoaded(true), 500);
  }, []);

  // Calculate route statistics
  const calculateRouteStats = () => {
    const baseDistance = Math.random() * 20 + 5; // 5-25 km
    const baseDuration = Math.random() * 40 + 15; // 15-55 mins
    
    return {
      distance: `${baseDistance.toFixed(1)} km`,
      duration: `${Math.round(baseDuration)} mins`,
      traffic: ['Light', 'Moderate', 'Heavy'][Math.floor(Math.random() * 3)],
      tolls: Math.floor(Math.random() * 4)
    };
  };

  useEffect(() => {
    if (origin && destination) {
      setRouteData(calculateRouteStats());
    }
  }, [origin, destination]);

  // Generate route path for SVG
  const generateRoutePath = () => {
    const points = [];
    const numPoints = waypoints.length + 2; // origin + destination + waypoints
    
    // Add origin point
    points.push({ x: 50, y: 30 });
    
    // Add waypoint points
    waypoints.forEach((_, index) => {
      points.push({
        x: 50 + (index + 1) * (100 / numPoints),
        y: 30 + Math.sin(index * 0.5) * 20 + Math.random() * 20
      });
    });
    
    // Add destination point
    points.push({ x: 150, y: 70 });
    
    // Generate smooth curve path
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const controlX = (prev.x + curr.x) / 2;
      const controlY = (prev.y + curr.y) / 2 + Math.random() * 10;
      path += ` Q ${controlX} ${controlY} ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Navigation className="w-5 h-5 mr-2" />
              Trip Route Visualization
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              {origin} → {destination}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
            <span className="text-white text-sm font-medium">{waypoints.length + 1} stops</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 h-80 w-full overflow-hidden">
        {/* Map Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3B82F6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Loading State */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading interactive map...</p>
            </div>
          </div>
        )}

        {/* Map Content */}
        {mapLoaded && (
          <div className="relative w-full h-full">
            {/* Route Path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
              {/* Background route line */}
              <path 
                d={generateRoutePath()}
                stroke="#E5E7EB" 
                strokeWidth="4" 
                fill="none" 
                strokeDasharray="2,2"
              />
              
              {/* Animated route line */}
              <path 
                d={generateRoutePath()}
                stroke="url(#routeGradient)" 
                strokeWidth="3" 
                fill="none" 
                strokeDasharray="10,5"
                className="animate-pulse"
              />
              
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Origin Marker */}
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 group">
              <div className="relative">
                <div className="h-6 w-6 rounded-full bg-green-500 border-4 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-green-500 opacity-30 animate-ping"></div>
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg whitespace-nowrap group-hover:scale-105 transition-transform">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {origin}
                </div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rotate-45"></div>
              </div>
            </div>

            {/* Destination Marker */}
            <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 group">
              <div className="relative">
                <div className="h-6 w-6 rounded-full bg-red-500 border-4 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-red-500 opacity-30 animate-ping"></div>
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg whitespace-nowrap group-hover:scale-105 transition-transform">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {destination}
                </div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
              </div>
            </div>

            {/* Waypoint Markers */}
            {waypoints.map((waypoint, index) => (
              <div 
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  top: `${25 + (index * 15)}%`,
                  left: `${30 + (index * 20)}%`,
                }}
              >
                <div className="relative">
                  <div className="h-5 w-5 rounded-full bg-blue-500 border-3 border-white shadow-md animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}></div>
                  <div className="absolute -inset-1 rounded-full bg-blue-500 opacity-20 animate-ping" style={{ animationDelay: `${index * 0.2}s` }}></div>
                </div>
                <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {waypoint.name}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>
                </div>
              </div>
            ))}

            {/* Interactive Elements */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-2 shadow-md transition-all duration-200 hover:scale-105">
                <Route className="w-4 h-4 text-gray-600" />
              </button>
              <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-2 shadow-md transition-all duration-200 hover:scale-105">
                <Info className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Route Information */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Distance</p>
                <p className="text-lg font-bold text-gray-900">{routeData.distance}</p>
              </div>
              <Route className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Duration</p>
                <p className="text-lg font-bold text-gray-900">{routeData.duration}</p>
              </div>
              <Clock className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Traffic</p>
                <p className="text-lg font-bold text-gray-900">{routeData.traffic}</p>
              </div>
              <Car className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Tolls</p>
                <p className="text-lg font-bold text-gray-900">{routeData.tolls}</p>
              </div>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>
        
        {/* Route Summary */}
        <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">Route Summary</h4>
            <div className="flex items-center text-xs text-gray-500">
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              Recommended Route
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>Fastest route with minimal traffic, {waypoints.length} stops along the way</p>
            <p className="text-xs text-gray-500 mt-1">Updated just now • Live traffic data</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;