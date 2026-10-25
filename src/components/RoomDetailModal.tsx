import React, { useState } from 'react';
import {
  X,
  Star,
  Users,
  Bed,
  Bath,
  Maximize2,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { IRoom } from '../types';

interface RoomDetailModalProps {
  room: IRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToBooking: (room: IRoom, bookingParams?: { checkIn: string; checkOut: string; guests: number }) => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  isOpen,
  onClose,
  onProceedToBooking,
  initialCheckIn = '',
  initialCheckOut = '',
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  // Default dates: tomorrow to +3 days if not provided
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const defaultOut = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(initialCheckIn || tomorrow);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut || defaultOut);
  const [guestCount, setGuestCount] = useState(2);

  if (!isOpen || !room) return null;

  const images = room.images && room.images.length > 0
    ? room.images
    : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'];

  // Calculate nights
  const inD = new Date(checkInDate);
  const outD = new Date(checkOutDate);
  const diffDays = Math.max(1, Math.ceil((outD.getTime() - inD.getTime()) / (1000 * 60 * 60 * 24)));
  const nights = isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;

  const subtotal = room.pricePerNight * nights;
  const tax = Math.round(subtotal * 0.12 * 100) / 100;
  const serviceFee = 750;
  const total = subtotal + tax + serviceFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold">{room.title}</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500 text-white">
                Room #{room.roomNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {room.type} • Floor {room.floor} • {room.view}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={images[selectedPhoto]}
                alt={room.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{room.rating.toFixed(2)} rating</span>
                <span className="text-slate-400">• {room.reviewsCount} reviews</span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhoto(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedPhoto === idx ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Layout: Room Details & Booking Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details, Amenities, Policies */}
            <div className="lg:col-span-2 space-y-6">
              {/* Specs Bar */}
              <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                <div>
                  <Users className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 block">Capacity</span>
                  <span className="text-sm font-bold text-slate-800">{room.capacity.guests} Guests</span>
                </div>
                <div>
                  <Bed className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 block">Bedrooms</span>
                  <span className="text-sm font-bold text-slate-800">{room.capacity.beds} Bed / {room.capacity.bedrooms} Rm</span>
                </div>
                <div>
                  <Bath className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 block">Bathrooms</span>
                  <span className="text-sm font-bold text-slate-800">{room.capacity.bathrooms} Luxury</span>
                </div>
                <div>
                  <Maximize2 className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 block">Living Area</span>
                  <span className="text-sm font-bold text-slate-800">{room.sizeSqFt} sq. ft</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-serif text-base font-bold text-slate-900 mb-2">About this Suite</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{room.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-serif text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Featured Amenities & Inclusions
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {room.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies & Guarantee */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>HotelPro Guest Guarantees & Check-In Policies</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-900/80 pt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" /> Check-in: 3:00 PM
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" /> Check-out: 11:00 AM
                  </div>
                  <div>• 100% Smoke-Free Suite</div>
                  <div>• Free cancellation up to 48h prior</div>
                </div>
              </div>
            </div>

            {/* Right Col: Instant Booking Calculator Widget */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-serif font-bold text-slate-900">
                      ₹{room.pricePerNight.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500">/ night</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Best Rate Direct Guarantee
                  </span>
                </div>

                {/* Date Inputs */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" /> Check-in Date
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" /> Check-out Date
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Guests</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      {Array.from({ length: room.capacity.guests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} Guest{n > 1 ? 's' : ''} (Max {room.capacity.guests})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Breakdown in INR */}
                <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>₹{room.pricePerNight.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST & Luxury Tax (12%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Concierge & Cleaning Fee</span>
                    <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                    <span>Total Estimate</span>
                    <span className="text-amber-700">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                disabled={!room.isAvailable}
                onClick={() => {
                  onProceedToBooking(room, {
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    guests: guestCount,
                  });
                }}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Proceed to Reserve</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
