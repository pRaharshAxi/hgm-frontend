// AppRouter.tsx

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from '../pages/dashboard/DashboardPage';

function Home() {
  return (
    <div className="hero-screen">
      <Navbar />
      <main className="hero-content">
        <div className="hero-copy">
          <span className="hero-eyebrow">DOMINICAN FLAVOR, MADE DIGITAL</span>
          <h1>Fresh selections, ready when you are</h1>
          <p className="hero-text">
            Order online. Pick up fresh local products—plátano, yuca, sazón—without the hassle.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/shop">
              Shop Now
            </Link>
            <Link className="btn btn-secondary" to="/how-it-works">
              How it Works
            </Link>
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