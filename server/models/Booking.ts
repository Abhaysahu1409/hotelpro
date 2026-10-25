import mongoose, { Schema, Document } from 'mongoose';

export interface IBookingDocument extends Document {
  bookingReference: string;
  userId: string;
  roomId: string;
  roomDetails: {
    title: string;
    roomNumber: string;
    type: string;
    pricePerNight: number;
    image: string;
  };
  guestDetails: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestsCount: {
    adults: number;
    children: number;
  };
  pricing: {
    roomRate: number;
    subtotal: number;
    taxAmount: number;
    serviceFee: number;
    totalAmount: number;
  };
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    bookingReference: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    roomId: { type: String, required: true },
    roomDetails: {
      title: { type: String, required: true },
      roomNumber: { type: String, required: true },
      type: { type: String, required: true },
      pricePerNight: { type: Number, required: true },
      image: { type: String, default: '' },
    },
    guestDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      specialRequests: { type: String, default: '' },
    },
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    nights: { type: Number, required: true, min: 1 },
    guestsCount: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
    },
    pricing: {
      roomRate: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
      serviceFee: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
    },
    paymentMethod: { type: String, default: 'Credit Card' },
    paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Completed'], default: 'Confirmed' },
  },
  {
    timestamps: true,
  }
);

BookingSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export const BookingModel = mongoose.models.Booking || mongoose.model<IBookingDocument>('Booking', BookingSchema);
