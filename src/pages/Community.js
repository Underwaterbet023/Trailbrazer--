import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

function Community() {
  // Get tab from URL parameters
  const getTabFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    return ['reviews', 'forums', 'buddies', 'guides'].includes(tab) ? tab : 'reviews';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromURL());
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    place: '',
    rating: 5,
    content: '',
    images: []
  });
  const [showForumForm, setShowForumForm] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    category: 'general',
    content: ''
  });
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [showBuddyProfile, setShowBuddyProfile] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showGuideBooking, setShowGuideBooking] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  
  // State for reviews
  const [reviews, setReviews] = useState([
    {
      id: 1,
      place: 'Golden Temple, Amritsar',
      author: 'Rahul S.',
      date: '2023-10-15',
      rating: 5,
      content: 'One of the most peaceful and spiritual places I have ever visited. The atmosphere is serene and the golden structure reflecting in the water is breathtaking.',
      images: ['https://th.bing.com/th/id/R.bb0657c2cd312373b9db5d705f0e11c0?rik=424p5vnzfed1KQ&riu=http%3a%2f%2fupload.wikimedia.org%2fwikipedia%2fcommons%2f9%2f9f%2fAmritsar_Golden_Temple_3.JPG&ehk=Kkzw3alSjguRImw%2bsslFGCuJsWZd1YKI52sQqnrqHYw%3d&risl=&pid=ImgRaw&r=0']
    },
    {
      id: 2,
      place: 'Taj Mahal, Agra',
      author: 'Priya M.',
      date: '2023-09-22',
      rating: 5,
      content: 'A true wonder of the world. The intricate marble work and the symmetry of the structure is amazing. Best visited during sunrise.',
      images: ['https://h2.gifposter.com/bingImages/TajMahalReflection_1920x1080.jpg']
    },
    {
      id: 3,
      place: 'Jaipur City Palace',
      author: 'Amit K.',
      date: '2023-11-05',
      rating: 4,
      content: 'Beautiful palace with stunning architecture. The museum inside has a great collection of royal artifacts. Highly recommended for history lovers.',
      images: ['https://i.pinimg.com/originals/d9/ca/53/d9ca53ea0b409b5a5abb7cd421bc53d1.jpg']
    }
  ]);
  
  // State for discussions
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: 'Best hiking trails around the city',
      author: 'HikingEnthusiast',
      date: '2023-06-18',
      content: 'I\'m looking for recommendations on hiking trails within 30km of the city center. Preferably with moderate difficulty and good scenic views. Any suggestions?',
      replies: 12,
      views: 145,
      tags: ['hiking', 'outdoors', 'nature']
    },
    {
      id: 2,
      title: 'Public transport tips for tourists',
      author: 'TravelGuru',
      date: '2023-06-16',
      content: 'Let\'s share tips and tricks for using the local public transport system efficiently. What are the best passes for tourists? How to avoid peak hours?',
      replies: 8,
      views: 98,
      tags: ['transport', 'local-tips', 'budget-travel']
    },
    {
      id: 3,
      title: 'Hidden gems for food lovers',
      author: 'FoodieExplorer',
      date: '2023-06-14',
      content: 'Looking to discover some underrated local restaurants and street food spots. Share your favorite hidden gems that tourists usually miss!',
      replies: 15,
      views: 203,
      tags: ['food', 'local-cuisine', 'restaurants']
    },
    {
      id: 4,
      title: 'Weekend getaway ideas',
      author: 'WeekendTraveler',
      date: '2023-06-12',
      content: 'Planning a 2-day trip this weekend. What are some interesting places within 200km radius that are worth visiting? Looking for both nature and cultural experiences.',
      replies: 10,
      views: 178,
      tags: ['weekend', 'short-trips', 'getaway']
    }
  ]);
  
  // Sample travel buddies data
  const travelBuddies = [
    {
      id: 1,
      name: 'Sarah Wilson',
      age: 28,
      location: 'New York',
      interests: ['Hiking', 'Photography', 'Cultural Experiences'],
      bio: 'Adventure enthusiast looking for travel companions for weekend trips. Love exploring nature trails and capturing moments through my lens.',
      tripPreferences: 'Weekend getaways, National parks, Historical sites',
      image: 'https://img.freepik.com/premium-photo/photo-traveler_889227-44735.jpg',
      compatibility: 85
    },
    {
      id: 2,
      name: 'Vernit',
      age: 32,
      location: 'Chicago',
      interests: ['Food Tours', 'Museums', 'City Exploration'],
      bio: 'Foodie and history buff looking to explore new cities. Always on the hunt for authentic local cuisines and hidden historical gems.',
      tripPreferences: 'City breaks, Food tours, Cultural events',
      image: 'https://thumbs.dreamstime.com/z/happy-guy-vacation-bag-hat-holding-map-portrait-57224721.jpg',
      compatibility: 72
    },
    {
      id: 3,
      name: 'Emma Chen',
      age: 26,
      location: 'San Francisco',
      interests: ['Beach Trips', 'Surfing', 'Road Trips'],
      bio: 'Surf enthusiast and road trip lover. Looking for like-minded travelers for coastal adventures and exploring scenic routes.',
      tripPreferences: 'Coastal trips, Road journeys, Beach camping',
      image: 'https://img.freepik.com/free-photo/portrait-woman-travelling-world-using-map-tablet-standing-small-european-city-looking-camera_197531-22267.jpg',
      compatibility: 90
    },
    {
      id: 4,
      name: 'Carlos Rodriguez',
      age: 35,
      location: 'Miami',
      interests: ['Wildlife Safaris', 'Adventure Sports', 'Mountain Climbing'],
      bio: 'Adrenaline junkie seeking travel partners for adventure trips. Experienced in mountain climbing and wildlife expeditions.',
      tripPreferences: 'Adventure trips, Wildlife safaris, Mountain expeditions',
      image: 'https://i1.rgstatic.net/ii/profile.image/11431281128750249-1679422056721_Q512/Daniel-Ghiurca-2.jpg',
      compatibility: 65
    }
  ];
  
  // Sample local guides data
  const localGuides = [
    {
      id: 1,
      name: 'David Thompson',
      location: 'New York',
      expertise: ['History', 'Architecture', 'Local Cuisine'],
      languages: ['English', 'Spanish'],
      experience: '5 years',
      rating: 4.8,
      reviews: 56,
      image: 'https://img.freepik.com/premium-photo/portrait-smiling-traveling-man-with-map_33839-603.jpg?w=2000',
      price: '$40/hour',
      bio: 'Born and raised in New York City, I have a deep passion for sharing the rich history and architectural wonders of this amazing city. With a background in urban planning and culinary arts, I offer unique perspectives on both the historical significance of landmarks and the best local food spots that tourists typically miss.',
      achievements: ['Certified NYC Tour Guide', 'Featured in Travel Magazine 2022', 'History Channel Documentary Consultant'],
      popularTours: ['Historical Manhattan Walking Tour', 'Brooklyn Food Experience', 'Architectural Marvels of NYC']
    },
    {
      id: 2,
      name: 'Aisha',
      location: 'Chicago',
      expertise: ['Art Galleries', 'Urban Culture', 'Photography Spots'],
      languages: ['English', 'Urdu', 'Hindi'],
      experience: '3 years',
      rating: 4.9,
      reviews: 42,
      image: 'https://thumbs.dreamstime.com/z/happy-travel-woman-smile-to-you-sky-background-caucasian-beauty-69884089.jpg',
      price: '$35/hour',
      bio: 'As a professional photographer and art enthusiast, I love showcasing Chicago\'s vibrant art scene and urban culture. My tours focus on both well-known galleries and hidden artistic gems, along with perfect photography spots to capture the essence of the Windy City.',
      achievements: ['Chicago Arts Council Member', 'Published Photographer', 'Local Culture Blog Creator'],
      popularTours: ['Chicago Art Gallery Hopping', 'Urban Photography Expedition', 'Cultural Neighborhoods Tour']
    },
    {
      id: 3,
      name: 'Adam',
      location: 'San Francisco',
      expertise: ['Wine Tours', 'Coastal Trails', 'Hidden Viewpoints'],
      languages: ['English', 'Italian', 'French'],
      experience: '7 years',
      rating: 4.7,
      reviews: 89,
      image: 'https://thumbs.dreamstime.com/b/man-happy-face-smile-travel-holiday-summer-beach-hawaii-freedom-enjoy-nature-young-make-smiling-vacation-traveling-263412600.jpg',
      price: '$45/hour',
      bio: 'With Italian roots and a sommelier certification, I specialize in wine tours throughout the Bay Area and Napa Valley. I also love hiking and have discovered many hidden coastal trails and viewpoints that offer breathtaking views of San Francisco and the surrounding areas.',
      achievements: ['Certified Sommelier', 'Bay Area Hiking Club Founder', 'Author of "Hidden San Francisco" guidebook'],
      popularTours: ['Napa Valley Wine Experience', 'Secret Coastal Trails Adventure', 'San Francisco Hidden Viewpoints']
    },
    {
      id: 4,
      name: 'Leila Nguyen',
      location: 'Miami',
      expertise: ['Beach Life', 'Nightlife', 'Water Sports'],
      languages: ['English', 'Vietnamese', 'Spanish'],
      experience: '4 years',
      rating: 4.6,
      reviews: 37,
      image: 'https://thumbs.dreamstime.com/b/pretty-female-tourist-traveling-nature-carefree-young-woman-making-touristic-travel-forest-holding-binoculars-74739503.jpg',
      price: '$38/hour',
      bio: 'Miami native with a passion for beach life and water sports. I know all the best spots for sunbathing, swimming, and water activities. By night, I can guide you through Miami\'s exciting nightlife scene, from upscale lounges to local hotspots with the best Latin music.',
      achievements: ['Professional Surfing Instructor', 'Miami Nightlife Award 2023', 'Water Safety Certified'],
      popularTours: ['Miami Beach Hopping', 'Nightlife VIP Experience', 'Water Sports Adventure Day']
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Travel Community</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-800">Connect with Fellow Travelers</h2>
            <p className="text-gray-600 text-sm">Share experiences, find travel buddies, and get local insights</p>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`${activeTab === 'reviews' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Reviews & Ratings
          </button>
          <button
            onClick={() => setActiveTab('forums')}
            className={`${activeTab === 'forums' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Travel Forums
          </button>
          <button
            onClick={() => setActiveTab('buddies')}
            className={`${activeTab === 'buddies' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Travel Buddies
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`${activeTab === 'guides' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Local Guides
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        {/* Reviews & Ratings Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
              <button 
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Write a Review
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Replace reviews.map with placeholder message */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">No reviews available</h3>
                      <p className="text-gray-600 mt-1">Be the first to write a review!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reviews List */}
            {reviews.length > 0 && (
              <div className="mt-6 space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex justify-between">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{review.place}</h3>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                        </div>
                      </div>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        By {review.author} • {review.date}
                      </p>
                    </div>
                    <div className="border-t border-gray-200">
                      <div className="px-4 py-5 sm:p-6">
                        <p className="text-gray-700">{review.content}</p>
                        
                        {review.images && review.images.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {review.images.map((image, index) => (
                              <img 
                                key={index} 
                                src={image} 
                                alt={`Review image ${index + 1}`} 
                                className="h-40 w-full object-cover rounded-md"
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-end">
                          {review.author === 'You' && (
                            <button 
                              onClick={() => {
                                setReviews(reviews.filter(r => r.id !== review.id));
                                toast.success('Review deleted successfully!');
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Load More Reviews
              </button>
            </div>
          </div>
        )}
        
        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Write a Review</h2>
                  <button 
                    onClick={() => setShowReviewForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Generate a random ID for the new review
                  const newId = reviews.length + 1;
                  const currentDate = new Date().toISOString().split('T')[0];
                  
                  // Create the new review object
                  const reviewToAdd = {
                    ...newReview,
                    id: newId,
                    author: 'You', // In a real app, this would be the logged-in user
                    date: currentDate
                  };
                  
                  // Add the new review to the reviews array
                  setReviews([reviewToAdd, ...reviews]);
                  
                  // Show success message
                  toast.success('Review submitted successfully!');
                  setShowReviewForm(false);
                  
                  // Reset the form
                  setNewReview({
                    place: '',
                    rating: 5,
                    content: '',
                    images: []
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1">
                        Place or Attraction
                      </label>
                      <input
                        type="text"
                        id="place"
                        value={newReview.place}
                        onChange={(e) => setNewReview({...newReview, place: e.target.value})}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Name of the place you're reviewing"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({...newReview, rating: star})}
                            className="focus:outline-none"
                          >
                            <svg 
                              className={`h-8 w-8 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                        <span className="ml-2 text-gray-600">{newReview.rating} out of 5</span>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Review
                      </label>
                      <textarea
                        id="content"
                        rows={5}
                        value={newReview.content}
                        onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Share your experience..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Add Photos (Optional)
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Travel Forums Tab */}
        {activeTab === 'forums' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Discussion Forums</h2>
              <button 
                onClick={() => setShowForumForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Start New Discussion
              </button>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {discussions.map(discussion => (
                  <li key={discussion.id}>
                    <div className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-primary-600 truncate">{discussion.title}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>Started by {discussion.author}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(discussion.date).toLocaleDateString()}</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{discussion.content}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {discussion.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="ml-6 flex-shrink-0 flex flex-col items-end">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                            </svg>
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span>{discussion.views} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 text-center">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                View All Discussions
              </button>
            </div>
            
            {/* New Discussion Form Modal */}
            {showForumForm && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Start a New Discussion</h3>
                  </div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    // Add the new discussion to the discussions array
                    const newDiscussionObj = {
                      id: discussions.length + 1,
                      title: newDiscussion.title,
                      author: 'You',
                      date: new Date().toISOString().split('T')[0],
                      content: newDiscussion.content,
                      replies: 0,
                      views: 0,
                      tags: newDiscussion.category.split(',').map(tag => tag.trim())
                    };
                    setDiscussions([newDiscussionObj, ...discussions]);
                    setNewDiscussion({
                      title: '',
                      category: 'general',
                      content: ''
                    });
                    setShowForumForm(false);
                    toast.success('Discussion posted successfully!');
                  }}>
                    <div className="px-6 py-4">
                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Discussion Title</label>
                        <input
                          type="text"
                          id="title"
                          value={newDiscussion.title}
                          onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                          className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categories (comma separated)</label>
                        <input
                          type="text"
                          id="category"
                          value={newDiscussion.category}
                          onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
                          className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="general, question, advice"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Discussion Content</label>
                        <textarea
                          id="content"
                          value={newDiscussion.content}
                          onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                          rows={5}
                          className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowForumForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Post Discussion
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Travel Buddies Tab */}
        {activeTab === 'buddies' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Find Travel Buddies</h2>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Locations</option>
                  <option>New York</option>
                  <option>Chicago</option>
                  <option>San Francisco</option>
                  <option>Miami</option>
                </select>
                <select className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Interests</option>
                  <option>Hiking</option>
                  <option>Food Tours</option>
                  <option>Beach Trips</option>
                  <option>Adventure Sports</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {travelBuddies.map(buddy => (
                <div key={buddy.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={buddy.image} 
                      alt={buddy.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full px-2 py-1 text-xs font-medium">
                      {buddy.compatibility}% Match
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{buddy.name}</h3>
                        <p className="text-sm text-gray-500">{buddy.age} • {buddy.location}</p>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-sm text-gray-600 line-clamp-3">{buddy.bio}</p>
                    
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Interests</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {buddy.interests.map((interest, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <button 
                        onClick={() => {
                          setSelectedBuddy(buddy);
                          setShowBuddyProfile(true);
                        }}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Profile
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                View More Travel Buddies
              </button>
            </div>
          </div>
        )}
        
        {/* Local Guides Tab */}
        {activeTab === 'guides' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Local Guides</h2>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Locations</option>
                  <option>New York</option>
                  <option>Chicago</option>
                  <option>San Francisco</option>
                  <option>Miami</option>
                </select>
                <select className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Expertise</option>
                  <option>History</option>
                  <option>Food</option>
                  <option>Art</option>
                  <option>Outdoors</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {localGuides.map(guide => (
                <div key={guide.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={guide.image} 
                      alt={guide.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(guide.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-white">{guide.rating} ({guide.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{guide.name}</h3>
                        <p className="text-sm text-gray-500">{guide.location} • {guide.experience}</p>
                      </div>
                      <div className="text-sm font-medium text-primary-600">
                        {guide.price}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {guide.expertise.map((exp, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</h4>
                      <p className="mt-1 text-sm text-gray-600">{guide.languages.join(', ')}</p>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <button 
                        onClick={() => {
                          setSelectedGuide(guide);
                          // Show profile view modal
                          setShowGuideBooking(false);
                          setShowBuddyProfile(true);
                        }}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Profile
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedGuide(guide);
                          setShowGuideBooking(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Book Guide
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                View More Local Guides
              </button>
            </div>
          </div>
        )}
        
        {/* Guide Booking Modal */}
        {showGuideBooking && selectedGuide && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Book {selectedGuide.name}</h2>
                  <button 
                    onClick={() => setShowGuideBooking(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-1">
                    <img 
                      src={selectedGuide.image} 
                      alt={selectedGuide.name} 
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedGuide.name}</h3>
                    <p className="text-sm text-gray-500">{selectedGuide.location} • {selectedGuide.experience}</p>
                    
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(selectedGuide.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-gray-600">{selectedGuide.rating} ({selectedGuide.reviews} reviews)</span>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700">Expertise</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedGuide.expertise.map((exp, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700">Languages</h4>
                      <p className="mt-1 text-sm text-gray-600">{selectedGuide.languages.join(', ')}</p>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700">Price</h4>
                      <p className="mt-1 text-lg font-semibold text-primary-600">{selectedGuide.price}</p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Add guide to cart via CartContext
                  addToCart({
                    id: `guide-${selectedGuide.id}`,
                    name: `${selectedGuide.name} - Local Guide Service`,
                    price: parseInt(selectedGuide.price.replace(/[^0-9]/g, '')),
                    image: selectedGuide.image,
                    type: 'guide'
                  });
                  toast.success(`${selectedGuide.name} has been added to your cart!`);
                  setShowGuideBooking(false);
                }}>
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <select
                          id="time"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select a time</option>
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="13:00">1:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <select
                        id="duration"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select duration</option>
                        <option value="2">2 hours</option>
                        <option value="3">3 hours</option>
                        <option value="4">4 hours</option>
                        <option value="6">6 hours (Half day)</option>
                        <option value="8">8 hours (Full day)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of People
                      </label>
                      <select
                        id="people"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select group size</option>
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                        <option value="5">5 people</option>
                        <option value="6+">6+ people (custom quote)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests or Notes
                      </label>
                      <textarea
                        id="notes"
                        rows="3"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Any specific interests, accessibility requirements, or other requests..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowGuideBooking(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={() => {
                        // Check if user is authenticated
                        const isAuthenticated = localStorage.getItem('userAuth') === 'true';
                        if (!isAuthenticated) {
                          toast.error('Please log in to book a guide');
                          setShowGuideBooking(false);
                          window.location.href = '/login?redirect=/community?tab=guides';
                          return;
                        }
                        
                        // Create guide booking object
                        const guideBooking = {
                          id: `GUIDE-${Date.now().toString().slice(-6)}`,
                          type: 'Local Guide',
                          name: selectedGuide.name,
                          location: selectedGuide.location,
                          expertise: selectedGuide.expertise.join(', '),
                          date: new Date().toLocaleDateString(),
                          price: selectedGuide.price,
                          image: selectedGuide.image
                        };
                        
                        // Add to cart
                        addToCart(guideBooking);
                        toast.success(`${selectedGuide.name} has been added to your cart!`);
                        setShowGuideBooking(false);
                      }}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Add to Cart
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Guide Profile Modal */}
        {selectedGuide && !showGuideBooking && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{selectedGuide.name}'s Profile</h2>
                  <button 
                    onClick={() => setSelectedGuide(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="relative">
                      <img 
                        src={selectedGuide.image} 
                        alt={selectedGuide.name} 
                        className="w-full h-auto rounded-lg object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 rounded-full px-2 py-1 text-xs font-medium">
                        {selectedGuide.rating} ★
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedGuide.name}</h3>
                      <p className="text-sm text-gray-500">{selectedGuide.location} • {selectedGuide.experience}</p>
                      
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedGuide.expertise.map((exp, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</h4>
                        <p className="mt-1 text-sm text-gray-600">{selectedGuide.languages.join(', ')}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price</h4>
                        <p className="mt-1 text-lg font-semibold text-primary-600">{selectedGuide.price}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-lg">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
                        <p className="text-gray-600">{selectedGuide.bio}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Achievements</h3>
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                          {selectedGuide.achievements.map((achievement, index) => (
                            <li key={index}>• {achievement}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Popular Tours</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedGuide.popularTours.map((tour, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <span className="block text-sm font-medium text-gray-900">{tour}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reviews</h3>
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`h-5 w-5 ${i < Math.floor(selectedGuide.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{selectedGuide.rating} out of 5 ({selectedGuide.reviews} reviews)</span>
                        </div>
                        <div className="space-y-3">
                          <div className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">Sarah M.</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">Amazing experience! Our guide was knowledgeable and showed us places we would never have found on our own.</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">John D.</span>
                              <div className="flex">
                                {[...Array(4)].map((_, i) => (
                                  <svg key={i} className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <svg className="h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">Great tour with lots of interesting information. Would have liked a bit more time at some locations.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => setSelectedGuide(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Close
                        </button>
                        <button 
                          onClick={() => setShowGuideBooking(true)}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Travel Buddy Profile Modal */}
        {showBuddyProfile && selectedBuddy && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{selectedBuddy.name}'s Profile</h2>
                  <button 
                    onClick={() => setShowBuddyProfile(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="relative">
                      <img 
                        src={selectedBuddy.image} 
                        alt={selectedBuddy.name} 
                        className="w-full h-auto rounded-lg object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full px-2 py-1 text-xs font-medium">
                        {selectedBuddy.compatibility}% Match
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedBuddy.name}</h3>
                      <p className="text-sm text-gray-500">{selectedBuddy.age} • {selectedBuddy.location}</p>
                      
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Interests</h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedBuddy.interests.map((interest, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Preferences</h4>
                        <p className="mt-1 text-sm text-gray-600">{selectedBuddy.tripPreferences}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-lg">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
                        <p className="text-gray-600">{selectedBuddy.bio}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Travel History</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-lg p-3">
                            <h4 className="font-medium text-gray-900">Recent Trips</h4>
                            <ul className="mt-2 text-sm text-gray-600 space-y-1">
                              <li>• Bali, Indonesia (2 months ago)</li>
                              <li>• Tokyo, Japan (6 months ago)</li>
                              <li>• Barcelona, Spain (1 year ago)</li>
                            </ul>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-3">
                            <h4 className="font-medium text-gray-900">Upcoming Plans</h4>
                            <ul className="mt-2 text-sm text-gray-600 space-y-1">
                              <li>• Costa Rica (Next month)</li>
                              <li>• Weekend hiking trip (In 2 weeks)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Travel Style</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="block text-sm font-medium text-gray-900">Budget</span>
                            <span className="block mt-1 text-xs text-gray-500">Mid-range</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="block text-sm font-medium text-gray-900">Pace</span>
                            <span className="block mt-1 text-xs text-gray-500">Moderate</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="block text-sm font-medium text-gray-900">Planning</span>
                            <span className="block mt-1 text-xs text-gray-500">Flexible</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="block text-sm font-medium text-gray-900">Accommodation</span>
                            <span className="block mt-1 text-xs text-gray-500">Hotels/Hostels</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <span className="block text-sm font-medium text-gray-900">Activities</span>
                            <span className="block mt-1 text-xs text-gray-500">Adventure/Culture</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                          Message
                        </button>
                        <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Forum Discussion Form Modal */}
        {showForumForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Start a New Discussion</h2>
                  <button 
                    onClick={() => setShowForumForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  
                  // Validate form
                  if (!newDiscussion.title || !newDiscussion.content) {
                    toast.error('Please fill in all required fields');
                    return;
                  }
                  
                  // Create new discussion object
                  const newDiscussionObj = {
                    id: Date.now(),
                    title: newDiscussion.title,
                    category: newDiscussion.category,
                    content: newDiscussion.content,
                    author: 'You', // In a real app, this would be the current user
                    date: new Date().toISOString().split('T')[0],
                    replies: 0,
                    views: 1,
                    tags: [newDiscussion.category]
                  };
                  
                  // Add to discussions list
                  setDiscussions([newDiscussionObj, ...discussions]);
                  
                  // Show success message
                  toast.success('Discussion posted successfully!');
                  setShowForumForm(false);
                  
                  // Reset the form
                  setNewDiscussion({
                    title: '',
                    category: 'general',
                    content: ''
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Discussion Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter a title for your discussion"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        value={newDiscussion.category}
                        onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="general">General</option>
                        <option value="tips">Travel Tips</option>
                        <option value="safety">Safety</option>
                        <option value="accommodation">Accommodation</option>
                        <option value="transportation">Transportation</option>
                        <option value="food">Food & Dining</option>
                        <option value="attractions">Attractions</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Discussion Content
                      </label>
                      <textarea
                        id="content"
                        rows={8}
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Share your thoughts, questions, or experiences..."
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForumForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Post Discussion
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;