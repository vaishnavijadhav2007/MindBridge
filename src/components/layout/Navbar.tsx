import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, ArrowRight } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F3EBDD]/90 backdrop-blur-md border-b border-[#E4DACA]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                if (isHome) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  window.location.href = '/';
                }
              }}
              className="text-sm font-medium text-[#403B35] hover:text-[#829675] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-[#403B35] hover:text-[#829675] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-[#403B35] hover:text-[#829675] transition-colors"
            >
              About
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4 text-[#829675]" />}>
                Log In
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#403B35] hover:bg-[#E9E1D2] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E4DACA] bg-[#FFFCF6] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
                else window.location.href = '/';
              }}
              className="text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#403B35] hover:bg-[#F3EBDD] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#403B35] hover:bg-[#F3EBDD] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#403B35] hover:bg-[#F3EBDD] transition-colors"
            >
              About
            </button>
          </div>

          <div className="pt-3 border-t border-[#E4DACA] flex flex-col gap-2.5">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="secondary" fullWidth size="md">
                Log In
              </Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="primary" fullWidth size="md">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
