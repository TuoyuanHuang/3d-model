import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Printer, User, LogOut, ShoppingCart, Package, UserCircle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  const { totalItems } = useCart();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Catalogo', href: '/catalogo' },
    { name: 'Servizi su Misura', href: '/contatti' },
    { name: 'Informazioni', href: '/chi-siamo' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <Printer className="h-8 w-8" />
            <span>3D su Misura</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* User Authentication & Cart */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Admin Dashboard Button */}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${
                      location.pathname === '/admin/dashboard'
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Cart */}
                <Link
                  to="/carrello"
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${
                    location.pathname === '/carrello'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Carrello</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Orders */}
                <Link
                  to="/ordini"
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${
                    location.pathname.startsWith('/ordini')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Ordini</span>
                </Link>

                {/* Profile */}
                <Link
                  to="/profilo"
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${
                    location.pathname === '/profilo'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <UserCircle className="h-4 w-4" />
                  <span>Profilo</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Esci</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center space-x-1 ${
                  location.pathname === '/login'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Accedi</span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 text-base font-medium transition-colors rounded-md ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User Authentication */}
            {user ? (
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                {/* Admin Dashboard Button - Mobile */}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className={`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${
                      location.pathname === '/admin/dashboard'
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <Link
                  to="/carrello"
                  className={`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${
                    location.pathname === '/carrello'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Carrello</span>
                  {totalItems > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <Link
                  to="/ordini"
                  className={`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${
                    location.pathname.startsWith('/ordini')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  <span>Ordini</span>
                </Link>

                <Link
                  to="/profilo"
                  className={`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${
                    location.pathname === '/profilo'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircle className="h-4 w-4" />
                  <span>Profilo</span>
                </Link>

                <div className="px-3 py-2 text-sm text-gray-600">
                  Ciao, {user.user_metadata?.full_name || user.email}
                  {isAdmin && (
                    <span className="block text-xs text-purple-600 font-medium">Amministratore</span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Esci</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  to="/login"
                  className={`block px-3 py-2 text-base font-medium transition-colors rounded-md flex items-center space-x-1 ${
                    location.pathname === '/login'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Accedi</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;