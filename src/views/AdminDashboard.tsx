import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  CalendarCheck,
  Building,
  Users,
  Plus,
  Edit2,
  Trash2,
  Power,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Database,
  RefreshCw,
  Eye,
  Sliders,
  X,
} from 'lucide-react';
import { IRoom, IBooking, IUser, AdminStats, DbStatusInfo } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  onRefreshData: () => void;
  openDbModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onRefreshData,
  openDbModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'bookings' | 'users'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatusInfo | null>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [roomSearch, setRoomSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  // Add / Edit Room Modal State
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    title: '',
    type: 'Deluxe Suite',
    pricePerNight: 8500,
    capacityGuests: 2,
    capacityBeds: 1,
    capacityBaths: 1,
    sizeSqFt: 450,
    view: 'Panoramic Ocean View',
    floor: 2,
    description: '',
    amenities: 'High-speed Wi-Fi, Smart 4K TV, Ocean Balcony, Breakfast Included, Room Service',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    isAvailable: true,
  });

  // Action status message
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, roomsRes, bookingsRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getRooms(),
        api.getAdminBookings(),
        api.getAdminUsers(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        setDbStatus(statsRes.dbStatus);
      }
      if (roomsRes.success) setRooms(roomsRes.rooms);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      if (usersRes.success) setUsers(usersRes.users);
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load admin data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Room Form handlers
  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRoomFormData({
      roomNumber: `${100 + rooms.length + 1}`,
      title: '',
      type: 'Deluxe Suite',
      pricePerNight: 8500,
      capacityGuests: 2,
      capacityBeds: 1,
      capacityBaths: 1,
      sizeSqFt: 450,
      view: 'Ocean & Skyline View',
      floor: 3,
      description: '',
      amenities: 'High-speed Wi-Fi, King Bed, Private Balcony, Breakfast Included, Room Service',
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      isAvailable: true,
    });
    setIsRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room: IRoom) => {
    setEditingRoom(room);
    setRoomFormData({
      roomNumber: room.roomNumber,
      title: room.title,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacityGuests: room.capacity.guests,
      capacityBeds: room.capacity.beds,
      capacityBaths: room.capacity.bathrooms,
      sizeSqFt: room.sizeSqFt,
      view: room.view,
      floor: room.floor,
      description: room.description,
      amenities: room.amenities.join(', '),
      imageUrl: room.images[0] || '',
      isFeatured: room.isFeatured,
      isAvailable: room.isAvailable,
    });
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amenitiesArray = roomFormData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const payload: Partial<IRoom> = {
        roomNumber: roomFormData.roomNumber,
        title: roomFormData.title,
        type: roomFormData.type,
        pricePerNight: Number(roomFormData.pricePerNight),
        capacity: {
          guests: Number(roomFormData.capacityGuests),
          bedrooms: 1,
          beds: Number(roomFormData.capacityBeds),
          bathrooms: Number(roomFormData.capacityBaths),
        },
        sizeSqFt: Number(roomFormData.sizeSqFt),
        view: roomFormData.view,
        floor: Number(roomFormData.floor),
        description: roomFormData.description,
        amenities: amenitiesArray,
        images: [roomFormData.imageUrl],
        isFeatured: roomFormData.isFeatured,
        isAvailable: roomFormData.isAvailable,
      };

      if (editingRoom) {
        await api.updateRoom(editingRoom.id, payload);
        setFeedback({ type: 'success', text: `Room ${payload.roomNumber} updated successfully!` });
      } else {
        await api.createRoom(payload);
        setFeedback({ type: 'success', text: `Room ${payload.roomNumber} added to inventory!` });
      }

      setIsRoomModalOpen(false);
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to save room.' });
    }
  };

  const handleToggleRoomStatus = async (roomId: string) => {
    try {
      const res = await api.toggleRoomAvailability(roomId);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        fetchAdminData();
        onRefreshData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const handleDeleteRoom = async (roomId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteRoom(roomId);
      setFeedback({ type: 'success', text: `Room successfully deleted.` });
      fetchAdminData();
      onRefreshData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: 'Confirmed' | 'Cancelled' | 'Completed') => {
    try {
      const res = await api.updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        fetchAdminData();
        onRefreshData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const res = await api.updateUserRole(userId, newRole);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        fetchAdminData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  // Filtered rooms in admin
  const filteredRooms = rooms.filter((r) => {
    if (!roomSearch.trim()) return true;
    const q = roomSearch.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  });

  // Filtered bookings in admin
  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter !== 'all' && b.status.toLowerCase() !== bookingStatusFilter.toLowerCase()) {
      return false;
    }
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      return (
        b.bookingReference.toLowerCase().includes(q) ||
        b.guestDetails.fullName.toLowerCase().includes(q) ||
        b.guestDetails.email.toLowerCase().includes(q) ||
        b.roomDetails.title.toLowerCase().includes(q) ||
        b.roomDetails.roomNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-widest mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Management Console
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            HotelPro General Manager Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time control over room inventory, guest reservations, and user permissions.
          </p>
        </div>

        {/* Database Diagnostic trigger & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={openDbModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>DB: {dbStatus?.connected ? 'MongoDB Atlas' : 'Embedded DB'}</span>
          </button>

          <button
            onClick={fetchAdminData}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
            title="Refresh Admin Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Gross Revenue</span>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-1">
            ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : 0}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Confirmed bookings</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Reservations</span>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-1">
            {stats?.totalBookings ?? 0}
          </p>
          <span className="text-[10px] text-amber-600 font-medium">{stats?.activeBookingsCount ?? 0} active</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Rooms Inventory</span>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-1">
            {stats?.totalRooms ?? 0}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">{stats?.availableRoomsCount ?? 0} ready to book</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Occupancy Rate</span>
          <p className="font-serif text-2xl font-bold text-purple-700 mt-1">
            {stats?.occupancyRate ?? 0}%
          </p>
          <span className="text-[10px] text-purple-600 font-medium">Current load</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs col-span-2 md:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Registered Users</span>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-1">
            {stats?.totalUsers ?? 0}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Guest & Staff IDs</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {[
          { id: 'overview', label: 'Overview & Activity' },
          { id: 'rooms', label: `Manage Rooms (${rooms.length})` },
          { id: 'bookings', label: `Manage Reservations (${bookings.length})` },
          { id: 'users', label: `User Accounts (${users.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-purple-700 text-purple-900 bg-purple-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & ACTIVITY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">Recent Guest Reservations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Guest</th>
                    <th className="pb-3">Suite</th>
                    <th className="pb-3">Dates</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-900">{b.bookingReference}</td>
                      <td className="py-3">{b.guestDetails.fullName}</td>
                      <td className="py-3 font-medium">{b.roomDetails.title} (#{b.roomDetails.roomNumber})</td>
                      <td className="py-3">{b.checkInDate} → {b.checkOutDate}</td>
                      <td className="py-3 font-bold">₹{b.pricing?.totalAmount ? b.pricing.totalAmount.toLocaleString('en-IN') : 0}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE ROOMS */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <button
              onClick={handleOpenAddRoom}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Room</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="p-4">Room #</th>
                    <th className="p-4">Suite Title & Category</th>
                    <th className="p-4">Nightly Rate</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        #{room.roomNumber}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=100&q=80'}
                            alt={room.title}
                            className="w-12 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{room.title}</p>
                            <p className="text-[11px] text-slate-500">{room.type} • Floor {room.floor}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-serif font-bold text-sm text-slate-900">
                        ₹{room.pricePerNight ? room.pricePerNight.toLocaleString('en-IN') : 0}
                      </td>
                      <td className="p-4">
                        {room.capacity.guests} Guests ({room.capacity.beds} Bed, {room.capacity.bathrooms} Bath)
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleRoomStatus(room.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                            room.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                          title="Click to toggle availability"
                        >
                          <Power className="w-3 h-3" />
                          <span>{room.isAvailable ? 'Available' : 'Unavailable'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditRoom(room)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Edit Room"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id, room.title)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE RESERVATIONS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reference, guest, room..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="flex gap-1.5">
              {['all', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                    bookingStatusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {st === 'all' ? 'All Bookings' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Guest Details</th>
                    <th className="p-4">Suite</th>
                    <th className="p-4">Stay Dates</th>
                    <th className="p-4">Settlement</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {b.bookingReference}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{b.guestDetails.fullName}</p>
                        <p className="text-[11px] text-slate-500">{b.guestDetails.email}</p>
                        <p className="text-[11px] text-slate-500">{b.guestDetails.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{b.roomDetails.title}</p>
                        <p className="text-[11px] text-slate-500">Room #{b.roomDetails.roomNumber}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{b.checkInDate} → {b.checkOutDate}</p>
                        <p className="text-[11px] text-slate-500">{b.nights} night(s)</p>
                      </td>
                      <td className="p-4">
                        <p className="font-serif font-bold text-slate-900">₹{b.pricing?.totalAmount ? b.pricing.totalAmount.toLocaleString('en-IN') : 0}</p>
                        <p className="text-[10px] text-slate-500">{b.paymentMethod}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                          className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium cursor-pointer"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right">Toggle Admin Privileges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-600">{u.email}</td>
                    <td className="p-4 text-slate-500">{u.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleUpdateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                        className="px-3 py-1 rounded-lg border text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                      >
                        {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">
                {editingRoom ? `Edit Room #${editingRoom.roomNumber}` : 'Add New Hotel Room'}
              </h3>
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={roomFormData.roomNumber}
                    onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Room Category</label>
                  <select
                    value={roomFormData.type}
                    onChange={(e) => setRoomFormData({ ...roomFormData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Deluxe Suite">Deluxe Suite</option>
                    <option value="Presidential Villa">Presidential Villa</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Family Suite">Family Suite</option>
                    <option value="Standard Queen">Standard Queen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Room Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Horizon Panoramic Penthouse"
                  value={roomFormData.title}
                  onChange={(e) => setRoomFormData({ ...roomFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Price / Night (₹ INR)</label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={roomFormData.pricePerNight}
                    onChange={(e) => setRoomFormData({ ...roomFormData, pricePerNight: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Max Guests</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={10}
                    value={roomFormData.capacityGuests}
                    onChange={(e) => setRoomFormData({ ...roomFormData, capacityGuests: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sq Feet</label>
                  <input
                    type="number"
                    value={roomFormData.sizeSqFt}
                    onChange={(e) => setRoomFormData({ ...roomFormData, sizeSqFt: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">View Type</label>
                  <input
                    type="text"
                    value={roomFormData.view}
                    onChange={(e) => setRoomFormData({ ...roomFormData, view: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Floor #</label>
                  <input
                    type="number"
                    value={roomFormData.floor}
                    onChange={(e) => setRoomFormData({ ...roomFormData, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  required
                  value={roomFormData.imageUrl}
                  onChange={(e) => setRoomFormData({ ...roomFormData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={roomFormData.description}
                  onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={roomFormData.amenities}
                  onChange={(e) => setRoomFormData({ ...roomFormData, amenities: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomFormData.isFeatured}
                    onChange={(e) => setRoomFormData({ ...roomFormData, isFeatured: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-slate-700">Feature this room on homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomFormData.isAvailable}
                    onChange={(e) => setRoomFormData({ ...roomFormData, isAvailable: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-slate-700">Currently Available for booking</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
