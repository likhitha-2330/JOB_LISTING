import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, mobile = false }) => {
    const active = isActive(to);
    const baseClasses = mobile
      ? "block w-full text-left px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
      : "px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition font-medium";
    
    const activeClasses = active ? "bg-indigo-50 text-indigo-600" : "";
    
    return (
      <Link 
        to={to}
        className={`${baseClasses} ${activeClasses}`}
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
              JL
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                JobPortal
              </div>
              <div className="text-xs text-gray-500">Find your dream job</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/jobs">Browse Jobs</NavLink>
            
            {user ? (
              <>
                {/* Role-specific links */}
                {user.role === 'seeker' && (
                  <>
                    <NavLink to="/applications">My Applications</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                  </>
                )}
                
                {user.role === 'employer' && (
                  <>
                    <NavLink to="/employer-dashboard">Dashboard</NavLink>
                    <NavLink to="/profile">Company Profile</NavLink>
                  </>
                )}

                {/* User dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition shadow-md font-medium"
                  >
                    <span className="hidden lg:inline">{user.name}</span>
                    <span className="lg:hidden">👤</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                      {user.role === 'employer' ? '👔' : '🔍'}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowDropdown(false)}
                      />
                      
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                          <div className="text-xs text-indigo-600 font-medium mt-1">
                            {user.role === 'employer' ? '👔 Employer Account' : '🔍 Job Seeker Account'}
                          </div>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                          onClick={() => setShowDropdown(false)}
                        >
                          View Profile
                        </Link>
                        
                        <Link
                          to="/profile/edit"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                          onClick={() => setShowDropdown(false)}
                        >
                          Edit Profile
                        </Link>
                        
                        {user.role === 'seeker' && (
                          <Link
                            to="/applications"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            onClick={() => setShowDropdown(false)}
                          >
                            My Applications
                          </Link>
                        )}
                        
                        {user.role === 'employer' && (
                          <Link
                            to="/employer-dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            onClick={() => setShowDropdown(false)}
                          >
                            Dashboard
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition shadow-md font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="flex flex-col space-y-1">
              <NavLink to="/" mobile>Home</NavLink>
              <NavLink to="/jobs" mobile>Browse Jobs</NavLink>
              
              {user ? (
                <>
                  {user.role === 'seeker' && (
                    <>
                      <NavLink to="/applications" mobile>My Applications</NavLink>
                      <NavLink to="/profile" mobile>Profile</NavLink>
                    </>
                  )}
                  
                  {user.role === 'employer' && (
                    <>
                      <NavLink to="/employer-dashboard" mobile>Dashboard</NavLink>
                      <NavLink to="/profile" mobile>Company Profile</NavLink>
                    </>
                  )}
                  
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <div className="px-4 py-2 text-xs text-gray-500">
                      {user.role === 'employer' ? 'Employer Account' : 'Job Seeker Account'}
                    </div>
                    <div className="px-4 py-1 text-xs text-gray-600 font-medium">{user.name}</div>
                    <div className="px-4 py-1 text-xs text-gray-500">{user.email}</div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition font-medium text-center rounded-lg mx-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
