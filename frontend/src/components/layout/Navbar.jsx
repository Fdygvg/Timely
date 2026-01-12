import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Sun, Moon, Menu, X, User, LogOut, Home, Grid,
  Zap, Target, Rocket, Brain, Flame, Heart,
  Star, Coffee, Laptop, Book, Music
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { avatarIcons } from '../../utils/helpers';

const iconMap = {
  User, Zap, Target, Rocket,
  Brain, Flame, Heart, Star, Coffee,
  Laptop, Book, Music
};


const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth(); // We'll create AuthContext next

  useEffect(() => {
    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Hidden on Home page */}
          {location.pathname !== '/' ? (
            <Link
              to="/"
              className="flex items-center space-x-3"
            >
              <img
                src="/logo.png"
                alt="Timely Logo"
                className="w-10 h-10 rounded-xl shadow-lg border border-white/20"
              />
              <span className="hidden sm:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-600 dark:from-green-400 dark:to-yellow-400">
                Timely
              </span>
            </Link>
          ) : (
            <div className="w-10 h-10" /> // Maintain spacing if needed, or just remove
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1 mr-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg transition-colors ${isActive('/')
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <div className="flex items-center space-x-2">
                  <Home size={18} />
                  <span>Home</span>
                </div>
              </Link>

              {user && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg transition-colors ${isActive('/dashboard')
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <div className="flex items-center space-x-2">
                    <Grid size={18} />
                    <span>Dashboard</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-yellow-600 flex items-center justify-center text-white">
                    {(() => {
                      const Icon = iconMap[avatarIcons[user.avatar]] || User;
                      return <Icon size={16} />;
                    })()}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {user.username || 'User'}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.username || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Streak: {user.streak || 0} days
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl transition-colors ${isActive('/')
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <div className="flex items-center space-x-3">
                  <Home size={20} />
                  <span>Home</span>
                </div>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard')
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Grid size={20} />
                      <span>Dashboard</span>
                    </div>
                  </Link>

                  <div className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-yellow-600 flex items-center justify-center text-white">
                        {(() => {
                          const Icon = iconMap[avatarIcons[user.avatar]] || User;
                          return <Icon size={20} />;
                        })()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.username || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Streak: {user.streak || 0} days
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl flex items-center space-x-3 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-center"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;