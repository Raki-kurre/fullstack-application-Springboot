import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${location.pathname === to
          ? 'bg-blue-700 text-white'
          : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="text-white font-bold text-xl">ShopApp</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLink('/dashboard', 'Products')}
            {navLink('/profile', 'Profile')}
          </div>

          {/* User info + logout */}
          <div className="hidden md:flex items-center gap-3">
            {/* Role badge */}
            <span className={`px-2 py-1 rounded-full text-xs font-bold
              ${isAdmin ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'}`}>
              {isAdmin ? '👑 ADMIN' : '👤 USER'}
            </span>

            {/* Avatar + name */}
            <div className="flex items-center gap-2">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center
                  justify-center text-white font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-white text-sm font-medium">{user?.name}</span>
            </div>

            <button onClick={handleLogout}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold
                text-sm px-3 py-1.5 rounded-lg transition-colors">
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {navLink('/dashboard', 'Products')}
            {navLink('/profile', 'Profile')}
            <button onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm
                font-medium text-blue-100 hover:bg-blue-700">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
