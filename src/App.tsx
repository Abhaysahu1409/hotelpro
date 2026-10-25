import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './views/HomePage';
import { RoomsPage } from './views/RoomsPage';
import { AmenitiesPage } from './views/AmenitiesPage';
import { MyBookingsPage } from './views/MyBookingsPage';
import { AdminDashboard } from './views/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { RoomDetailModal } from './components/RoomDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingVoucherModal } from './components/BookingVoucherModal';
import { DatabaseModal } from './components/DatabaseModal';
import { MernDocsModal } from './components/MernDocsModal';
import { IRoom, IBooking, DbStatusInfo } from './types';
import { api } from './services/api';

function MainApp() {
  const { user, isAdmin } = useAuth();

  // Navigation
  const [currentView, setCurrentView] = useState<'home' | 'rooms' | 'amenities' | 'my-bookings' | 'admin'>('home');

  // Data state
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [myBookings, setMyBookings] = useState<IBooking[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatusInfo | null>(null);

  // Search filter passed from home to rooms page
  const [roomFilters, setRoomFilters] = useState<{
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    type?: string;
  }>({});

  // Modals state
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<IRoom | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<IRoom | null>(null);
  const [bookingPrefillDates, setBookingPrefillDates] = useState<{ checkIn?: string; checkOut?: string; guests?: number }>({});
  const [voucherModalState, setVoucherModalState] = useState<{ isOpen: boolean; booking: IBooking | null }>({
    isOpen: false,
    booking: null,
  });
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isMernModalOpen, setIsMernModalOpen] = useState(false);

  // Load Rooms & System Status
  const loadRooms = async (dates?: { checkIn?: string; checkOut?: string }) => {
    setLoadingRooms(true);
    try {
      const res = await api.getRooms(dates);
      if (res.success) {
        setRooms(res.rooms);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const res = await api.getSystemStatus();
      if (res.success) {
        setDbStatus(res.status);
      }
    } catch {
      // ignore
    }
  };

  const loadMyBookings = async () => {
    if (!user) {
      setMyBookings([]);
      return;
    }
    setLoadingBookings(true);
    try {
      const res = await api.getMyBookings();
      if (res.success) {
        setMyBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load user reservations:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadRooms();
    loadSystemStatus();
  }, []);

  useEffect(() => {
    loadMyBookings();
  }, [user]);

  // Modal Handlers
  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const handleSelectRoom = (room: IRoom) => {
    setSelectedRoomForDetail(room);
  };

  const handleBookRoom = (room: IRoom, params?: { checkIn?: string; checkOut?: string; guests?: number }) => {
    setSelectedRoomForDetail(null);
    setSelectedRoomForBooking(room);
    if (params) {
      setBookingPrefillDates(params);
    }
  };

  const handleSearchFromHome = (searchParams: { checkIn: string; checkOut: string; guests: number; type: string }) => {
    setRoomFilters(searchParams);
    loadRooms({ checkIn: searchParams.checkIn, checkOut: searchParams.checkOut });
    setCurrentView('rooms');
  };

  const handleBookingSuccess = (booking: IBooking) => {
    // Add to bookings list
    setMyBookings((prev) => [booking, ...prev]);
    // Refresh rooms and status
    loadRooms();
    loadSystemStatus();
    // Open Voucher preview
    setVoucherModalState({ isOpen: true, booking });
  };

  const handleCancelReservation = async (bookingId: string) => {
    try {
      const res = await api.cancelBooking(bookingId);
      if (res.success && res.booking) {
        setVoucherModalState({ isOpen: true, booking: res.booking });
        loadMyBookings();
        loadRooms();
        loadSystemStatus();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel reservation');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openAuthModal={handleOpenAuth}
        openDbModal={() => setIsDbModalOpen(true)}
        openMernModal={() => setIsMernModalOpen(true)}
        dbStatus={dbStatus}
        myBookingsCount={myBookings.filter((b) => b.status === 'Confirmed').length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            rooms={rooms}
            onSelectRoom={handleSelectRoom}
            onBookRoom={handleBookRoom}
            onSearchSubmit={handleSearchFromHome}
            onViewAllRooms={() => setCurrentView('rooms')}
          />
        )}

        {currentView === 'rooms' && (
          <RoomsPage
            rooms={rooms}
            onSelectRoom={handleSelectRoom}
            onBookRoom={handleBookRoom}
            initialFilters={roomFilters}
            onDatesChange={(checkIn, checkOut) => loadRooms({ checkIn, checkOut })}
          />
        )}

        {currentView === 'amenities' && (
          <AmenitiesPage onExploreRooms={() => setCurrentView('rooms')} />
        )}

        {currentView === 'my-bookings' && (
          <MyBookingsPage
            bookings={myBookings}
            loading={loadingBookings}
            onRefresh={loadMyBookings}
            onViewVoucher={(booking) => setVoucherModalState({ isOpen: true, booking })}
            onExploreRooms={() => setCurrentView('rooms')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onRefreshData={() => {
              loadRooms();
              loadSystemStatus();
              loadMyBookings();
            }}
            openDbModal={() => setIsDbModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        openDbModal={() => setIsDbModalOpen(true)}
        openMernModal={() => setIsMernModalOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
      />

      <RoomDetailModal
        room={selectedRoomForDetail}
        isOpen={Boolean(selectedRoomForDetail)}
        onClose={() => setSelectedRoomForDetail(null)}
        onProceedToBooking={(room, params) => handleBookRoom(room, params)}
        initialCheckIn={roomFilters.checkIn}
        initialCheckOut={roomFilters.checkOut}
      />

      <BookingModal
        room={selectedRoomForBooking}
        isOpen={Boolean(selectedRoomForBooking)}
        onClose={() => setSelectedRoomForBooking(null)}
        onSuccess={handleBookingSuccess}
        initialCheckIn={bookingPrefillDates.checkIn || roomFilters.checkIn}
        initialCheckOut={bookingPrefillDates.checkOut || roomFilters.checkOut}
        initialGuests={bookingPrefillDates.guests || roomFilters.guests}
        openAuthModal={() => handleOpenAuth('login')}
      />

      <BookingVoucherModal
        booking={voucherModalState.booking}
        isOpen={voucherModalState.isOpen}
        onClose={() => setVoucherModalState({ isOpen: false, booking: null })}
        onCancelReservation={handleCancelReservation}
      />

      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        status={dbStatus}
        onRefresh={() => {
          loadSystemStatus();
          loadRooms();
        }}
      />

      <MernDocsModal
        isOpen={isMernModalOpen}
        onClose={() => setIsMernModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
