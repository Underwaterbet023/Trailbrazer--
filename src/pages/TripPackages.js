import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasActiveBooking } from '../utils/bookingStorage';
import { AlertCircle, Bug } from 'lucide-react';

const tripPackages = [
  {
    id: 1,
    name: 'Golden Triangle Tour',
    description: 'Explore Delhi, Agra, and Jaipur in this classic Indian tour package',
    duration: '6 days, 5 nights',
    price: 24999,
    image: 'https://storage.googleapis.com/prune/blog_image/Golden-tringle.jpg',
    highlights: ['Taj Mahal', 'Amber Fort', 'Qutub Minar', 'City Palace']
  },
  {
    id: 2,
    name: 'Kerala Backwaters',
    description: 'Experience the serene backwaters and lush landscapes of God\'s Own Country',
    duration: '5 days, 4 nights',
    price: 19999,
    image: 'https://www.ekeralatourism.net/wp-content/uploads/2019/04/keralabacwater-sept.jpg',
    highlights: ['Houseboat Stay', 'Munnar Tea Gardens', 'Kovalam Beach', 'Periyar Wildlife']
  },
  {
    id: 3,
    name: 'Himalayan Adventure',
    description: 'Trek through the majestic Himalayas and experience the mountain culture',
    duration: '7 days, 6 nights',
    price: 29999,
    image: 'https://trisoj.com/travel-guide/wp-content/uploads/2023/08/Places-to-visit-in-Shimla-Kullu-Manali.jpg',
    highlights: ['Shimla', 'Manali', 'Dharamshala', 'Dalhousie']
  },
  {
    id: 4,
    name: 'Goa Beach Getaway',
    description: 'Relax on the beautiful beaches of Goa and enjoy water sports',
    duration: '4 days, 3 nights',
    price: 15999,
    image: 'https://www.adotrip.com/public/images/areas/master_images/60d0813807aff-Baga_Beach_In_Goa.jpg',
    highlights: ['Calangute Beach', 'Water Sports', 'Nightlife', 'Dudhsagar Falls']
  },
  {
    id: 5,
    name: 'Rajasthan Heritage Tour',
    description: 'Discover the royal heritage and culture of Rajasthan',
    duration: '8 days, 7 nights',
    price: 32999,
    image: 'https://www.tripnstay.com/wp-content/uploads/2023/04/raj-1024x587.jpg',
    highlights: ['Udaipur Lake Palace', 'Jodhpur Fort', 'Jaisalmer Desert Safari', 'Pushkar']
  },
  {
    id: 6,
    name: 'Northeast Explorer',
    description: 'Explore the unexplored beauty of India\'s Northeast states',
    duration: '9 days, 8 nights',
    price: 35999,
    image: 'https://www.tourism-of-india.com/blog/wp-content/uploads/2018/06/Tawang-Arunachal-Pradesh.jpg',
    highlights: ['Kaziranga National Park', 'Cherrapunji', 'Tawang Monastery', 'Majuli Island']
  }
];

