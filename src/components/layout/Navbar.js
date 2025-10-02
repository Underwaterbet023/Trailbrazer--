import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import logoImage from '../../assets/images/logo.jpg';
import { useUser } from '../../context/UserContext';
import CartIcon from '../CartIcon';

// Main navbar items (keep only brand, search, login/signup)
const mainNavigation = [];

// Secondary navbar items (moved from main navbar)
const secondaryNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Recommendations', href: '/recommendations' },
    { name: 'Safety', href: '/safety' },
    { name: 'Live Map', href: '/live-location' },
    { name: 'Community', href: '/community' },
    { name: 'Admin', href: '/admin' },
];

// Booking dropdown options
const bookingOptions = [
    { name: 'Cabs', href: '/booking/cabs' },
    { name: 'Bikes', href: '/booking/bikes' },
    { name: 'Train', href: '/booking/train' },
    { name: 'Metro', href: '/booking/metro' },
    { name: 'Flights', href: '/booking/flight' },
    // { name: 'Book Flight Tickets', href: '/booking/flight' },
    { name: 'Auto', href: '/booking/auto' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useUser();
  const [showBookingDropdown, setShowBookingDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recommendations?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleCommuteOptionClick = () => {
    setShowBookingDropdown(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-primary-50 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center group">
                <span className="text-2xl font-extrabold text-primary-700 tracking-tight mr-2 group-hover:text-secondary-600 transition">Trailbrazers</span>
                <img src={logoImage} alt="Logo" className="h-12 w-auto rounded-full border-2 border-primary-300 shadow-md bg-white" />
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="hidden sm:flex sm:items-center sm:justify-center flex-1 mx-4">
              <form onSubmit={handleSearch} className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search destinations, hotels, activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="hidden">Search</button>
              </form>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isAuthenticated() ? (
                <div className="flex items-center">
                  <CartIcon />
                  <div className="flex items-center mx-4">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User avatar"
                        className="h-8 w-8 rounded-full object-cover border-2 border-primary-300"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-primary-600" />
                    )}
                    <span className="ml-2 text-primary-700 text-sm font-medium">{user.username || user.email}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="ml-3 text-primary-600 bg-white border border-primary-300 hover:bg-primary-50 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary-600 hover:text-primary-800 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Secondary Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-10">
            <div className="hidden sm:flex sm:items-center">
              <div className="flex space-x-4">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-600 hover:text-primary-600 px-3 py-1 text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Commute Dropdown */}
                <div className="relative">
                  <button
                    className="text-gray-600 hover:text-primary-600 px-3 py-1 text-sm font-medium flex items-center"
                    onClick={() => setShowBookingDropdown(!showBookingDropdown)}
                  >
                    Commute
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </button>
                  
                  {showBookingDropdown && (
                    <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {bookingOptions.map((option) => (
                          <Link
                            key={option.name}
                            to={option.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={handleCommuteOptionClick}
                          >
                            {option.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Link
                  to="/hotels-restaurants"
                  className="text-gray-600 hover:text-primary-600 px-3 py-1 text-sm font-medium"
                >
                  Hotels & Restaurants
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white shadow-lg rounded-b-lg">
          <div className="pt-2 pb-3 space-y-1">
            {/* Search in mobile */}
            <div className="px-4 py-2">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="hidden">Search</button>
              </form>
            </div>
            
            {/* Navigation links */}
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Commute dropdown in mobile */}
            <div className="px-4 py-2">
              <button
                className="flex items-center w-full text-left text-base font-medium text-gray-600 hover:text-primary-600"
                onClick={() => setShowBookingDropdown(!showBookingDropdown)}
              >
                Commute
                <ChevronDownIcon className={`ml-auto h-5 w-5 transform ${showBookingDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showBookingDropdown && (
                <div className="mt-2 space-y-1 pl-4">
                  {bookingOptions.map((option) => (
                    <Link
                      key={option.name}
                      to={option.href}
                      className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => {
                        setIsOpen(false);
                        handleCommuteOptionClick();
                      }}
                    >
                      {option.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link
              to="/hotels-restaurants"
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Hotels & Restaurants
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated() ? (
              <div>
                <div className="flex items-center px-4 py-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full object-cover border-2 border-primary-300"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-primary-600" />
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.username || user.email}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;