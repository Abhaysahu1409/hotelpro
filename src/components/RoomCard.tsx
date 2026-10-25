import React, { useState } from 'react';
import {
  Users,
  Maximize2,
  Bed,
  Bath,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { IRoom } from '../types';

interface RoomCardProps {
  room: IRoom;
  onSelect: (room: IRoom) => void;
  onBookNow: (room: IRoom) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect, onBookNow }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = room.images && room.images.length > 0
    ? room.images
    : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'];

  const isActuallyAvailable = room.isAvailable && (room.isAvailableForDates !== false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={images[activeImageIdx]}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
              #{room.roomNumber} • {room.type}
            </span>
            {room.isFeatured && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/90 backdrop-blur-md text-white shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{room.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({room.reviewsCount})</span>
          </div>
        </div>

        {/* Bottom thumbnail switcher for multi-images */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-lg">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeImageIdx === idx ? 'bg-amber-400 w-4' : 'bg-white/60 hover:bg-white'
                }`}
                aria-label={`View photo ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Status tag */}
        <div className="absolute bottom-3 left-3">
          {isActuallyAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/90 text-white backdrop-blur-md">
              <CheckCircle className="w-3 h-3" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/90 text-white backdrop-blur-md">
              <AlertCircle className="w-3 h-3" /> Reserved / Unavailable
            </span>
          )}
        </div>
      </div>

      {/* Room Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onSelect(room)}
              className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-1"
            >
              {room.title}
            </h3>
          </div>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Room Specs */}
          <div className="grid grid-cols-4 gap-2 mt-4 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-[11px] font-medium text-center">
            <div className="flex flex-col items-center gap-0.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>{room.capacity.guests} Guests</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Bed className="w-3.5 h-3.5 text-amber-600" />
              <span>{room.capacity.beds} Bed{room.capacity.beds > 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Bath className="w-3.5 h-3.5 text-amber-600" />
              <span>{room.capacity.bathrooms} Bath</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{room.sizeSqFt} sq ft</span>
            </div>
          </div>

          {/* Amenity tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {room.amenities.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-amber-50/70 text-amber-900 text-[10px] font-medium border border-amber-200/50"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900 font-serif">
                ₹{room.pricePerNight.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-normal">/ night</span>
            </div>
            <p className="text-[10px] text-slate-400">Taxes & fees calculated at checkout</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(room)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="View Room Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={!isActuallyAvailable}
              onClick={() => onBookNow(room)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-sm hover:shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
