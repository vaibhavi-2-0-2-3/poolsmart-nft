
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletConnect } from '../wallet/WalletConnect';
import { MenuIcon, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm dark:bg-slate-900/80' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center">
            <span className="text-white font-semibold">P</span>
          </div>
          <span className="text-xl font-semibold">PoolChain</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-brand-600 ${
              isActive('/') ? 'text-brand-600' : 'text-foreground'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/rides" 
            className={`text-sm font-medium transition-colors hover:text-brand-600 ${
              isActive('/rides') ? 'text-brand-600' : 'text-foreground'
            }`}
          >
            Find Rides
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium transition-colors hover:text-brand-600 ${
              isActive('/dashboard') ? 'text-brand-600' : 'text-foreground'
            }`}
          >
            Dashboard
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <WalletConnect />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-border animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors py-2 ${
                isActive('/') ? 'text-brand-600' : 'text-foreground'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/rides" 
              className={`text-sm font-medium transition-colors py-2 ${
                isActive('/rides') ? 'text-brand-600' : 'text-foreground'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Rides
            </Link>
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors py-2 ${
                isActive('/dashboard') ? 'text-brand-600' : 'text-foreground'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="pt-2">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export { Navbar };
