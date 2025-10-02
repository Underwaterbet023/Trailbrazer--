import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { hasActiveBooking } from '../utils/bookingStorage';
import { AlertCircle } from 'lucide-react';

const mockRestaurants = [
  {
    id: 'r1',
    name: 'Spice Villa',
    description: 'Authentic Indian cuisine with a modern twist.',
    reviews: [
      'Amazing food and great ambiance!',
      'Loved the butter chicken and naan.',
    ],
    area: 'Mumbai',
    image: require('../assets/images/hotels-restaurants/spice-villa.jpg'),
    price: 1200, // Price for two people
    cuisine: 'North Indian, Mughlai',
    rating: 4.5,
    timings: '11:00 AM - 11:00 PM',
    address: '123 Food Street, Mumbai',
    menu: [
      { name: 'Butter Chicken', price: 350 },
      { name: 'Paneer Tikka', price: 280 },
      { name: 'Dal Makhani', price: 220 },
      { name: 'Naan', price: 60 },
      { name: 'Biryani', price: 320 }
    ]
  },
  {
    id: 'r2',
    name: 'Green Leaf',
    description: 'Vegetarian and vegan-friendly restaurant.',
    reviews: [
      'Healthy and tasty options.',
      'Fresh salads and juices!',
    ],
    area: 'Delhi',
    image: require('../assets/images/hotels-restaurants/green-leaf.jpg'),
    price: 800, // Price for two people
    cuisine: 'Vegetarian, Healthy',
    rating: 4.2,
    timings: '9:00 AM - 10:00 PM',
    address: '456 Veg Lane, Delhi',
    menu: [
      { name: 'Veg Thali', price: 250 },
      { name: 'Fruit Salad', price: 180 },
      { name: 'Fresh Juice', price: 120 },
      { name: 'Veg Sandwich', price: 150 },
      { name: 'Soup', price: 140 }
    ]
  },
];


const mockHotels = [
  {
    id: 'h1',
    name: 'Grand Palace Hotel',
    description: '5-star hotel with luxury amenities and city views.',
    reviews: [
      'Excellent service and clean rooms.',
      'Great location for tourists.',
    ],
    area: 'Mumbai',
    image: require('../assets/images/hotels-restaurants/grand-palace.jpg'),
    price: 8500, // Per night
    rating: 4.8,
    amenities: ['Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service'],
    address: '789 Luxury Avenue, Mumbai',
    roomTypes: [
      { type: 'Deluxe Room', price: 8500, capacity: 2 },
      { type: 'Executive Suite', price: 12000, capacity: 2 },
      { type: 'Family Room', price: 15000, capacity: 4 }
    ]
  },
  {
    id: 'h2',
    name: 'Comfort Stay',
    description: 'Affordable and comfortable stay for families.',
    reviews: [
      'Very budget-friendly.',
      'Staff was very helpful.',
    ],
    area: 'Delhi',
    image: require('../assets/images/hotels-restaurants/comfort-stay.jpg'),
    price: 3500, // Per night
    rating: 4.0,
    amenities: ['Free Wi-Fi', 'Breakfast', 'Parking', 'Air Conditioning'],
    address: '101 Budget Road, Delhi',
    roomTypes: [
      { type: 'Standard Room', price: 3500, capacity: 2 },
      { type: 'Deluxe Room', price: 4500, capacity: 2 },
      { type: 'Family Room', price: 6000, capacity: 4 }
    ]
  },
];

