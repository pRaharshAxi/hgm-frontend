import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CartPage from '../pages/cart/CartPage';
import CheckoutPage from '../pages/cart/CheckoutPage';
import OrderConfirmPage from '../pages/cart/OrderConfirmPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ListingDetailPage from '../pages/listing/ListingDetailPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import OrderHistoryPage from '../pages/orders/OrderHistoryPage';
import SearchPage from '../pages/search/SearchPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminListingsPage from '../pages/admin/AdminListingsPage';
import ProtectedRoute from './ProtectedRoute';

function Home() {
  return (
    <div className="page-shell hero-screen">
      <main className="hero-content">
        <div className="hero-copy">
          <span className="hero-eyebrow">GARDEN FRESH, DELIVERED DIGITALLY</span>
          <h1>Fresh selections, ready when you are</h1>
          <p className="hero-text">
            Discover farm-fresh produce and local favorites delivered with care.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/search">
              Shop Now
            </a>
            <a className="btn btn-secondary" href="/search?nearby=true">
              Browse Nearby
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>120+</strong>
              <span> Local products</span>
            </div>
            <div>
              <strong>Fast</strong>
              <span> Pickup</span>
            </div>
            <div>
              <strong>Farm</strong>
              <span> Fresh</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/shop" element={<SearchPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/orders/confirm" element={<OrderConfirmPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/listings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminListingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}