function TripPackages() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [travelers, setTravelers] = useState(1);
  const [departureDate, setDepartureDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visiblePackages, setVisiblePackages] = useState([]);
  const [hoveredPackage, setHoveredPackage] = useState(null);
  const [activeBookingExists, setActiveBookingExists] = useState(false);

  // Animate packages on load and check for active bookings
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisiblePackages(tripPackages);
    }, 100);
    
    // Check for active bookings
    const checkActiveBooking = () => {
      setActiveBookingExists(hasActiveBooking());
    };
    
    checkActiveBooking();
    
    // Set up interval to check for booking changes
    const bookingCheckInterval = setInterval(checkActiveBooking, 1000); // Check every second
    
    // Listen for storage changes (when bookings are added/removed)
    const handleStorageChange = () => {
      checkActiveBooking();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearTimeout(timer);
      clearInterval(bookingCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Debug function to check booking status
  const debugBookingStatus = () => {
    const bookingSummary = JSON.parse(localStorage.getItem('bookings') || '[]');
    console.log('Current bookings:', bookingSummary);
    console.log('hasActiveBooking():', hasActiveBooking());
    console.log('activeBookingExists state:', activeBookingExists);
    alert(`Debug Info:\nTotal bookings: ${bookingSummary.length}\nActive booking exists: ${hasActiveBooking()}\nState activeBookingExists: ${activeBookingExists}`);
  };

  const handlePackageSelect = (pkg) => {
    // Check if user has an active booking
    if (hasActiveBooking()) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleBookNow = () => {
    if (!departureDate) {
      alert('Please select a departure date');
      return;
    }

    // Double-check for active bookings before proceeding
    if (hasActiveBooking()) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      setShowModal(false);
      return;
    }

    setIsLoading(true);
    
    // Create booking details for payment page
    setTimeout(() => {
      const bookingDetails = {
        id: `TP-${Date.now().toString().slice(-6)}`,
        type: 'Trip Package',
        name: selectedPackage.name,
        price: selectedPackage.price * travelers,
        date: departureDate,
        travelers: travelers,
        duration: selectedPackage.duration,
        status: 'Pending Payment',
        details: {
          'Booking ID': `TP-${Date.now().toString().slice(-6)}`,
          'Package': selectedPackage.name,
          'Travelers': travelers,
          'Departure': departureDate,
          'Duration': selectedPackage.duration,
          'Payment': 'Pending'
        }
      };

      const totalAmount = selectedPackage.price * travelers;
      
      setIsLoading(false);
      setShowModal(false);
      
      // Navigate to payment page with booking details
      navigate('/payment', {
        state: {
          bookingDetails: bookingDetails,
          totalAmount: totalAmount,
          bookingType: 'Trip Package'
        }
      });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Active Booking Warning */}
      {activeBookingExists && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Active Booking Detected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You already have an active booking. Please complete or delete your current booking before making a new one.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Animated Header */}
      <div className="flex justify-between items-center mb-8 animate-fadeIn">
        <div className="animate-slideInLeft">
          <h1 className="text-4xl font-bold mb-2 text-primary-700 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Trip Packages
          </h1>
          <p className="text-gray-600 text-lg">Choose from our curated selection of travel packages across India</p>
        </div>
        <button
          onClick={debugBookingStatus}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700 transition-colors duration-300"
        >
          <Bug className="w-4 h-4 mr-2" />
          Debug
        </button>
      </div>

      {/* Animated Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePackages.map((pkg, index) => (
          <div 
            key={pkg.id} 
            className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group animate-fadeInUp ${
              hoveredPackage === pkg.id ? 'ring-4 ring-primary-200' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredPackage(pkg.id)}
            onMouseLeave={() => setHoveredPackage(null)}
          >
            {/* Enhanced Image Container */}
            <div className="relative overflow-hidden">
              <img 
                src={pkg.image} 
                alt={pkg.name} 
                className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-700 shadow-lg">
                  {pkg.duration}
                </span>
              </div>
            </div>
            
            {/* Enhanced Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
                  {pkg.name}
                </h2>
                <span className="text-2xl font-bold text-primary-600">
                  ₹{pkg.price.toLocaleString()}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {pkg.description}
              </p>
              
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 13.047 14.01c-.04.27-.24.49-.51.51h-.054c-.27-.02-.47-.24-.51-.51L9.854 7.2 11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                Highlights:
              </h3>
              
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                {pkg.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center group-hover:translate-x-1 transition-transform duration-300">
                    <span className="mr-3 text-primary-500 group-hover:text-primary-600 transition-colors duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="group-hover:text-gray-800 transition-colors duration-300">{highlight}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handlePackageSelect(pkg)}
                disabled={activeBookingExists}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md group-hover:shadow-xl ${
                  activeBookingExists
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
                }`}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {activeBookingExists ? 'Booking Restricted' : 'Book Now'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Booking Modal */}
      {showModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-8 animate-scaleIn shadow-2xl">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPackage.name}</h2>
              <p className="text-gray-600">Complete your booking details</p>
              
              {/* Active Booking Warning in Modal */}
              {activeBookingExists && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Booking Restricted</h3>
                    <p className="text-xs text-yellow-700">
                      You already have an active booking. This will replace your current booking.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Booking Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Number of Travelers
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num} className="py-2">
                      {num} {num === 1 ? 'person' : 'people'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Departure Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            {/* Price Summary */}
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4 mt-6 border border-primary-100">
              <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2">
                <span>Package Price:</span>
                <span>₹{selectedPackage.price.toLocaleString()} × {travelers}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-primary-700 border-t border-primary-200 pt-2">
                <span>Total Amount:</span>
                <span className="text-2xl">₹{(selectedPackage.price * travelers).toLocaleString()}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleBookNow}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripPackages;