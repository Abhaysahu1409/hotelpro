import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  Award,
  Coffee,
  Waves,
  UtensilsCrossed,
  Flower2,
  Anchor,
  CheckCircle2,
} from 'lucide-react';
import { IRoom } from '../types';
import { RoomCard } from '../components/RoomCard';

interface HomePageProps {
  rooms: IRoom[];
  onSelectRoom: (room: IRoom) => void;
  onBookRoom: (room: IRoom) => void;
  onSearchSubmit: (searchParams: { checkIn: string; checkOut: string; guests: number; type: string }) => void;
  onViewAllRooms: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  rooms,
  onSelectRoom,
  onBookRoom,
  onSearchSubmit,
  onViewAllRooms,
}) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const defaultOut = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(tomorrow);
  const [checkOut, setCheckOut] = useState(defaultOut);
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit({
      checkIn,
      checkOut,
      guests,
      type: roomType,
    });
  };

  const featuredRooms = rooms.filter((r) => r.isFeatured).slice(0, 3);
  const displayFeatured = featuredRooms.length > 0 ? featuredRooms : rooms.slice(0, 3);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Deep Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
            alt="HotelPro Luxury Resort"
            className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Award-Winning Coastal Luxury Resort & Private Villas</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight max-w-4xl leading-[1.15]">
            Where Unrivaled Elegance Meets the Ocean Horizon
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-2xl font-light leading-relaxed">
            Experience bespoke hospitality, oceanfront suites, Michelin-caliber dining, and personalized concierge hospitality designed for the world's most discerning travelers.
          </p>

          {/* Interactive Search Widget Bar */}
          <div className="mt-10 w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/40">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end text-left">
              {/* Check-In */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" /> Check-in Date
                </label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              {/* Check-Out */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" /> Check-out Date
                </label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-600" /> Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>5+ Guests (Villa)</option>
                </select>
              </div>

              {/* Room Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-600" /> Category
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
                >
                  <option value="all">All Room Types</option>
                  <option value="Deluxe Suite">Deluxe Suites</option>
                  <option value="Presidential Villa">Presidential Villas</option>
                  <option value="Executive Suite">Executive Suites</option>
                  <option value="Family Suite">Family Suites</option>
                  <option value="Standard Queen">Standard Deluxe</option>
                </select>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer h-[42px]"
                >
                  <span>Check Availability</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Value Badges Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Best Rate Guarantee</p>
              <p className="text-[11px] text-slate-500">Direct booking perks & flexible changes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Instant Confirmation</p>
              <p className="text-[11px] text-slate-500">Official digital voucher issued instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Artisan Breakfast</p>
              <p className="text-[11px] text-slate-500">Included on all suite reservations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">5-Star Verified</p>
              <p className="text-[11px] text-slate-500">Over 1,200 verified guest reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Signature Collections
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Featured Suites & Private Sanctuaries
            </h2>
          </div>

          <button
            onClick={onViewAllRooms}
            className="flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors group cursor-pointer"
          >
            <span>Explore All {rooms.length} Suites</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayFeatured.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onSelect={onSelectRoom}
              onBookNow={onBookRoom}
            />
          ))}
        </div>
      </section>

      {/* Luxury Amenities Experience Showcase */}
      <section className="bg-slate-900 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Unmatched Amenities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 text-white">
              Curated for Indulgence & Rejuvenation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              Every detail at HotelPro has been sculpted to provide an immersive sanctuary from sunrise over the ocean to evening fireside cocktails.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Ocean Infinity Pool</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Heated multi-tiered infinity pool cantilevered over the Pacific with private cabanas and daybed service.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Michelin Dining</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Three exquisite restaurants featuring sustainably sourced coastal seafood and an extensive sommelier cellar.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Flower2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Ocean Beach Club & Cabanas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Private shoreline daybeds, chilled tropical refreshments, complimentary paddleboards, and sunset live acoustic sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Anchor className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Private Yacht Charters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sail the coastline at twilight aboard the resort’s private 65-foot catamaran with champagne and oysters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Guest Reflections
          </span>
          <h2 className="font-serif text-3xl font-bold mt-1 text-slate-900">
            Stories from Our Guests
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "The Presidential Sky Penthouse exceeded all expectations. Waking up to 180-degree ocean views and enjoying coffee on the private terrace was unforgettable."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Guest"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Sophia Sterling</p>
                <p className="text-[11px] text-slate-400">Stayed in Presidential Suite</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Booking was completely seamless, and the check-in voucher had everything we needed. The staff greeted us by name and the executive hospitality was world-class."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Guest"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Marcus Sterling, MD</p>
                <p className="text-[11px] text-slate-400">Stayed in Deluxe Oceanfront</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "The Family Residence gave our kids plenty of space while giving us a luxury retreat. The concierge team took care of all dinner bookings and surf lessons."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                alt="Guest"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Dr. Elena Rostova</p>
                <p className="text-[11px] text-slate-400">Stayed in Family Residence</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
