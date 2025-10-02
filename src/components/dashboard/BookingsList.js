import React, { useState, useEffect } from 'react';
import { getBookings, deleteBooking, updateBookingStatus } from '../../utils/bookingStorage';
import { Trash2, CheckCircle, Clock } from 'lucide-react';

function BookingsList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const currentBookings = getBookings();
    setBookings(currentBookings);
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      deleteBooking(bookingId);
      loadBookings(); // Refresh the bookings list
      
      // Show success message
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn';
      successModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4 animate-scaleIn">
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">Booking Deleted</h3>
            <p class="text-sm text-gray-600">Your booking has been successfully deleted.</p>
          </div>
        </div>
      `;
      document.body.appendChild(successModal);
      
      setTimeout(() => {
        document.body.removeChild(successModal);
      }, 2000);
    }
  };

  const handleCompleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to mark this booking as completed?')) {
      updateBookingStatus(bookingId, 'Completed');
      loadBookings(); // Refresh the bookings list
      
      // Show success message
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn';
      successModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4 animate-scaleIn">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">Booking Completed</h3>
            <p class="text-sm text-gray-600">Your booking has been marked as completed.</p>
          </div>
        </div>
      `;
      document.body.appendChild(successModal);
      
      setTimeout(() => {
        document.body.removeChild(successModal);
      }, 2000);
    }
  };
  
  // Group bookings by type
  const groupedBookings = bookings.reduce((acc, booking) => {
    const type = booking.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(booking);
    return acc;
  }, {});

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Your Bookings</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent travel bookings and reservations</p>
      </div>
      
      {Object.keys(groupedBookings).length > 0 ? (
        <div className="border-t border-gray-200">
          {Object.entries(groupedBookings).map(([type, typeBookings]) => (
            <div key={type} className="px-4 py-5 sm:p-6 border-b border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-4">{type} Bookings</h4>
              
              <div className="space-y-4">
                {typeBookings.map((booking, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{booking.name || 'Booking'}</h5>
                        {booking.from && booking.to && (
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.from} → {booking.to}
                          </p>
                        )}
                        {booking.date && (
                          <p className="text-sm text-gray-600">
                            {new Date(booking.date).toLocaleDateString()}
                            {booking.time && ` at ${booking.time}`}
                          </p>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status === 'Active' && <Clock className="w-3 h-3 mr-1" />}
                        {booking.status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {booking.status || 'Confirmed'}
                      </span>
                    </div>
                    
                    {booking.details && (
                      <div className="mt-2 text-sm text-gray-500">
                        {Object.entries(booking.details).map(([key, value]) => (
                          <div key={key} className="flex mt-1">
                            <span className="font-medium w-24">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="mt-3 flex gap-2">
                      {booking.status === 'Active' && (
                        <>
                          <button
                            onClick={() => handleCompleteBooking(booking.id)}
                            className="flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-t border-gray-200 px-4 py-12 text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your travel bookings will appear here once you make reservations.
          </p>

        </div>
      )}
    </div>
  );
}

export default BookingsList;