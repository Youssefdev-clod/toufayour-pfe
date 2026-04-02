import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Navbar({ lang, setLang }) {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeClass = 'text-chocolate-600 border-b-2 border-chocolate-600';
  const inactiveClass = 'text-gray-700 hover:text-chocolate-500 transition-colors';

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-chocolate-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <span className="font-playfair font-bold text-xl text-gray-900 hidden sm:block">
              TOUFAYOUR
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 font-medium ${isActive ? activeClass : inactiveClass}`
              }
            >
              {lang === 'ar' ? 'الرئيسية' : 'Accueil'}
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3 py-2 font-medium ${isActive ? activeClass : inactiveClass}`
              }
            >
              {lang === 'ar' ? 'المنتجات' : 'Produits'}
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `px-3 py-2 font-medium relative ${isActive ? activeClass : inactiveClass}`
              }
            >
              {lang === 'ar' ? 'السلة' : 'Panier'}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-chocolate-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              className="px-4 py-2 border border-chocolate-500 text-chocolate-500 rounded-full hover:bg-chocolate-500 hover:text-white transition-colors font-medium"
            >
              {lang === 'ar' ? 'FR' : 'AR'}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-chocolate-500 focus:outline-none"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <NavLink
              to="/"
              end
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md ${
                  isActive ? 'bg-chocolate-50 text-chocolate-600' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {lang === 'ar' ? 'الرئيسية' : 'Accueil'}
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md ${
                  isActive ? 'bg-chocolate-50 text-chocolate-600' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {lang === 'ar' ? 'المنتجات' : 'Produits'}
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md flex items-center justify-between ${
                  isActive ? 'bg-chocolate-50 text-chocolate-600' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <span>{lang === 'ar' ? 'السلة' : 'Panier'}</span>
              {cartCount > 0 && (
                <span className="bg-chocolate-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}