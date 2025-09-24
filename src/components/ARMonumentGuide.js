import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, MapPin, Calendar, Info, Star, History, Loader2, ShoppingCart, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  initializeModel, 
  captureImageFromVideo, 
  analyzeMonument,
  analyzeMonumentEnhanced
} from '../utils/monumentRecognition';

const ARMonumentGuide = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedMonument, setDetectedMonument] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);



  // Initialize the model on component mount
  useEffect(() => {
    const initializeAI = async () => {
      try {
        await initializeModel();
        setModelLoaded(true);
        console.log('AI Model loaded successfully');
      } catch (error) {
        console.error('Failed to load AI model:', error);
        setError('Failed to initialize AI recognition system');
      }
    };

    initializeAI();
    // Clear any previous data on mount
    setDetectedMonument(null);
    setShowDetails(false);
    setScanHistory([]);
  }, []);

  // Cleanup on unmount or when modal closes
  useEffect(() => {
    return () => {
      stopCamera();
      clearScanData();
    };
  }, []);

  // Handle modal close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      clearScanData();
    }
  }, [isOpen]);

  // Clear all scan data
  const clearScanData = () => {
    setDetectedMonument(null);
    setShowDetails(false);
    setScanHistory([]);
    setError(null);
  };

  // Start camera with proper error handling
  const startCamera = async () => {
    try {
      setError(null);
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported in this browser. Please try a modern browser.');
        return;
      }
      
      // Stop any existing camera stream first
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Clear previous data when starting new session
      clearScanData();
      
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Force video to play
        videoRef.current.play().catch(e => {
          console.error('Error playing video:', e);
          setError('Error starting camera playback. Please try again.');
        });
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true);
          console.log('Camera started successfully');
          console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
          console.log('Video ready state:', videoRef.current.readyState);
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e);
          setError('Camera stream error. Please try again.');
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please grant camera permissions.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera device found.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else {
        errorMessage += 'Please ensure camera permissions are granted and try again.';
      }
      
      setError(errorMessage);
    }
  };

  // Stop camera and clear data
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      // Clear scan data when closing camera
      setTimeout(() => clearScanData(), 500);
    }
  };

  // Capture photo for scanning
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  // Scan monument with captured photo
  const scanMonument = async () => {
    if (!videoRef.current || !modelLoaded || !canvasRef.current) {
      setError('Camera or AI model not ready. Please wait...');
      return;
    }

    // Check if video is ready
    if (videoRef.current.readyState !== 4) {
      setError('Camera not ready. Please wait a moment and try again.');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setError(null);
    setIsCapturing(true);

    try {
      // Capture photo
      const photoBlob = await capturePhoto();
      
      if (!photoBlob) {
        throw new Error('Failed to capture photo');
      }

      // Create image from blob
      const img = new Image();
      const imageUrl = URL.createObjectURL(photoBlob);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Realistic scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 75) {
            clearInterval(progressInterval);
            return 75;
          }
          return prev + Math.random() * 12 + 3;
        });
      }, 400);

      // Analyze the monument
      const result = await analyzeMonumentEnhanced(img);
      
      // Clean up image URL
      URL.revokeObjectURL(imageUrl);
      
      clearInterval(progressInterval);
      setScanProgress(100);

      if (result.success && result.monument) {
        setDetectedMonument(result.monument);
        setScanHistory(prev => [result.monument, ...prev.slice(0, 4)]);
        
        // Show success for a moment before hiding progress
        setTimeout(() => {
          setIsScanning(false);
          setScanProgress(0);
          setIsCapturing(false);
          setShowDetails(true);
        }, 1500);
      } else {
        setIsScanning(false);
        setScanProgress(0);
        setIsCapturing(false);
        setError(result.error || 'No monument recognized. Please try again with a clearer photo.');
      }
    } catch (error) {
      console.error('Error during monument scan:', error);
      setIsScanning(false);
      setScanProgress(0);
      setIsCapturing(false);
      setError('Failed to analyze monument. Please try again.');
    }
  };

  // Reset for new scan
  const resetForNewScan = () => {
    setDetectedMonument(null);
    setShowDetails(false);
    setError(null);
  };

  if (!modelLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">Loading AI Model...</p>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <React.Fragment>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden w-full max-w-4xl max-h-screen overflow-y-auto">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Camera className="w-8 h-8 mr-3" />
            AR Monument Guide
          </h1>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-white hover:text-gray-300 transition-colors duration-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pb-6">
        {!isCameraActive && !showDetails && (
          <div className="text-center text-white max-w-md">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 mb-8">
              <Camera className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-2xl font-bold mb-4">Discover Historical Monuments</h2>
              <p className="text-lg mb-6 opacity-90">
                Point your camera at any monument and let AI identify it instantly. 
                Learn about its rich history and cultural significance.
              </p>
              <button
                onClick={startCamera}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start AR Camera
              </button>
            </div>
            
            {scanHistory.length > 0 && (
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Recent Scans
                </h3>
                <div className="space-y-3">
                  {scanHistory.map((monument, index) => (
                    <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 cursor-pointer hover:bg-opacity-30 transition-all duration-200"
                         onClick={() => {
                           setDetectedMonument(monument);
                           setShowDetails(true);
                         }}>
                      <p className="font-semibold">{monument.name}</p>
                      <p className="text-sm opacity-80">{monument.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Camera View */}
        {isCameraActive && !showDetails && (
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: '400px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover min-h-96"
                style={{ display: 'block', backgroundColor: '#000' }}
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              
              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                    <p className="text-lg mb-2">Analyzing Monument...</p>
                    <div className="w-48 bg-gray-700 rounded-full h-2 mx-auto">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm mt-2 opacity-75">{scanProgress}% complete</p>
                  </div>
                </div>
              )}

              {/* Camera Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={scanMonument}
                  disabled={isScanning}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 text-black p-4 rounded-full transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-8 h-8" />
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors duration-200"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Corner Guides */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-400 rounded-br-lg"></div>
              </div>

              {/* Instructions */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg">
                  <p className="text-sm text-center">
                    {isCapturing ? 'Capturing photo...' : 'Point camera at a monument and tap the camera button'}
                  </p>
                  {videoRef.current && videoRef.current.readyState === 4 && (
                    <p className="text-xs text-center text-green-400 mt-1">✓ Camera active</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monument Details */}
        {showDetails && detectedMonument && (
          <div className="w-full max-w-2xl">
            <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{detectedMonument.name}</h2>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {detectedMonument.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{detectedMonument.confidence}%</span>
                  </div>
                  <p className="text-sm text-gray-500">Recognition Confidence</p>
                </div>
              </div>

              {/* Monument Image */}
              <div className="mb-6">
                <img 
                  src={detectedMonument.image || '/api/placeholder/400/250'} 
                  alt={detectedMonument.name}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* History Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <History className="w-5 h-5 mr-2 text-blue-600" />
                  Historical Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {detectedMonument.historicalInfo || detectedMonument.description || 'This magnificent monument stands as a testament to the rich cultural heritage and architectural brilliance of its era. Built with exquisite craftsmanship, it has witnessed centuries of history and continues to inspire visitors from around the world.'}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Year Built</h4>
                  <p className="text-blue-800">{detectedMonument.yearBuilt || 'Unknown'}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Architectural Style</h4>
                  <p className="text-green-800">{detectedMonument.architecturalStyle || 'Various'}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Cultural Significance</h4>
                  <p className="text-purple-800">{detectedMonument.culturalSignificance || 'High'}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">Visitor Rating</h4>
                  <p className="text-orange-800">{detectedMonument.rating || '4.5/5'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/trip-packages?monument=${encodeURIComponent(detectedMonument.name)}&location=${encodeURIComponent(detectedMonument.location)}`}
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Book Visit Package
                </Link>
                <button
                  onClick={resetForNewScan}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Scan Another Monument
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
              <X className="w-5 h-5 mr-2" />
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-4 text-white hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  </React.Fragment>
  );
};

export default ARMonumentGuide;