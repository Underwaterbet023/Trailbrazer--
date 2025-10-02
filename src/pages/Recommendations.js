import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

function Recommendations() {
  const [activeTab, setActiveTab] = useState('routes');
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    if (query) {
      setSearchTerm(query);
    }
  }, [location.search]);
  
  // Sample data for recommendations
  const recommendedRoutes = [
    {
      id: 1,
      title: 'Scenic Route ',
      origin: 'Home',
      destination: 'Grassland',
      distance: '75 km',
      duration: '3 hour',
      attractions: ['City Park', 'Lakeside View', 'Historic Building'],
      description: 'A beautiful route with scenic views and less traffic. Perfect for a relaxed morning commute.',
      rating: 4.5,
      mapImage: require('../assets/images/maps/route1.jpg'),
      waypoints: [
        { name: 'Home', time: '0 min', description: 'Starting point' },
        { name: 'City Park', time: '1 hour', description: 'Beautiful park with walking paths and a small lake' },
        { name: 'Lakeside View', time: '20 min', description: 'Scenic viewpoint overlooking the city lake' },
        { name: 'Historic Building', time: '2 hour', description: 'Well-preserved colonial era building with architecture tours' },
        { name: 'Grassland', time: '3 hour', description: 'Destination' }
      ],
      transportOptions: [
        { mode: 'Car', duration: '3 hour', cost: '₹1200' },
        { mode: 'Bike', duration: '4 hour', cost: '₹600' },
        { mode: 'Public Transit', duration: '2 hour', cost: '₹1300' }
      ]
    },
    {
      id: 2,
      title: 'Quick Route to Shopping Mall',
      origin: 'Home',
      destination: 'Central Mall',
      distance: '8 km',
      duration: '35 mins',
      attractions: ['Coffee Shop', 'Bookstore'],
      description: 'The fastest route to reach the mall, avoiding major traffic signals.',
      rating: 4.2,
      mapImage: require('../assets/images/maps/route2.jpg'),
      waypoints: [
        { name: 'Home', time: '0 min', description: 'Starting point' },
        { name: 'Coffee Shop', time: '10 min', description: 'Popular local coffee shop with specialty brews' },
        { name: 'Bookstore', time: '20 min', description: 'Large bookstore with reading areas and cafe' },
        { name: 'Central Mall', time: '30 min', description: 'Destination' }
      ],
      transportOptions: [
        { mode: 'Car', duration: '20 mins', cost: '₹80' },
        { mode: 'Bike', duration: '30 mins', cost: '₹60' },
        { mode: 'Public Transit', duration: '35 mins', cost: '₹25' }
      ]
    },
    {
      id: 3,
      title: 'Weekend Getaway Route',
      origin: 'Home',
      destination: 'Beach Resort',
      distance: '45 km',
      duration: '1 hr 15 mins',
      attractions: ['Viewpoint', 'Waterfall', 'Countryside', 'Local Market'],
      description: 'A leisure drive through scenic countryside with multiple attractions along the way.',
      rating: 4.8,
      mapImage: require('../assets/images/maps/route3.jpg'),
      waypoints: [
        { name: 'Home', time: '0 min', description: 'Starting point' },
        { name: 'Viewpoint', time: '20 min', description: 'Panoramic views of the valley and mountains' },
        { name: 'Waterfall', time: '40 min', description: 'Beautiful 30-foot waterfall with swimming area' },
        { name: 'Countryside', time: '55 min', description: 'Scenic rural landscapes with farms and fields' },
        { name: 'Local Market', time: '1 hr 5 min', description: 'Traditional market with local crafts and food' },
        { name: 'Beach Resort', time: '1 hr 15 min', description: 'Destination' }
      ],
      transportOptions: [
        { mode: 'Car', duration: '1 hr 15 mins', cost: '₹350' },
        { mode: 'Bike', duration: '2 hrs 30 mins', cost: '₹200' },
        { mode: 'Public Transit', duration: '2 hrs', cost: '₹420' }
      ]
    },
    {
      id: 4,
      title: 'Historical City Tour',
      origin: 'Hotel',
      destination: 'Old City Center',
      distance: '22 km',
      duration: '2 hour',
      attractions: ['Ancient Temple', 'Heritage Museum', 'Royal Palace', 'Artisan Market'],
      description: 'Explore the rich cultural heritage of the old city with stops at key historical landmarks.',
      rating: 4.7,
      mapImage: require('../assets/images/maps/route4.jpg'),
      waypoints: [
        { name: 'Hotel', time: '0 min', description: 'Starting point' },
        { name: 'Ancient Temple', time: '30 min', description: '800-year-old temple with intricate carvings' },
        { name: 'Heritage Museum', time: '20 min', description: 'Museum showcasing local history and artifacts' },
        { name: 'Royal Palace', time: '20 min', description: 'Former royal residence with guided tours' },
        { name: 'Artisan Market', time: '25 min', description: 'Traditional market with local crafts and souvenirs' },
        { name: 'Old City Center', time: '2 hour', description: 'Destination' }
      ],
      transportOptions: [
        { mode: 'Car', duration: '30 mins', cost: '₹400' },
        { mode: 'Bike', duration: '45 mins', cost: '₹200' },
        { mode: 'Public Transit', duration: '40 mins', cost: '₹350' }
      ]
    },
    {
      id: 5,
      title: 'Nature Trail Adventure',
      origin: 'City Center',
      destination: 'National Park',
      distance: '25 km',
      duration: '2 hour',
      attractions: ['Botanical Garden', 'Bird Sanctuary', 'Hiking Trail', 'Mountain View'],
      description: 'A nature lover\'s route with diverse flora and fauna, perfect for photography and hiking.',
      rating: 4.9,
      mapImage: require('../assets/images/maps/route5.jpg'),
      waypoints: [
        { name: 'City Center', time: '0 min', description: 'Starting point' },
        { name: 'Botanical Garden', time: '15 min', description: 'Garden with rare plant species and flower displays' },
        { name: 'Bird Sanctuary', time: '10 min', description: 'Protected area with over 100 bird species' },
        { name: 'Hiking Trail', time: '40 min', description: 'Moderate difficulty trail with scenic views' },
        { name: 'Mountain View', time: '45 min', description: 'Panoramic viewpoint overlooking the valley' },
        { name: 'National Park', time: '2 hour', description: 'Destination' }
      ],
      transportOptions: [
        { mode: 'Car', duration: '50 mins', cost: '₹350' },
        { mode: 'Bike', duration: '1 hr 30 mins', cost: '₹200' },
        { mode: 'Public Transit', duration: '1 hr 15 mins', cost: '₹260' }
      ]
    },

    {
      id: 6,
      title: 'Fun Trail Adventure',
      origin: 'City Center',
      destination: 'Ammusement Park',
      distance: '25 km',
      duration: '50 mins',
      attractions: ['Ammusement Park', 'Waterpark', 'Roller Coaster', 'Kiddie Rides'],
      description: 'A fun-filled route with amusement park rides, water parks, and thrilling roller coasters.',
      rating: 4.9,
      mapImage: require('../assets/images/maps/route6.jpg'),
      waypoints: [
        { name: 'City Center', time: '0 min', description: 'Starting point' },
        { name: 'Ammusement Park', time: '15 min', description: 'Fun-filled amusement park with rides, water parks, and roller coasters' },
        { name: 'Waterpark', time: '30 min', description: 'Waterpark with fun-filled water rides and games' },
        { name: 'Roller Coaster', time: '40 min', description: 'Thrilling roller coaster with a fast-paced ride' },
        { name: 'Kiddie Rides', time: '45 min', description: 'Family-friendly rides for children' },
        { name: 'Ammusement Park', time: '50 min', description: 'Destination' }
      ],
      transportOptions: [
        { mode: 'Car', duration: '50 mins', cost: '₹350' },
        { mode: 'Bike', duration: '1 hr 30 mins', cost: '₹200' },
        { mode: 'Public Transit', duration: '1 hr 15 mins', cost: '₹260' }
      ]
    }
  ];
  
  const nearbyPlaces = [
    {
      id: 1,
      name: 'Mountain Cafe',
      type: 'restaurant',
      distance: '1.2 km',
      rating: 4.7,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Cozy cafe with panoramic mountain views and excellent coffee.'
    },
    {
      id: 2,
      name: 'Heritage Museum',
      type: 'attraction',
      distance: '3.5 km',
      rating: 4.5,
      reviews: 312,
      image: 'https://tse2.mm.bing.net/th/id/OIP.IHbldF_mZiMFn9m3LN0fwwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
      description: 'Explore local history and culture at this well-preserved museum.'
    },
    {
      id: 3,
      name: 'Riverside Park',
      type: 'park',
      distance: '2.1 km',
      rating: 4.6,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Peaceful park with walking trails, picnic areas, and river views.'
    },
    {
      id: 4,
      name: 'Seafood Grill',
      type: 'restaurant',
      distance: '4.3 km',
      rating: 4.4,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2VhZm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Fresh seafood prepared with local ingredients and unique flavors.'
    }
  ];
  
  const tripPackages = [
    {
      id: 1,
      title: 'Weekend City Explorer',
      duration: '7 days',
      budget: '$200-$300',
      activities: ['City Tour', 'Museum Visit', 'Local Cuisine Tasting', 'Shopping'],
      description: 'Perfect for a quick weekend getaway to explore the city highlights.',
      rating: 4.3,
      image: 'https://www.touropia.com/gfx/d/best-places-to-visit-in-usa/orlando.jpg?v=ebe1017033950f50bd70537740fc33fb'
    },
    {
      id: 2,
      title: 'Nature Retreat',
      duration: '3 days',
      budget: '$250-$400',
      activities: ['Hiking', 'Camping', 'Wildlife Spotting', 'Bonfire Night'],
      description: 'Escape to nature with this refreshing retreat package in the mountains.',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlJTIwcmV0cmVhdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      title: 'Cultural Immersion',
      duration: '4 days',
      budget: '$300-$500',
      activities: ['Heritage Sites', 'Local Workshops', 'Traditional Performances', 'Culinary Classes'],
      description: 'Dive deep into local culture and traditions with guided experiences.',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y3VsdHVyYWwlMjBpbW1lcnNpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Recommendations</h1>
      
      {/* Search Results */}
      {searchTerm && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Search Results for "{searchTerm}"</h2>
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <p className="text-gray-600">Showing recommendations related to your search.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                navigate('/recommendations');
              }}
              className="mt-2 text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'routes' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('routes')}
        >
          Suggested Routes
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'nearby' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('nearby')}
        >
          Nearby Attractions
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'packages' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('packages')}
        >
          Trip Packages
        </button>
      </div>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('routes')}
            className={`${activeTab === 'routes' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Suggested Routes
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`${activeTab === 'nearby' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Nearby Attractions
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`${activeTab === 'packages' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Trip Packages
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* Suggested Routes Tab */}
        {activeTab === 'routes' && !showRouteDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedRoutes.map(route => (
              <div key={route.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Route Map Preview */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={route.mapImage} 
                    alt={`Map of ${route.title}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{display: 'none'}}>
                    <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-medium text-gray-700 shadow">
                    {route.distance} • {route.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{route.title}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-600">{route.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-700">From:</span>
                      <span className="ml-1">{route.origin}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="font-medium text-gray-700">To:</span>
                      <span className="ml-1">{route.destination}</span>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-600">{route.description}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Points of Interest:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {route.attractions.map((attraction, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {attraction}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <button 
                      onClick={() => {
                        setSelectedRoute(route);
                        setShowRouteDetails(true);
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedRoute(route);
                        toast.success(`Route "${route.title}" selected!`);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Select Route
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Route Details View */}
        {activeTab === 'routes' && showRouteDetails && selectedRoute && (
          <div className="bg-white rounded-lg border p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-primary-700">{selectedRoute.title}</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span>{selectedRoute.origin}</span>
                  <span className="mx-2">→</span>
                  <span>{selectedRoute.destination}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedRoute.distance}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedRoute.duration}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowRouteDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <img 
                src={selectedRoute.mapImage} 
                alt={`Map for ${selectedRoute.title}`} 
                className="w-full h-64 object-cover rounded-lg border"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Route Description</h3>
                <p className="text-gray-700">{selectedRoute.description}</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-3">Attractions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRoute.attractions.map((attraction, idx) => (
                    <span key={idx} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                      {attraction}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Transport Options</h3>
                <div className="space-y-3">
                  {selectedRoute.transportOptions.map((option, idx) => (
                    <div key={idx} className="flex justify-between p-3 border rounded-lg">
                      <div className="font-medium">{option.mode}</div>
                      <div className="text-gray-600">{option.duration}</div>
                      <div className="font-semibold">{option.cost}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Waypoints</h3>
              <div className="relative">
                {selectedRoute.waypoints.map((waypoint, idx) => (
                  <div key={idx} className="flex mb-4 relative">
                    <div className="mr-4 relative">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center z-10 relative">
                        {idx + 1}
                      </div>
                      {idx < selectedRoute.waypoints.length - 1 && (
                        <div className="absolute top-8 bottom-0 left-4 w-0.5 bg-primary-200 -z-10"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{waypoint.name}</div>
                      <div className="text-sm text-gray-500">{waypoint.time}</div>
                      <div className="text-sm text-gray-600 mt-1">{waypoint.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setShowRouteDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Routes
              </button>
              <button 
                onClick={() => {
                  toast.success(`Route "${selectedRoute.title}" selected!`);
                  // Could navigate to a booking page or add to cart
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Select This Route
              </button>
            </div>
          </div>
        )}
        
        {/* Nearby Attractions Tab */}
        {activeTab === 'nearby' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyPlaces.map(place => (
              <div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{display: 'none'}}>
                    <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-700 shadow">
                    {place.distance}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium text-white bg-black/50 capitalize">
                      {place.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-600">{place.rating}</span>
                      <span className="mx-1 text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{place.reviews} reviews</span>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-600">{place.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Link to={`/attraction/${place.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details
                    </Link>
                    <button 
                      onClick={() => {
                        const success = addToCart({
                          id: place.id,
                          type: 'attraction',
                          name: place.name,
                          description: place.description,
                          image: place.image,
                          price: Math.floor(Math.random() * 500) + 100 // Random price for demo
                        });
                        if (success) {
                          toast.success(`${place.name} added to your trip!`);
                        } else {
                          toast.info(`${place.name} is already in your trip`);
                        }
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Trip Packages Tab */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tripPackages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                {/* Package Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={`${pkg.title} package`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{display: 'none'}}>
                    <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-medium text-gray-700 shadow">
                    {pkg.duration}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900">{pkg.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {pkg.budget}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">{pkg.rating}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{pkg.duration}</span>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600">{pkg.description}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Activities:</h4>
                    <ul className="mt-2 space-y-1">
                      {pkg.activities.map((activity, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <button 
                      onClick={() => {
                        const success = addToCart({
                          id: pkg.id,
                          type: 'package',
                          name: pkg.title,
                          description: pkg.description,
                          price: parseInt(pkg.budget.split('-')[0].replace('$', '')),
                          duration: pkg.duration
                        });
                        if (success) {
                          toast.success(`${pkg.title} added to your trip!`);
                        } else {
                          toast.info(`${pkg.title} is already in your trip`);
                        }
                      }}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;