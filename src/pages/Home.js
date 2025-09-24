import React, { useState, useRef, useEffect } from 'react';
import LiveMap from '../components/map/LiveMap';
import ARMonumentGuide from '../components/ARMonumentGuide';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi there! I\'m your travel assistant. How can I help you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [isARGuideOpen, setIsARGuideOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Handle user message submission
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to chat
    const newUserMessage = { sender: 'user', text: userInput };
    setChatMessages([...chatMessages, newUserMessage]);
    
    // Process user input
    processUserMessage(userInput);
    
    // Clear input field
    setUserInput('');
  };

  // Process user message and generate response
  const processUserMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for navigation requests
    if (lowerMessage.includes('go to') || lowerMessage.includes('navigate to') || lowerMessage.includes('open')) {
      const pages = {
        'dashboard': '/dashboard',
        'live location': '/live-location',
        'live map': '/live-location',
        'safety': '/safety',
        'community': '/community',
        'recommendations': '/recommendations',
        'hotels': '/hotels-restaurants',
        'restaurants': '/hotels-restaurants',
        'booking': '/booking',
        'signup': '/signup',
        'login': '/login',
        'flight': '/commute/flight',
        'auto': '/commute/auto'
      };
      
      // Check if message contains any page keywords
      for (const [keyword, path] of Object.entries(pages)) {
        if (lowerMessage.includes(keyword) && !lowerMessage.includes('admin')) {
          // Add bot response
          setTimeout(() => {
            setChatMessages(prev => [...prev, { 
              sender: 'bot', 
              text: `I'll take you to the ${keyword} page right away!` 
            }]);
            
            // Navigate after a short delay
            setTimeout(() => navigate(path), 1000);
          }, 600);
          return;
        }
      }
    }
    
    // Generate response based on message content
    let botResponse = '';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      botResponse = 'Hello! How can I assist you with your travel plans today?';
    } else if (lowerMessage.includes('recommendation') || lowerMessage.includes('suggest')) {
      botResponse = 'I recommend checking out our Recommendations page for personalized travel suggestions based on your preferences!';
    } else if (lowerMessage.includes('hotel') || lowerMessage.includes('restaurant') || lowerMessage.includes('stay') || lowerMessage.includes('eat')) {
      botResponse = 'You can find great hotels and restaurants in our Hotels & Restaurants section. Would you like me to take you there?';
    } else if (lowerMessage.includes('safety') || lowerMessage.includes('safe') || lowerMessage.includes('emergency')) {
      botResponse = 'Your safety is our priority! Check out our Safety features for emergency contacts, danger zone alerts, and more.';
    } else if (lowerMessage.includes('flight') || lowerMessage.includes('air') || lowerMessage.includes('plane')) {
      botResponse = 'We offer 8 different flight options with various airlines, aircraft types, and amenities. Would you like to check our flight booking page?';
    } else if (lowerMessage.includes('auto') || lowerMessage.includes('car') || lowerMessage.includes('taxi') || lowerMessage.includes('cab')) {
      botResponse = 'We have 4 types of auto options: Regular, Premium, Shared, and Electric. Each has different pricing and features. Would you like to see our auto booking page?';
    } else if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
      botResponse = 'You can make bookings through our Booking page. We offer various options including flights and auto services. What type of booking are you interested in?';
    } else if (lowerMessage.includes('booking status') || lowerMessage.includes('my booking') || lowerMessage.includes('check status')) {
      botResponse = 'You can check your booking status on the Dashboard page. Your bookings may be pending, confirmed, or completed. Would you like to go to your dashboard?';
    } else if (lowerMessage.includes('translate') || lowerMessage.includes('translation')) {
      botResponse = 'You can use our translation feature by clicking the Translate button at the bottom of the screen.';
    } else {
      botResponse = 'I\'m here to help with travel recommendations, navigation, and information. Feel free to ask about our features or where you\'d like to go!';
    }
    
    // Add bot response after a short delay to simulate thinking
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  // Handle camera for translation feature
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      stopCamera();
      
      // In a real app, we would send this image to an OCR and translation API
      // For demo purposes, we'll simulate translation after a delay
      setTimeout(() => {
        setTranslatedText("This is a simulated translation of text detected in the image. In a production environment, this would use OCR and translation APIs to provide real translations.");
      }, 1500);
    }
  };

  const handleTranslatorToggle = () => {
    if (!isTranslatorOpen) {
      setIsTranslatorOpen(true);
      startCamera();
    } else {
      setIsTranslatorOpen(false);
      stopCamera();
      setCapturedImage(null);
      setTranslatedText('');
    }
  };

  return (
    <div className="bg-white relative animate-fadeIn">
      {/* AI Chatbot */}
      {!isChatbotOpen ? (
        <button 
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-all hover-lift"
          aria-label="Open AI Assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-xl w-80 sm:w-96 max-h-96 flex flex-col">
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Travel Assistant</h3>
            <button onClick={() => setIsChatbotOpen(false)} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`${msg.sender === 'bot' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-primary-600 text-white ml-auto'} 
                  p-3 rounded-lg max-w-[80%] break-words`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="border-t p-2 flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button 
              type="submit" 
              className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* AR Monument Guide Button */}
      <button 
        onClick={() => setIsARGuideOpen(true)}
        className="fixed bottom-20 left-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
        aria-label="Open AR Monument Guide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Translation Tool */}
      {!isTranslatorOpen ? (
        <button 
          onClick={handleTranslatorToggle}
          className="fixed bottom-6 left-6 z-50 bg-secondary-600 text-white rounded-full p-4 shadow-lg hover:bg-secondary-700 transition-all"
          aria-label="Open Translation Tool"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </button>
      ) : (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-secondary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-medium">Translation Tool</h3>
              <button onClick={handleTranslatorToggle} className="text-white hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {!capturedImage ? (
                <>
                  <div className="bg-black rounded-lg overflow-hidden mb-4 aspect-video">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    ></video>
                  </div>
                  <button 
                    onClick={captureImage}
                    className="w-full bg-secondary-600 text-white py-2 rounded-lg hover:bg-secondary-700"
                  >
                    Capture Image
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Translate to:
                    </label>
                    <select 
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full border rounded-md py-2 px-3"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="hi">Hindi</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  {translatedText ? (
                    <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                      <h4 className="font-medium mb-1">Translation:</h4>
                      <p>{translatedText}</p>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-600"></div>
                      <span className="ml-2">Translating...</span>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setCapturedImage(null);
                        setTranslatedText('');
                        startCamera();
                      }}
                      className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={handleTranslatorToggle}
                      className="flex-1 bg-secondary-600 text-white py-2 rounded-lg hover:bg-secondary-700"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="relative bg-primary-600">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://png.pngtree.com/thumb_back/fw800/back_our/20190619/ourmid/pngtree-travel-around-the-world-travel-poster-template-image_140335.jpg"
            alt="Travel background"
          />
          <div className="absolute inset-0 bg-transparent mix-blend-multiply opacity-60" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl lg:text-6xl">
            Capture Your Travel Journey
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-black-primary-100">
            Record your trips, discover new places, and travel safely with our comprehensive travel companion.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Everything you need for your travels
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our app helps you capture trip data, stay safe, and make your travel experiences more enjoyable.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Trip Management</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Record your trips with detailed information including origin, destination, mode of transport, and more.
                    </p>
                    <div className="mt-5">
                      <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
                        Learn more →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

                {/* Live Map Feature Section */}
                <div className="pt-6">
                  <div className="bg-white rounded-lg px-6 pb-8 shadow-md flex flex-col h-full">
                    <div className="-mt-6 flex-1 flex flex-col">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Live Map</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Track your real-time location on an interactive map and share your journey with friends and family.
                      </p>
                      <div className="mt-5">
                        <Link to="/live-location" className="text-primary-600 hover:text-primary-700 font-medium">
                          Try Live Map →
                        </Link>
                      </div>
                      
                    </div>
                  </div>
                </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Safety Features</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Stay safe with danger zone alerts, SOS button, and trusted contact sharing for emergencies.
                    </p>
                    <div className="mt-5">
                      <Link to="/safety" className="text-primary-600 hover:text-primary-700 font-medium">
                        Learn more →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>



              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Community</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Connect with other travelers, read reviews, join forums, and find travel buddies for your next adventure.
                    </p>
                    <div className="mt-5">
                      <Link to="/community" className="text-primary-600 hover:text-primary-700 font-medium">
                        Learn more →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">How It Works</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Simple steps to get started
            </p>
          </div>

          <div className="mt-16">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">Create an account</h3>
                <p className="mt-2 text-base text-gray-500">
                  Sign up with your email or phone number and set up your profile to get started.
                </p>
              </div>
              <div className="mt-10 lg:mt-0 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">Record your trips</h3>
                <p className="mt-2 text-base text-gray-500">
                  Enter your trip details including origin, destination, mode of transport, and more.
                </p>
              </div>
              <div className="mt-10 lg:mt-0 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">Enjoy the benefits</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get personalized recommendations and travel safely with our features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-300">Join thousands of travelers today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Sign up for free
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AR Monument Guide Modal */}
      <ARMonumentGuide 
        isOpen={isARGuideOpen} 
        onClose={() => setIsARGuideOpen(false)} 
      />

    </div>
  );
}

export default Home;