import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AttractionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Sample attractions data - in a real app, this would come from an API
  const attractionsData = [
    {
      id: 1,
      name: 'Mountain View Cafe',
      type: 'restaurant',
      distance: '1.2 km',
      rating: 4.7,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Cozy cafe with panoramic mountain views and excellent coffee.',
      address: '123 Mountain Road, Hillside District',
      phone: '+1 (555) 123-4567',
      website: 'www.mountainviewcafe.com',
      hours: 'Mon-Fri: 7am-8pm, Sat-Sun: 8am-9pm',
      features: ['Outdoor Seating', 'Wi-Fi', 'Vegan Options', 'Pet Friendly'],
      menu: [
        { name: 'Mountain Blend Coffee', price: '$3.50', description: 'Our signature blend with notes of chocolate and hazelnut' },
        { name: 'Avocado Toast', price: '$8.95', description: 'Sourdough bread with fresh avocado, cherry tomatoes, and microgreens' },
        { name: 'Berry Parfait', price: '$6.50', description: 'Greek yogurt with fresh berries, honey, and homemade granola' }
      ],
      photos: [
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 2,
      name: 'Heritage Museum',
      type: 'attraction',
      distance: '3.5 km',
      rating: 4.5,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1566127992631-137a642a90f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzZXVtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Explore local history and culture at this well-preserved museum.',
      address: '456 Heritage Avenue, Downtown',
      phone: '+1 (555) 987-6543',
      website: 'www.heritagemuseum.org',
      hours: 'Tue-Sun: 10am-6pm, Closed on Mondays',
      features: ['Guided Tours', 'Gift Shop', 'Wheelchair Accessible', 'Audio Guides'],
      exhibits: [
        { name: 'Ancient Artifacts', description: 'Collection of artifacts dating back to 3000 BCE' },
        { name: 'Local History', description: 'Exhibits showcasing the evolution of the city over 200 years' },
        { name: 'Interactive Science', description: 'Hands-on exhibits exploring principles of physics and chemistry' }
      ],
      photos: [
        'https://images.unsplash.com/photo-1566127992631-137a642a90f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzZXVtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1565060169861-2d4b3c5126ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8bXVzZXVtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1626271763156-00e3d2a7c9a9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG11c2V1bXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 3,
      name: 'Riverside Park',
      type: 'park',
      distance: '2.1 km',
      rating: 4.6,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Peaceful park with walking trails, picnic areas, and river views.',
      address: '789 Riverside Drive, Waterfront District',
      phone: '+1 (555) 456-7890',
      website: 'www.riversidepark.gov',
      hours: 'Open daily: 6am-10pm',
      features: ['Walking Trails', 'Picnic Areas', 'Playground', 'Dog Park', 'Boat Rentals'],
      activities: [
        { name: 'Hiking', description: '5 miles of scenic trails with varying difficulty levels' },
        { name: 'Boating', description: 'Kayak and canoe rentals available at the boathouse' },
        { name: 'Bird Watching', description: 'Over 100 species of birds can be spotted throughout the year' }
      ],
      photos: [
        'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1500630417200-63156e226754?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGFya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1534251623184-22cb7e61c526?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGFya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
      ]
    },
    {
      id: 4,
      name: 'Seafood Grill',
      type: 'restaurant',
      distance: '4.3 km',
      rating: 4.4,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2VhZm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Fresh seafood prepared with local ingredients and unique flavors.',
      address: '321 Harbor Street, Marina District',
      phone: '+1 (555) 789-0123',
      website: 'www.seafoodgrill.com',
      hours: 'Mon-Sun: 11am-10pm',
      features: ['Waterfront View', 'Full Bar', 'Outdoor Seating', 'Private Dining'],
      menu: [
        { name: 'Grilled Salmon', price: '$24.95', description: 'Fresh salmon with lemon herb butter and seasonal vegetables' },
        { name: 'Seafood Pasta', price: '$22.50', description: 'Linguine with shrimp, clams, and mussels in white wine sauce' },
        { name: 'Lobster Roll', price: '$19.95', description: 'Maine lobster with light mayo on a toasted brioche bun' }
      ],
      photos: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2VhZm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2VhZm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1579631542720-3a87824fff86?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c2VhZm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch attraction details
    setLoading(true);
    setTimeout(() => {
      const foundAttraction = attractionsData.find(a => a.id === parseInt(id));
      setAttraction(foundAttraction || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Attraction not found</h2>
        <p className="mt-2 text-gray-600">The attraction you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Recommendations
      </button>
      
      {/* Hero section */}
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
        <img 
          src={attraction.image} 
          alt={attraction.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-white">
            <div className="flex items-center mb-2">
              <span className="px-2 py-1 bg-primary-600 text-white text-xs font-bold uppercase rounded-md mr-2">
                {attraction.type}
              </span>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm">{attraction.rating}</span>
                <span className="mx-1">•</span>
                <span className="text-sm">{attraction.reviews} reviews</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold">{attraction.name}</h1>
            <p className="text-gray-200">{attraction.distance} from your location</p>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`${activeTab === 'photos' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`${activeTab === 'reviews' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`${activeTab === 'nearby' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Nearby
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">About {attraction.name}</h2>
                <p className="text-gray-700 mb-6">{attraction.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-600">{attraction.address}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Hours</h3>
                    <p className="text-gray-600">{attraction.hours}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600">{attraction.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Website</h3>
                    <a href={`https://${attraction.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      {attraction.website}
                    </a>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {attraction.features.map((feature, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Type-specific content */}
              {attraction.type === 'restaurant' && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Popular Menu Items</h2>
                  <div className="space-y-4">
                    {attraction.menu.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <span className="font-medium text-gray-900">{item.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {attraction.type === 'attraction' && attraction.exhibits && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Featured Exhibits</h2>
                  <div className="space-y-4">
                    {attraction.exhibits.map((exhibit, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium text-gray-900">{exhibit.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{exhibit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {attraction.type === 'park' && attraction.activities && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Activities</h2>
                  <div className="space-y-4">
                    {attraction.activities.map((activity, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium text-gray-900">{activity.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Map */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="mt-2">Interactive map would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attraction.photos.map((photo, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img 
                      src={photo} 
                      alt={`${attraction.name} - Photo ${index + 1}`} 
                      className="w-full h-48 object-cover hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Write a Review
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Sample reviews */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">JD</div>
                    <div className="ml-3">
                      <div className="font-medium">John Doe</div>
                      <div className="text-gray-500 text-sm">Visited 2 weeks ago</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`h-5 w-5 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700">Absolutely loved this place! The atmosphere was amazing and the service was top-notch. Would definitely recommend to anyone visiting the area.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">AS</div>
                    <div className="ml-3">
                      <div className="font-medium">Alice Smith</div>
                      <div className="text-gray-500 text-sm">Visited 1 month ago</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700">Great experience overall. The only reason I'm giving 4 stars instead of 5 is because it was a bit crowded when we visited. Otherwise, everything was perfect!</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">RJ</div>
                    <div className="ml-3">
                      <div className="font-medium">Robert Johnson</div>
                      <div className="text-gray-500 text-sm">Visited 3 months ago</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`h-5 w-5 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700">One of the best experiences I've had. The staff was friendly and attentive, and everything exceeded my expectations. Will definitely be coming back!</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Nearby Tab */}
          {activeTab === 'nearby' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Nearby Attractions</h2>
              <div className="space-y-4">
                {attractionsData
                  .filter(a => a.id !== attraction.id)
                  .map(place => (
                    <div key={place.id} className="flex border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={place.image} 
                          alt={place.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900">{place.name}</h3>
                        <div className="flex items-center mt-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm text-gray-600">{place.rating}</span>
                          <span className="mx-1 text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{place.distance}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{place.description}</p>
                        <button 
                          onClick={() => navigate(`/attraction/${place.id}`)}
                          className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Action Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Plan Your Visit</h2>
            <div className="space-y-4">
              <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 transition">
                Add to Trip
              </button>
              <button className="w-full bg-white text-primary-600 py-2 px-4 rounded-md font-medium border border-primary-600 hover:bg-primary-50 transition">
                Get Directions
              </button>
              <button className="w-full bg-white text-gray-700 py-2 px-4 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition">
                Share
              </button>
            </div>
          </div>
          
          {/* Weather Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Weather</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-10 w-10 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div className="ml-3">
                  <div className="text-gray-900 font-medium">Sunny</div>
                  <div className="text-gray-500 text-sm">Perfect day to visit!</div>
                </div>
              </div>
              <div className="text-2xl font-bold">28°C</div>
            </div>
          </div>
          
          {/* Opening Hours Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Opening Hours</h2>
            <div className="text-gray-700">
              <p className="mb-1">{attraction.hours}</p>
              <div className="mt-3 text-sm">
                <div className="flex justify-between py-1">
                  <span className="font-medium">Today</span>
                  <span className="text-green-600 font-medium">Open Now</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Opens 7:00 AM</span>
                  <span>Closes 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttractionDetail;