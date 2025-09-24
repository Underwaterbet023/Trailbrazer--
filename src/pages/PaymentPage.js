import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveBooking } from '../utils/bookingStorage';
import { useCart } from '../context/CartContext';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [countdown, setCountdown] = useState(300);
  
  const bookingDetails = location.state?.bookingDetails;
  const totalAmount = location.state?.totalAmount;
  const bookingType = location.state?.bookingType || 'Trip Package';

  useEffect(() => {
    if (!bookingDetails || !totalAmount) {
      alert('No booking details found. Please try again.');
      navigate('/trip-packages');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingDetails, totalAmount, navigate]);

  const handlePaymentSuccess = () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing and create booking
    setTimeout(() => {
      // Update booking status to confirmed
      const confirmedBooking = {
        ...bookingDetails,
        status: 'Confirmed',
        details: {
          ...bookingDetails.details,
          'Payment': 'Completed'
        }
      };
      
      // Save the booking
      saveBooking(confirmedBooking);
      
      // Clear the cart after successful payment
      clearCart();
      
      setPaymentStatus('success');
      
      // Navigate to dashboard after showing success
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            paymentSuccess: true, 
            bookingId: confirmedBooking.id,
            amount: totalAmount,
            shoppingConfirmed: true
          } 
        });
      }, 2000);
    }, 1000);
  };

  const handleCancelPayment = () => {
    if (window.confirm('Are you sure you want to cancel the payment?')) {
      navigate('/trip-packages');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shopping Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your payment was successful and your booking has been confirmed.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Amount: <span className="font-bold text-green-600">₹{totalAmount?.toLocaleString()}</span></p>
            <p className="text-sm text-gray-600">ID: <span className="font-mono">{bookingDetails?.id}</span></p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Expired</h2>
          <p className="text-gray-600 mb-6">The payment session has expired.</p>
          <button
            onClick={() => navigate('/trip-packages')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Secure Payment</h1>
                <p className="text-primary-100">Complete your booking payment</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹{totalAmount?.toLocaleString()}</div>
                <div className="text-sm text-primary-100">Time: {formatTime(countdown)}</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan QR Code to Pay</h2>
                <div className="bg-gray-50 rounded-xl p-6 mb-4">
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg p-4 shadow-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-black rounded-lg mx-auto mb-2" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='white'/%3E%3Crect x='10' y='10' width='80' height='80' fill='black'/%3E%3Crect x='20' y='20' width='60' height='60' fill='white'/%3E%3Crect x='30' y='30' width='40' height='40' fill='black'/%3E%3C/svg%3E")`,
                        backgroundSize: 'cover'
                      }}></div>
                      <p className="text-xs text-gray-500">Demo QR Code</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Use any UPI app (Google Pay, PhonePe, Paytm) to scan and pay
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-mono break-all">
                    travelapp@upi
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{bookingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-mono text-sm">{bookingDetails?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">₹{totalAmount?.toLocaleString()}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary-600">₹{totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        After payment, click "I Have Paid" to confirm your booking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePaymentSuccess}
                    disabled={paymentStatus === 'processing'}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {paymentStatus === 'processing' ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'I Have Paid'
                    )}
                  </button>
                  <button
                    onClick={handleCancelPayment}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;