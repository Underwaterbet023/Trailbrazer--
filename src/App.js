import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Booking from './pages/Booking';
import HotelsRestaurants from './pages/HotelsRestaurants';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Safety from './pages/Safety';
import LiveLocation from './pages/LiveLocation';
import Community from './pages/Community';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import CartPage from './pages/CartPage';
import AttractionDetail from './pages/AttractionDetail';
import CabsPage from './pages/commute/CabsPage';
import BikesPage from './pages/commute/BikesPage';
import TrainPage from './pages/commute/TrainPage';
import MetroPage from './pages/commute/MetroPage';
import FlightPage from './pages/commute/FlightPage';
import AutoPage from './pages/commute/AutoPage';
import TripPackages from './pages/TripPackages';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/live-location" element={<LiveLocation />} />
                <Route path="/community" element={<Community />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/hotels-restaurants" element={<HotelsRestaurants />} />
                <Route path="/trip-packages" element={<TripPackages />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/attraction/:id" element={<AttractionDetail />} />
                <Route path="/booking/cabs" element={<CabsPage />} />
                <Route path="/booking/bikes" element={<BikesPage />} />
                <Route path="/booking/train" element={<TrainPage />} />
                <Route path="/booking/metro" element={<MetroPage />} />
                <Route path="/booking/flight" element={<FlightPage />} />
                {/* Adding an additional route for case sensitivity issues */}
                <Route path="/booking/Flight" element={<FlightPage />} />
                <Route path="/booking/auto" element={<AutoPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </CartProvider>
    </UserProvider>
  );
}

export default App;