function HotelsRestaurants() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [area, setArea] = useState('Mumbai');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'hotel' or 'restaurant'
  
  // Booking state
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [diners, setDiners] = useState(2);
  const [activeBookingExists, setActiveBookingExists] = useState(false);

  const filteredRestaurants = mockRestaurants.filter(r => r.area === area);
  const filteredHotels = mockHotels.filter(h => h.area === area);

  const handleItemClick = (item, type) => {
    // Check for active booking before opening modal
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    setSelectedItem(item);
    setModalType(type);
    setShowModal(true);
    
    // Reset form fields
    if (type === 'hotel') {
      setCheckInDate('');
      setCheckOutDate('');
      setGuests(1);
      setSelectedRoom(item.roomTypes[0].type);
    } else {
      setReservationDate('');
      setReservationTime('');
      setDiners(2);
    }
  };

  const handleBookHotel = () => {
    // Check for active booking
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    const roomDetails = selectedItem.roomTypes.find(r => r.type === selectedRoom);
    
    // Calculate number of nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      alert('Check-out date must be after check-in date');
      return;
    }
    
    const booking = {
      id: `HT-${Date.now().toString().slice(-6)}`,
      type: 'Hotel',
      name: selectedItem.name,
      roomType: selectedRoom,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests,
      nights: nights,
      price: roomDetails.price * nights,
      address: selectedItem.address,
      image: selectedItem.image
    };
    
    addToCart(booking);
    setShowModal(false);
    alert('Hotel booking added to cart!');
  };

  const handleBookRestaurant = () => {
    // Check for active booking
    if (activeBookingExists) {
      alert('You already have an active booking. Please complete or delete your current booking before making a new one.');
      return;
    }
    
    if (!reservationDate || !reservationTime) {
      alert('Please select reservation date and time');
      return;
    }
    
    const booking = {
      id: `RS-${Date.now().toString().slice(-6)}`,
      type: 'Restaurant',
      name: selectedItem.name,
      date: reservationDate,
      time: reservationTime,
      diners: diners,
      price: Math.round(selectedItem.price * diners / 2), // Approximate price based on diners
      address: selectedItem.address,
      cuisine: selectedItem.cuisine,
      image: selectedItem.image
    };
    
    addToCart(booking);
    setShowModal(false);
    alert('Restaurant reservation added to cart!');
  };

  // Check for active booking on component mount
  useEffect(() => {
    setActiveBookingExists(hasActiveBooking());
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
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
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Hotels & Restaurants</h1>
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Select Area:</label>
        <select
          className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={area}
          onChange={e => setArea(e.target.value)}
        >
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
        </select>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-600">Restaurants</h2>
        {filteredRestaurants.map((r, idx) => (
          <div 
            key={idx} 
            className="mb-6 p-4 border rounded-lg bg-white shadow flex flex-col md:flex-row items-start gap-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => handleItemClick(r, 'restaurant')}
          >
            <img src={r.image} alt={r.name} className="w-32 h-32 object-cover rounded-lg border" />
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-lg">{r.name}</div>
                  <div className="text-gray-600 mb-2">{r.description}</div>
                </div>
                <div className="text-primary-600 font-bold">₹{r.price} for two</div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="mr-3">{r.cuisine}</span>
                <span className="mr-3">•</span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {r.rating}
                </span>
              </div>
              <div className="text-sm text-primary-700 font-medium mb-1">Reviews:</div>
              <ul className="list-disc ml-6 text-gray-700 text-sm">
                {r.reviews.map((rev, i) => <li key={i}>{rev}</li>)}
              </ul>
              <button 
                className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(r, 'restaurant');
                }}
              >
                Book a Table
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-primary-600">Nearby Hotels</h2>
        {filteredHotels.map((h, idx) => (
          <div 
            key={idx} 
            className="mb-6 p-4 border rounded-lg bg-white shadow flex flex-col md:flex-row items-start gap-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => handleItemClick(h, 'hotel')}
          >
            <img src={h.image} alt={h.name} className="w-32 h-32 object-cover rounded-lg border" />
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-lg">{h.name}</div>
                  <div className="text-gray-600 mb-2">{h.description}</div>
                </div>
                <div className="text-primary-600 font-bold">₹{h.price} / night</div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="mr-3">{h.address}</span>
                <span className="mr-3">•</span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {h.rating}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {h.amenities.map((amenity, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded-full">{amenity}</span>
                ))}
              </div>
              <div className="text-sm text-primary-700 font-medium mb-1">Reviews:</div>
              <ul className="list-disc ml-6 text-gray-700 text-sm">
                {h.reviews.map((rev, i) => <li key={i}>{rev}</li>)}
              </ul>
              <button 
                className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  const user = localStorage.getItem('user');
                  if (user) {
                    handleItemClick(h, 'hotel');
                  } else {
                    navigate('/login?redirect=/hotels-restaurants');
                  }
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hotel Booking Modal */}
      {showModal && modalType === 'hotel' && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{selectedItem.name}</h2>
            <p className="text-gray-600 mb-4">Complete your booking details</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Room Type:</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                {selectedItem.roomTypes.map((room, idx) => (
                  <option key={idx} value={room.type}>
                    {room.type} - ₹{room.price} (Up to {room.capacity} guests)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Check-in Date:</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Check-out Date:</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Number of Guests:</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBookHotel}
                className="flex-1 bg-primary-600 text-white py-2 rounded-md font-medium hover:bg-primary-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Booking Modal */}
      {showModal && modalType === 'restaurant' && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{selectedItem.name}</h2>
            <p className="text-gray-600 mb-4">Reserve a table</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date:</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time:</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Number of Diners:</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={diners}
                onChange={(e) => setDiners(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Popular Menu Items:</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <ul className="space-y-1">
                  {selectedItem.menu.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-medium">₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBookRestaurant}
                className="flex-1 bg-primary-600 text-white py-2 rounded-md font-medium hover:bg-primary-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelsRestaurants;
