import React, { useState } from 'react';
import {
  X,
  Calendar,
  CreditCard,
  Building,
  User,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IRoom, IBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface BookingModalProps {
  room: IRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: IBooking) => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  openAuthModal: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  isOpen,
  onClose,
  onSuccess,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  openAuthModal,
}) => {
  const { user } = useAuth();

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const defaultOut = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(initialCheckIn || tomorrow);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut || defaultOut);
  const [adults, setAdults] = useState(initialGuests || 2);
  const [children, setChildren] = useState(0);

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-2831');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Pay at Hotel'>('Credit Card');

  // Simulated credit card state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with user updates
  React.useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);

  if (!isOpen || !room) return null;

  // Nights calculation
  const inD = new Date(checkInDate);
  const outD = new Date(checkOutDate);
  const diffDays = Math.max(1, Math.ceil((outD.getTime() - inD.getTime()) / (1000 * 60 * 60 * 24)));
  const nights = isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;

  const roomRate = room.pricePerNight;
  const subtotal = roomRate * nights;
  const taxAmount = Math.round(subtotal * 0.12 * 100) / 100;
  const serviceFee = 750;
  const totalAmount = Math.round((subtotal + taxAmount + serviceFee) * 100) / 100;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Please sign in to complete your reservation.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please complete all required guest contact fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.createBooking({
        roomId: room.id,
        checkInDate,
        checkOutDate,
        guestDetails: {
          fullName,
          email,
          phone,
          specialRequests,
        },
        guestsCount: { adults, children },
        paymentMethod,
      });

      if (response.success && response.booking) {
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        onSuccess(response.booking);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete reservation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Complete Your Reservation</h3>
              <p className="text-xs text-slate-300">
                {room.title} (Room #{room.roomNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleBookingSubmit} className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!user && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>You need to be signed in to save and track your reservations.</span>
              </div>
              <button
                type="button"
                onClick={openAuthModal}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold cursor-pointer shrink-0"
              >
                Sign In Now
              </button>
            </div>
          )}

          {/* Room Summary Header Card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
              alt={room.title}
              className="w-full sm:w-28 h-20 rounded-lg object-cover"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="font-serif font-bold text-slate-900 text-sm">{room.title}</h4>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  {room.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Floor {room.floor} • {room.view} • Max {room.capacity.guests} Guests
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 mt-1 font-medium">
                <span>Rate: ₹{room.pricePerNight.toLocaleString('en-IN')}/night</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">{nights} Nights Stay</span>
              </div>
            </div>
          </div>

          {/* Section 1: Dates & Guests */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Stay Dates & Party Size
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Check-in</label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Check-out</label>
                <input
                  type="date"
                  required
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500"
                >
                  {Array.from({ length: room.capacity.guests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Children</label>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value={0}>0 Children</option>
                  <option value={1}>1 Child</option>
                  <option value={2}>2 Children</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Guest Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" /> Primary Guest Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Special Requests & Preferences (Optional)
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g., Early check-in requested, high floor, quiet corner, dietary preferences..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Payment & Guarantee
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'Credit Card'
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={() => setPaymentMethod('Credit Card')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Credit Card (Instant Guarantee)</span>
                  <span className="text-[11px] text-slate-500">Pay securely online with instant voucher</span>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'Pay at Hotel'
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Pay at Hotel'}
                  onChange={() => setPaymentMethod('Pay at Hotel')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Pay at Hotel Reception</span>
                  <span className="text-[11px] text-slate-500">Pay upon arrival during check-in</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'Credit Card' && (
              <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Simulated Card Payment</span>
                  <span className="font-mono text-amber-400">VISA / MASTERCARD</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Price Summary (INR) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Suite Rate (₹{room.pricePerNight.toLocaleString('en-IN')} × {nights} nights)</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST & Hospitality Tax (12%)</span>
              <span>₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Concierge & Cleaning Fee</span>
              <span>₹{serviceFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-serif font-bold text-base text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Booking Amount</span>
              <span className="text-amber-700">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Reservation (₹{totalAmount.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
