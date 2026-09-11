import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CartPage from '../pages/cart/CartPage';
import CheckoutPage from '../pages/cart/CheckoutPage';
import OrderConfirmPage from '../pages/cart/OrderConfirmPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ListingDetailPage from '../pages/listing/ListingDetailPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import OrderHistoryPage from '../pages/orders/OrderHistoryPage';
import SearchPage from '../pages/search/SearchPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminListingsPage from '../pages/admin/AdminListingsPage';
import ProtectedRoute from './ProtectedRoute';
import SellerDashboardPage from '../pages/dashboard/SellerDashboardPage';
import CreateListingPage from '../pages/listing/CreateListingPage';
import EditListingPage from '../pages/listing/EditListingPage';

function Home() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 1.5rem 6rem',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              alignSelf: 'flex-start',
              padding: '0.375rem 0.875rem',
              backgroundColor: '#dcfce7',
              borderRadius: '9999px',
              border: '1px solid #bbf7d0',
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>🌱</span>
            <span
              style={{
                color: '#15803d',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Garden Fresh, Delivered Digitally
            </span>
          </div>

          <h1
            style={{
              fontSize: '3.25rem',
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: '-0.03em',
            }}
          >
            Fresh selections, <br />
            <span style={{ color: '#16a34a' }}>ready when you are.</span>
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              color: '#475569',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '520px',
            }}
          >
            Discover organic farm-fresh produce, artisanal goods, and local garden harvests delivered directly to your doorstep with total care.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <a
              href="/search"
              style={{
                padding: '0.875rem 1.75rem',
                borderRadius: '10px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              Shop Now
            </a>
            <a
              href="/search?nearby=true"
              style={{
                padding: '0.875rem 1.5rem',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                color: '#166534',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                border: '1px solid #bbf7d0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              Browse Nearby 📍
            </a>
          </div>

          {/* Stat Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.25rem',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>120+</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, marginTop: '0.125rem' }}>Local Products</div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>Fast</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, marginTop: '0.125rem' }}>Local Pickup</div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>100%</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, marginTop: '0.125rem' }}>Farm Fresh</div>
            </div>
          </div>
        </div>

        {/* Hero Visual Card (Overlap Fixed) */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '3rem 2rem',
            border: '1px solid #dcfce7',
            boxShadow: '0 20px 25px -5px rgba(22, 101, 52, 0.08), 0 8px 10px -6px rgba(22, 101, 52, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem',
              marginBottom: '1.5rem',
              lineHeight: 1,
              boxShadow: '0 4px 10px rgba(22, 163, 74, 0.15)',
            }}
          >
            🧺
          </div>

          <h3
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1.625rem',
              color: '#14532d',
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            Fresh Harvest Daily
          </h3>

          <p
            style={{
              margin: 0,
              color: '#15803d',
              fontSize: '0.938rem',
              lineHeight: 1.5,
              maxWidth: '280px',
            }}
          >
            Directly connecting local growers with conscious food lovers.
          </p>
        </div>
      </section>
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
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/listings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminListingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['SUPPLIER']}>
              <SellerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listing/create"
          element={
            <ProtectedRoute allowedRoles={['SUPPLIER']}>
              <CreateListingPage />
            </ProtectedRoute>
          }
        />

        <Route
        path="/listing/edit/:id"
        element={
            <ProtectedRoute allowedRoles={['SUPPLIER']}>
              <EditListingPage />
            </ProtectedRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}