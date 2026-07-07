import { Link } from 'react-router-dom';
import React from 'react';
import { useAuthStore } from '../../store/auth.store';

export default function Navbar() {
  const token = useAuthStore((s) => s.token);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">HGM</div>
        <div className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          {token ? <Link to="/dashboard">Dashboard</Link> : <Link to="/login">Login</Link>}
        </div>
      </div>
    </nav>
  );
}
