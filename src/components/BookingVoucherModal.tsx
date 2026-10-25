import React from 'react';
import {
  X,
  Printer,
  Calendar,
  CheckCircle2,
  Hotel,
  Clock,
  MapPin,
  QrCode,
  User,
  CreditCard,
  Download,
} from 'lucide-react';
import { IBooking } from '../types';

interface BookingVoucherModalProps {
  booking: IBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelReservation?: (bookingId: string) => void;
}

export const BookingVoucherModal: React.FC<BookingVoucherModalProps> = ({
  booking,
  isOpen,
  onClose,
  onCancelReservation,
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top actions bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-bold text-amber-400">HotelPro Reservation Voucher</span>
            <span className="text-xs text-slate-400">• Ref: {booking.bookingReference}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer border border-slate-700"
              title="Print official voucher"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Content */}
        <div id="printable-voucher" className="p-6 overflow-y-auto space-y-6">
          {/* Voucher Header with Crest */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                  HotelPro Hotel & Suites
                </h2>
                <p className="text-xs text-slate-500">Official Guest Reservation Voucher & Invoice</p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  booking.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : booking.status === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{booking.status.toUpperCase()}</span>
              </span>
              <p className="font-mono text-xs font-bold text-slate-900 mt-1">
                REF: {booking.bookingReference}
              </p>
            </div>
          </div>

          {/* Dates & Room Info Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Check-in Date
              </span>
              <p className="text-sm font-bold text-slate-900">{booking.checkInDate}</p>
              <p className="text-slate-500">From 3:00 PM (15:00)</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Check-out Date
              </span>
              <p className="text-sm font-bold text-slate-900">{booking.checkOutDate}</p>
              <p className="text-slate-500">Until 11:00 AM (11:00)</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Duration & Guests
              </span>
              <p className="text-sm font-bold text-slate-900">
                {booking.nights} Night{booking.nights > 1 ? 's' : ''} Stay
              </p>
              <p className="text-slate-500">
                {booking.guestsCount?.adults || 2} Adults
                {booking.guestsCount?.children ? `, ${booking.guestsCount.children} Children` : ''}
              </p>
            </div>
          </div>

          {/* Reserved Room Details */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white">
            <img
              src={booking.roomDetails?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
              alt={booking.roomDetails?.title}
              className="w-20 h-20 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-slate-900 text-sm">
                  {booking.roomDetails?.title}
                </h4>
                <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                  Room #{booking.roomDetails?.roomNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{booking.roomDetails?.type}</p>
              <p className="text-xs text-slate-600 mt-1">
                Rate: ₹{booking.roomDetails?.pricePerNight?.toLocaleString('en-IN')} / night
              </p>
            </div>
          </div>

          {/* Guest Information & Special Requests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-600" /> Guest Details
              </span>
              <p className="text-slate-800 font-medium">{booking.guestDetails?.fullName}</p>
              <p className="text-slate-500">{booking.guestDetails?.email}</p>
              <p className="text-slate-500">{booking.guestDetails?.phone}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Payment & Settlement
              </span>
              <p className="text-slate-800 font-medium">Method: {booking.paymentMethod}</p>
              <p className="text-slate-500">Status: {booking.paymentStatus}</p>
              <p className="text-slate-500">Booked On: {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {booking.guestDetails?.specialRequests && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 block mb-0.5">Special Requests:</span>
              <p className="text-slate-600 italic">"{booking.guestDetails.specialRequests}"</p>
            </div>
          )}

          {/* Financial Invoice Breakdown in INR */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700">Payment Breakdown (INR)</div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Room Subtotal ({booking.nights} nights × ₹{booking.pricing?.roomRate?.toLocaleString('en-IN')})</span>
                <span>₹{booking.pricing?.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST & Hospitality Tax (12%)</span>
                <span>₹{booking.pricing?.taxAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cleaning & Service Fee</span>
                <span>₹{booking.pricing?.serviceFee?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-serif font-bold text-base text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-amber-700">₹{booking.pricing?.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Hotel Location & Instructions */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>1088 Ocean Drive, Coral Bay Haven, CA 90210</span>
            </div>
            <div className="font-mono text-slate-400">
              Check-in pin: #{booking.bookingReference.replace('HP-', '')}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {booking.status === 'Confirmed' && onCancelReservation && (
            <button
              onClick={() => onCancelReservation(booking.id)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
            >
              Cancel Reservation
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
