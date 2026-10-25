export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface IRoom {
  id: string;
  roomNumber: string;
  title: string;
  type: string; // 'Deluxe Suite' | 'Executive Suite' | 'Presidential Villa' | 'Standard Queen' | 'Family Suite' | 'Ocean Penthouse'
  pricePerNight: number;
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  sizeSqFt: number;
  view: string;
  floor: number;
  description: string;
  amenities: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface IBooking {
  id: string;
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
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  guestsCount: {
    adults: number;
    children: number;
  };
  pricing: {
    roomRate: number;
    subtotal: number;
    taxAmount: number; // 12%
    serviceFee: number; // $25 flat
    totalAmount: number;
  };
  paymentMethod: 'Credit Card' | 'Pay at Hotel';
  paymentStatus: 'Paid' | 'Pending';
  status: 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}

export interface DbStatusInfo {
  connected: boolean;
  mode: 'MongoDB Atlas' | 'Embedded Local Database';
  databaseName: string;
  host: string;
  totalRooms: number;
  totalBookings: number;
  totalUsers: number;
  mongoUriConfigured: boolean;
}
