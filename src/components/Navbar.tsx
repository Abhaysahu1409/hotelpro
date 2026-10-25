import React, { useState } from 'react';
import {
  Hotel,
  CalendarCheck,
  ShieldCheck,
  Database,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DbStatusInfo } from '../types';

interface NavbarProps {
  currentView: 'home' | 'rooms' | 'amenities' | 'my-bookings' | 'admin';
  setCurrentView: (view: 'home' | 'rooms' | 'amenities' | 'my-bookings' | 'admin') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  openDbModal: () => void;
  openMernModal: () => void;
  dbStatus: DbStatusInfo | null;
  myBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openAuthModal,
  openDbModal,
  openMernModal,
  dbStatus,
  myBookingsCount,
}) => {
  const { user, isAdmin, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Rooms & Suites' },
    { id: 'amenities', label: 'Resort Amenities' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                  HotelPro
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Hotel & Suites
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Luxury Hospitality & Reservations
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === link.id
                    ? 'text-amber-700 bg-amber-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* My Bookings link */}
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal('login');
                } else {
                  setCurrentView('my-bookings');
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'my-bookings'
                  ? 'text-amber-700 bg-amber-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-amber-600" />
              <span>My Bookings</span>
              {user && myBookingsCount > 0 && (
                <span className="px-2 py-0.2 text-xs font-semibold rounded-full bg-amber-500 text-white leading-tight">
                  {myBookingsCount}
                </span>
              )}
            </button>

            {/* Admin link (visible if admin) */}
            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                  currentView === 'admin'
                    ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action: User Menu / Login */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/40"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-amber-700 font-medium capitalize">
                      {user.role === 'admin' ? 'Hotel Manager' : 'Guest Member'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('my-bookings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors text-left cursor-pointer"
                    >
                      <CalendarCheck className="w-4 h-4 text-slate-400" />
                      <span>My Reservations</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors text-left cursor-pointer font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-amber-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === link.id
                    ? 'text-amber-700 bg-amber-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                if (!user) openAuthModal('login');
                else setCurrentView('my-bookings');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-amber-600" />
                My Bookings
              </span>
              {user && myBookingsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500 text-white">
                  {myBookingsCount}
                </span>
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium bg-purple-50 text-purple-700"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-2">
            {user ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-white bg-amber-600 rounded-lg"
                >
                  Register
                </button>
              </div>
            )}

            {/* Quick 1-click Demo Accounts switcher */}
            {!user && (
              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
                <span>Demo Sign-In:</span>
                <button
                  onClick={() => {
                    demoLogin('user');
                    setMobileMenuOpen(false);
                  }}
                  className="text-amber-700 font-semibold underline"
                >
                  Guest
                </button>
                <span>|</span>
                <button
                  onClick={() => {
                    demoLogin('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-purple-700 font-semibold underline"
                >
                  Admin
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
