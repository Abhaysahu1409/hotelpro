import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';
import { IRoom } from '../types';
import { RoomCard } from '../components/RoomCard';

interface RoomsPageProps {
  rooms: IRoom[];
  onSelectRoom: (room: IRoom) => void;
  onBookRoom: (room: IRoom) => void;
  initialFilters?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    type?: string;
  };
  onDatesChange?: (checkIn: string, checkOut: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({
  rooms,
  onSelectRoom,
  onBookRoom,
  initialFilters,
  onDatesChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(initialFilters?.type || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [minGuests, setMinGuests] = useState<number>(initialFilters?.guests || 1);
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const [checkInDate, setCheckInDate] = useState<string>(initialFilters?.checkIn || '');
  const [checkOutDate, setCheckOutDate] = useState<string>(initialFilters?.checkOut || '');

  // Notify parent of date changes if provided
  useEffect(() => {
    if (checkInDate && checkOutDate && onDatesChange) {
      onDatesChange(checkInDate, checkOutDate);
    }
  }, [checkInDate, checkOutDate]);

  const roomTypes = [
    { id: 'all', label: 'All Categories' },
    { id: 'Deluxe Suite', label: 'Deluxe Suite' },
    { id: 'Presidential Villa', label: 'Presidential Villa' },
    { id: 'Executive Suite', label: 'Executive Suite' },
    { id: 'Family Suite', label: 'Family Suite' },
    { id: 'Standard Queen', label: 'Standard Queen' },
  ];

  const popularAmenities = [
    { id: 'all', label: 'Any Amenity' },
    { id: 'Ocean', label: 'Ocean View / Balcony' },
    { id: 'Breakfast', label: 'Breakfast Included' },
    { id: 'Jacuzzi', label: 'Jacuzzi Tub' },
    { id: 'Pool', label: 'Pool Access' },
    { id: 'Wi-Fi', label: 'High-speed Wi-Fi' },
    { id: 'Butler', label: 'Butler Service' },
  ];

  // Filtering Logic
  const filteredRooms = rooms.filter((room) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        room.title.toLowerCase().includes(q) ||
        room.description.toLowerCase().includes(q) ||
        room.roomNumber.toLowerCase().includes(q) ||
        room.type.toLowerCase().includes(q) ||
        room.amenities.some((a) => a.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Room Type
    if (selectedType !== 'all' && room.type.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }

    // Max Price
    if (room.pricePerNight > maxPrice) {
      return false;
    }

    // Min Guests
    if (room.capacity.guests < minGuests) {
      return false;
    }

    // Amenity
    if (selectedAmenity !== 'all') {
      const hasAmenity = room.amenities.some((a) =>
        a.toLowerCase().includes(selectedAmenity.toLowerCase())
      );
      if (!hasAmenity) return false;
    }

    return true;
  });

  // Sorting
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.pricePerNight - b.pricePerNight;
      case 'price-desc':
        return b.pricePerNight - a.pricePerNight;
      case 'rating-desc':
        return b.rating - a.rating;
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setMaxPrice(30000);
    setMinGuests(1);
    setSelectedAmenity('all');
    setSortBy('featured');
    setCheckInDate('');
    setCheckOutDate('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Accommodations & Suites
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Explore Available Rooms & Suites
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare room configurations, check live availability, and reserve with zero booking fees.
          </p>
        </div>

        {/* Date context pill */}
        {checkInDate && checkOutDate && (
          <div className="p-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 self-start md:self-auto">
            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Checking for: <strong>{checkInDate}</strong> to <strong>{checkOutDate}</strong>
            </span>
            <button
              onClick={() => {
                setCheckInDate('');
                setCheckOutDate('');
              }}
              className="ml-1 text-amber-700 hover:text-amber-900 font-bold"
              title="Clear date filter"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        {/* Row 1: Search, Sort, Reset */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, suite type, room #, or amenity..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
            />
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
            >
              <option value="featured">Sort by: Featured Suites First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Guest Rating: Highest First</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Pill Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {roomTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === t.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Row 3: Secondary Filters (Max Price, Guests, Amenity) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
          {/* Max Price Slider in INR */}
          <div className="space-y-1">
            <div className="flex justify-between font-medium text-slate-700">
              <span>Max Nightly Rate</span>
              <span className="font-bold text-amber-700 font-serif">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={2000}
              max={30000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Min Guests */}
          <div className="space-y-1">
            <label className="block font-medium text-slate-700">Minimum Guests</label>
            <select
              value={minGuests}
              onChange={(e) => setMinGuests(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value={1}>1+ Guests (Any)</option>
              <option value={2}>2+ Guests</option>
              <option value={3}>3+ Guests</option>
              <option value={4}>4+ Guests</option>
            </select>
          </div>

          {/* Amenity Filter */}
          <div className="space-y-1">
            <label className="block font-medium text-slate-700">Included Amenity</label>
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              {popularAmenities.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{sortedRooms.length}</strong> available room{sortedRooms.length !== 1 ? 's' : ''}
        </span>
        {filteredRooms.length < rooms.length && (
          <span className="text-amber-700 font-medium">Filters active</span>
        )}
      </div>

      {/* Room Grid or Empty State */}
      {sortedRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onSelect={onSelectRoom}
              onBookNow={onBookRoom}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <Building className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-slate-800">
            No Suites Match Your Exact Criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms, increasing your max price, or selecting a different category.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
