import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Printer,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { IBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface MyBookingsPageProps {
  bookings: IBooking[];
  loading: boolean;
  onRefresh: () => void;
  onViewVoucher: (booking: IBooking) => void;
  onExploreRooms: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  bookings,
  loading,
  onRefresh,
  onViewVoucher,
  onExploreRooms,
}) => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | 'Confirmed' | 'Completed' | 'Cancelled'>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelBooking, setConfirmCancelBooking] = useState<IBooking | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const handleExecuteCancel = async () => {
    if (!confirmCancelBooking) return;
    setCancellingId(confirmCancelBooking.id);
    setActionMessage(null);

    try {
      const res = await api.cancelBooking(confirmCancelBooking.id);
      if (res.success) {
        setActionMessage({ type: 'success', text: `Reservation ${confirmCancelBooking.bookingReference} has been cancelled.` });
        onRefresh();
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to cancel reservation' });
    } finally {
      setCancellingId(null);
      setConfirmCancelBooking(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Guest Itinerary
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
            My Reservations & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your upcoming coastal escapes, download official vouchers, and manage booking dates.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold self-start sm:self-auto">
          {(['all', 'Confirmed', 'Completed', 'Cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading your reservations...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'Confirmed';
            const isCancelled = booking.status === 'Cancelled';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header row */}
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      REF: {booking.bookingReference}
                    </span>
                    <span className="text-slate-500">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isConfirmed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isCancelled
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{booking.status}</span>
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Room Thumbnail & Title */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={booking.roomDetails?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                      alt={booking.roomDetails?.title}
                      className="w-24 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-base text-slate-900">
                          {booking.roomDetails?.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Room #{booking.roomDetails?.roomNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{booking.roomDetails?.type}</p>
                      <p className="text-xs text-slate-600 font-medium">
                        Guest: {booking.guestDetails?.fullName} • {booking.guestsCount?.adults || 1} Adult(s)
                      </p>
                    </div>
                  </div>

                  {/* Dates & Nights Box */}
                  <div className="flex items-center gap-4 py-2 px-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-in</span>
                      <span className="font-semibold text-slate-800">{booking.checkInDate}</span>
                    </div>
                    <div className="text-slate-300">→</div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-out</span>
                      <span className="font-semibold text-slate-800">{booking.checkOutDate}</span>
                    </div>
                    <div className="pl-2 border-l border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Nights</span>
                      <span className="font-bold text-amber-700">{booking.nights}</span>
                    </div>
                  </div>

                  {/* Financial Total */}
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Total Settlement</span>
                    <span className="font-serif font-bold text-xl text-slate-900">
                      ₹{booking.pricing?.totalAmount?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-medium">
                      {booking.paymentMethod} ({booking.paymentStatus})
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => onViewVoucher(booking)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Voucher</span>
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => setConfirmCancelBooking(booking)}
                        className="px-3 py-2 text-xs font-semibold rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Cancel this reservation"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-800">
            No Reservations Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {statusFilter === 'all'
              ? "You haven't made any hotel reservations yet. Discover our award-winning coastal suites and plan your next luxury getaway."
              : `You do not have any reservations currently matching the "${statusFilter}" status.`}
          </p>
          <button
            onClick={onExploreRooms}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Explore Luxury Rooms</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cancellation Confirmation Dialog Modal */}
      {confirmCancelBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Cancel Reservation?
                </h3>
                <p className="text-xs text-slate-500">Reference: {confirmCancelBooking.bookingReference}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your stay at <strong>{confirmCancelBooking.roomDetails?.title}</strong> for dates <strong>{confirmCancelBooking.checkInDate} to {confirmCancelBooking.checkOutDate}</strong>?
            </p>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              According to hotel policy, standard cancellations are processed free of charge. The room will be released back to the general inventory.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmCancelBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                disabled={Boolean(cancellingId)}
                onClick={handleExecuteCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
              >
                {cancellingId ? 'Cancelling...' : 'Yes, Cancel Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
