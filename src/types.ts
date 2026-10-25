export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface IRoom {
  id: string;
  roomNumber: string;
  title: string;
  type: string;
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
  isAvailableForDates?: boolean;
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
  paymentMethod: 'Credit Card' | 'Pay at Hotel';
  paymentStatus: 'Paid' | 'Pending';
  status: 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: string;
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

export interface AdminStats {
  totalRevenue: number;
  totalBookings: number;
  activeBookingsCount: number;
  totalRooms: number;
  availableRoomsCount: number;
  totalUsers: number;
  occupancyRate: number;
  recentBookings: IBooking[];
}
