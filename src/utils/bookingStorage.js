// bookingStorage.js
// Simple localStorage-based booking storage for demo. Replace with real API/database in production.

export function saveBooking(booking) {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  // Ensure booking has a status, default to 'Active'
  booking.status = booking.status || 'Active';
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
}

export function getBookings() {
  return JSON.parse(localStorage.getItem('bookings') || '[]');
}

export function getActiveBookings() {
  const bookings = getBookings();
  return bookings.filter(booking => 
    booking.status === 'Active' || 
    booking.status === 'Confirmed' || 
    booking.status === 'Pending Payment'
  );
}

export function hasActiveBooking() {
  return getActiveBookings().length > 0;
}

export function updateBookingStatus(bookingId, newStatus) {
  const bookings = getBookings();
  const updatedBookings = bookings.map(booking => {
    if (booking.id === bookingId) {
      return { ...booking, status: newStatus };
    }
    return booking;
  });
  localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  return updatedBookings;
}

export function deleteBooking(bookingId) {
  const bookings = getBookings();
  const filteredBookings = bookings.filter(booking => booking.id !== bookingId);
  localStorage.setItem('bookings', JSON.stringify(filteredBookings));
  return filteredBookings;
}

export function clearAllBookings() {
  localStorage.removeItem('bookings');
}

export function getBookingSummary() {
  const bookings = getBookings();
  return {
    total: bookings.length,
    active: getActiveBookings().length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    pending: bookings.filter(b => b.status === 'Pending Payment').length,
    allStatuses: bookings.map(b => ({ id: b.id, status: b.status, name: b.name }))
  };
}
