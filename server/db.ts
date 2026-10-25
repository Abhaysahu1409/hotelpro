import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { IUser, IRoom, IBooking, DbStatusInfo } from './types';
import { UserModel } from './models/User';
import { RoomModel } from './models/Room';
import { BookingModel } from './models/Booking';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'hotelpro_db.json');

// State flags
let isMongoConnected = false;
let mongoConnectionError: string | null = null;
let currentDbName = 'hotelpro_local';

interface LocalStore {
  users: IUser[];
  rooms: IRoom[];
  bookings: IBooking[];
}

let localStore: LocalStore = {
  users: [],
  rooms: [],
  bookings: [],
};

// Initial Seed Data
const INITIAL_ROOMS: Omit<IRoom, 'id' | 'createdAt'>[] = [
  {
    roomNumber: '101',
    title: 'Deluxe Oceanfront Suite',
    type: 'Deluxe Suite',
    pricePerNight: 8499,
    capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    sizeSqFt: 550,
    view: 'Panoramic Ocean View',
    floor: 3,
    description: 'Immerse yourself in coastal elegance. Features an expansive private terrace overlooking the azure waves, a plush California King bed, Italian marble bath with soaking tub, and espresso station.',
    amenities: ['High-speed Wi-Fi', 'King Bed', 'Private Ocean Balcony', 'Soaking Jacuzzi Tub', 'Breakfast Included', 'Nespresso Coffee Bar', 'Smart 65" 4K TV', '24/7 Room Service'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.95,
    reviewsCount: 38,
    isFeatured: true,
    isAvailable: true,
  },
  {
    roomNumber: 'PH-01',
    title: 'The Presidential Sky Penthouse',
    type: 'Presidential Villa',
    pricePerNight: 24999,
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 2.5 },
    sizeSqFt: 1400,
    view: '360° Sky & Ocean Horizon',
    floor: 18,
    description: 'The pinnacle of luxury hospitality. Top-floor duplex offering a personal heated plunge pool, dedicated 24-hour butler, private bar, grand piano, and curated contemporary art collections.',
    amenities: ['Private Heated Plunge Pool', 'Dedicated Butler Service', 'Chef Kitchen & Bar', 'Dual Master Suites', 'Airport Chauffeur Included', 'VIP Club Lounge Access', 'Bang & Olufsen Sound', 'Private Ocean Cabana'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 5.0,
    reviewsCount: 19,
    isFeatured: true,
    isAvailable: true,
  },
  {
    roomNumber: '204',
    title: 'Executive Grand King Suite',
    type: 'Executive Suite',
    pricePerNight: 6499,
    capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    sizeSqFt: 480,
    view: 'Skyline & Harbor View',
    floor: 7,
    description: 'Tailored for discerning professionals and couples. Features an ergonomic Herman Miller workstation, high-speed fiber internet, rainfall shower, and evening cocktail reception access.',
    amenities: ['Ergonomic Workspace', 'King Bed', 'Rainfall Walk-in Shower', 'Executive Lounge Access', 'High-speed Wi-Fi', 'Complimentary Dry Cleaning', 'Mini Bar', 'Pillow Menu'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.88,
    reviewsCount: 42,
    isFeatured: true,
    isAvailable: true,
  },
  {
    roomNumber: '302',
    title: 'Serenity Garden Pool Villa',
    type: 'Presidential Villa',
    pricePerNight: 14999,
    capacity: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1.5 },
    sizeSqFt: 850,
    view: 'Botanical Garden & Lagoon',
    floor: 1,
    description: 'Surrounded by lush tropical gardens, this secluded villa features a private sun terrace, outdoor open-air shower, daybed gazebo, and private direct pathway to the lagoon pool.',
    amenities: ['Direct Pool Access', 'Private Sun Deck & Daybed', 'Tropical Outdoor Shower', 'Complimentary Breakfast', 'High-speed Wi-Fi', 'Yoga Mats & Wellness Kit', 'Botanical Tea Selection'],
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.92,
    reviewsCount: 27,
    isFeatured: true,
    isAvailable: true,
  },
  {
    roomNumber: '410',
    title: 'Family Coastal Residence',
    type: 'Family Suite',
    pricePerNight: 10499,
    capacity: { guests: 5, bedrooms: 2, beds: 3, bathrooms: 2 },
    sizeSqFt: 720,
    view: 'Ocean & Resort Courtyard',
    floor: 4,
    description: 'Spacious interconnecting suite designed for families. Includes a master bedroom with king bed and an adjoining twin room, two full bathrooms, family lounge, and children welcome gift basket.',
    amenities: ['2 Bedrooms', 'Full Kitchenette', 'Child-Friendly Amenities', 'High-speed Wi-Fi', 'Two 55" Smart TVs', 'Double Vanity Bathrooms', 'Complimentary Crib upon request'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.84,
    reviewsCount: 31,
    isFeatured: false,
    isAvailable: true,
  },
  {
    roomNumber: '115',
    title: 'Standard Heritage Deluxe',
    type: 'Standard Queen',
    pricePerNight: 3999,
    capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    sizeSqFt: 340,
    view: 'Courtyard Garden View',
    floor: 2,
    description: 'A cozy sanctuary featuring handcrafted hardwood furnishings, queen pillow-top bed, silent climate control, artisanal bath amenities, and warm ambient lighting.',
    amenities: ['Queen Plush Bed', 'High-speed Wi-Fi', 'Work Desk', 'Walk-in Shower', 'Smart TV', 'Coffee & Tea Maker', 'In-room Safe'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.79,
    reviewsCount: 64,
    isFeatured: false,
    isAvailable: true,
  },
];

// Helper to save local store
function saveLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(localStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist local store file:', err);
  }
}

// Helper to load or initialize local store
async function initLocalStore() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      localStore = JSON.parse(data);
      if (localStore.rooms && localStore.rooms.length > 0) {
        return;
      }
    } catch (err) {
      console.warn('Error reading local db file, recreating seed data:', err);
    }
  }

  // Pre-seed users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const guestPasswordHash = await bcrypt.hash('guest123', 10);

  const defaultAdmin: IUser = {
    id: 'user_admin_001',
    name: 'Eleanor Vance (Hotel General Manager)',
    email: 'admin@hotelpro.com',
    password: adminPasswordHash,
    role: 'admin',
    phone: '+1 (555) 019-2831',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  };

  const defaultGuest: IUser = {
    id: 'user_guest_001',
    name: 'Alexander Hayes',
    email: 'guest@hotelpro.com',
    password: guestPasswordHash,
    role: 'user',
    phone: '+1 (555) 482-1940',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  };

  const seededRooms: IRoom[] = INITIAL_ROOMS.map((r, idx) => ({
    ...r,
    id: `room_${idx + 101}`,
    createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
  }));

  // Seed sample past & upcoming bookings
  const seededBookings: IBooking[] = [
    {
      id: 'book_001',
      bookingReference: 'HP-784102',
      userId: defaultGuest.id,
      roomId: seededRooms[0].id,
      roomDetails: {
        title: seededRooms[0].title,
        roomNumber: seededRooms[0].roomNumber,
        type: seededRooms[0].type,
        pricePerNight: seededRooms[0].pricePerNight,
        image: seededRooms[0].images[0],
      },
      guestDetails: {
        fullName: defaultGuest.name,
        email: defaultGuest.email,
        phone: defaultGuest.phone || '+1 (555) 482-1940',
        specialRequests: 'High floor preferred and early check-in around 1:00 PM if available.',
      },
      checkInDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      checkOutDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
      nights: 3,
      guestsCount: { adults: 2, children: 0 },
      pricing: {
        roomRate: 8499,
        subtotal: 25497,
        taxAmount: 3059.64,
        serviceFee: 750,
        totalAmount: 29306.64,
      },
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'book_002',
      bookingReference: 'HP-391827',
      userId: defaultGuest.id,
      roomId: seededRooms[2].id,
      roomDetails: {
        title: seededRooms[2].title,
        roomNumber: seededRooms[2].roomNumber,
        type: seededRooms[2].type,
        pricePerNight: seededRooms[2].pricePerNight,
        image: seededRooms[2].images[0],
      },
      guestDetails: {
        fullName: defaultGuest.name,
        email: defaultGuest.email,
        phone: defaultGuest.phone || '+1 (555) 482-1940',
        specialRequests: 'Quiet room for executive video calls.',
      },
      checkInDate: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
      checkOutDate: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
      nights: 2,
      guestsCount: { adults: 1, children: 0 },
      pricing: {
        roomRate: 6499,
        subtotal: 12998,
        taxAmount: 1559.76,
        serviceFee: 750,
        totalAmount: 15307.76,
      },
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      status: 'Completed',
      createdAt: new Date(Date.now() - 86400000 * 16).toISOString(),
    },
  ];

  localStore = {
    users: [defaultAdmin, defaultGuest],
    rooms: seededRooms,
    bookings: seededBookings,
  };

  saveLocalStore();
}

/**
 * Initialize MongoDB connection or fallback to Local Store
 */
export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  // Always initialize local store first for resilience
  await initLocalStore();

  if (!mongoUri || mongoUri.includes('example.mongodb.net')) {
    console.log('[HotelPro DB] No real MONGODB_URI configured. Running in Local High-Performance Store mode.');
    isMongoConnected = false;
    currentDbName = 'hotelpro_embedded';
    return;
  }

  try {
    console.log('[HotelPro DB] Attempting connection to MongoDB at:', mongoUri.replace(/:([^:@]+)@/, ':****@'));
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    currentDbName = mongoose.connection.name || 'hotelpro';
    console.log(`[HotelPro DB] Connected successfully to MongoDB: ${currentDbName}`);

    // If MongoDB is connected and empty, seed it
    const roomCount = await RoomModel.countDocuments();
    if (roomCount === 0) {
      console.log('[HotelPro DB] Seeding initial data into MongoDB...');
      for (const room of localStore.rooms) {
        await RoomModel.create(room);
      }
      for (const user of localStore.users) {
        await UserModel.create(user);
      }
      for (const booking of localStore.bookings) {
        await BookingModel.create(booking);
      }
      console.log('[HotelPro DB] Seeded initial data into MongoDB.');
    }
  } catch (err: any) {
    isMongoConnected = false;
    mongoConnectionError = err.message || 'Connection failed';
    console.warn('[HotelPro DB] MongoDB connection failed. Falling back to Local Store:', err.message);
  }
}

/**
 * Get current DB status information
 */
export async function getDbStatus(): Promise<DbStatusInfo> {
  let totalRooms = localStore.rooms.length;
  let totalBookings = localStore.bookings.length;
  let totalUsers = localStore.users.length;

  if (isMongoConnected) {
    try {
      totalRooms = await RoomModel.countDocuments();
      totalBookings = await BookingModel.countDocuments();
      totalUsers = await UserModel.countDocuments();
    } catch {
      // fallback
    }
  }

  const mongoUri = process.env.MONGODB_URI;
  const hasRealMongoUri = Boolean(mongoUri && !mongoUri.includes('example.mongodb.net'));

  return {
    connected: isMongoConnected,
    mode: isMongoConnected ? 'MongoDB Atlas' : 'Embedded Local Database',
    databaseName: isMongoConnected ? currentDbName : 'hotelpro_embedded.json',
    host: isMongoConnected ? (mongoose.connection.host || 'MongoDB Atlas') : 'Local Storage Engine',
    totalRooms,
    totalBookings,
    totalUsers,
    mongoUriConfigured: hasRealMongoUri,
  };
}

// ---------------- USER OPERATIONS ----------------

export async function findUserByEmail(email: string): Promise<IUser | null> {
  const normalized = email.trim().toLowerCase();
  if (isMongoConnected) {
    const doc = await UserModel.findOne({ email: normalized }).lean();
    if (doc) {
      return {
        id: (doc as any)._id.toString(),
        name: doc.name,
        email: doc.email,
        password: doc.password,
        role: doc.role,
        phone: doc.phone,
        avatar: doc.avatar,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      };
    }
    return null;
  }

  const found = localStore.users.find((u) => u.email.toLowerCase() === normalized);
  return found || null;
}

export async function findUserById(id: string): Promise<IUser | null> {
  if (isMongoConnected) {
    const doc = await UserModel.findById(id).lean();
    if (doc) {
      return {
        id: (doc as any)._id.toString(),
        name: doc.name,
        email: doc.email,
        password: doc.password,
        role: doc.role,
        phone: doc.phone,
        avatar: doc.avatar,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      };
    }
    return null;
  }

  const found = localStore.users.find((u) => u.id === id);
  return found || null;
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  phone?: string;
}): Promise<IUser> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const normalizedEmail = userData.email.trim().toLowerCase();

  if (isMongoConnected) {
    const doc = await UserModel.create({
      name: userData.name,
      email: normalizedEmail,
      password: hashedPassword,
      role: userData.role || 'user',
      phone: userData.phone || '',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
    });
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      role: doc.role,
      phone: doc.phone,
      avatar: doc.avatar,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  const newUser: IUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: userData.name,
    email: normalizedEmail,
    password: hashedPassword,
    role: userData.role || 'user',
    phone: userData.phone || '',
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
    createdAt: new Date().toISOString(),
  };

  localStore.users.push(newUser);
  saveLocalStore();
  return newUser;
}

export async function getAllUsers(): Promise<Omit<IUser, 'password'>[]> {
  if (isMongoConnected) {
    const docs = await UserModel.find({}, '-password').sort({ createdAt: -1 }).lean();
    return docs.map((d: any) => ({
      id: d._id.toString(),
      name: d.name,
      email: d.email,
      role: d.role,
      phone: d.phone,
      avatar: d.avatar,
      createdAt: d.createdAt?.toISOString() || new Date().toISOString(),
    }));
  }

  return localStore.users.map(({ password, ...u }) => u);
}

export async function updateUserRole(userId: string, newRole: 'user' | 'admin'): Promise<boolean> {
  if (isMongoConnected) {
    const res = await UserModel.findByIdAndUpdate(userId, { role: newRole });
    return Boolean(res);
  }

  const user = localStore.users.find((u) => u.id === userId);
  if (!user) return false;
  user.role = newRole;
  saveLocalStore();
  return true;
}

// ---------------- ROOM OPERATIONS ----------------

export async function getAllRooms(filters?: {
  search?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  amenity?: string;
  onlyAvailable?: boolean;
}): Promise<IRoom[]> {
  let rooms: IRoom[] = [];

  if (isMongoConnected) {
    const query: any = {};
    if (filters?.type && filters.type !== 'all') {
      query.type = filters.type;
    }
    if (filters?.onlyAvailable) {
      query.isAvailable = true;
    }
    const docs = await RoomModel.find(query).sort({ isFeatured: -1, pricePerNight: 1 }).lean();
    rooms = docs.map((d: any) => ({
      id: d._id.toString(),
      roomNumber: d.roomNumber,
      title: d.title,
      type: d.type,
      pricePerNight: d.pricePerNight,
      capacity: d.capacity,
      sizeSqFt: d.sizeSqFt,
      view: d.view,
      floor: d.floor,
      description: d.description,
      amenities: d.amenities || [],
      images: d.images || [],
      rating: d.rating,
      reviewsCount: d.reviewsCount,
      isFeatured: d.isFeatured,
      isAvailable: d.isAvailable,
      createdAt: d.createdAt?.toISOString() || new Date().toISOString(),
    }));
  } else {
    rooms = [...localStore.rooms];
  }

  // Apply filters
  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      rooms = rooms.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.roomNumber.toLowerCase().includes(q) ||
          r.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (filters.type && filters.type !== 'all') {
      rooms = rooms.filter((r) => r.type.toLowerCase() === filters.type!.toLowerCase());
    }
    if (filters.minPrice !== undefined) {
      rooms = rooms.filter((r) => r.pricePerNight >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      rooms = rooms.filter((r) => r.pricePerNight <= filters.maxPrice!);
    }
    if (filters.guests !== undefined) {
      rooms = rooms.filter((r) => r.capacity.guests >= filters.guests!);
    }
    if (filters.amenity) {
      const amen = filters.amenity.toLowerCase();
      rooms = rooms.filter((r) => r.amenities.some((a) => a.toLowerCase().includes(amen)));
    }
    if (filters.onlyAvailable) {
      rooms = rooms.filter((r) => r.isAvailable);
    }
  }

  return rooms;
}

export async function getRoomById(id: string): Promise<IRoom | null> {
  if (isMongoConnected) {
    const d = await RoomModel.findById(id).lean();
    if (d) {
      return {
        id: (d as any)._id.toString(),
        roomNumber: d.roomNumber,
        title: d.title,
        type: d.type,
        pricePerNight: d.pricePerNight,
        capacity: d.capacity,
        sizeSqFt: d.sizeSqFt,
        view: d.view,
        floor: d.floor,
        description: d.description,
        amenities: d.amenities || [],
        images: d.images || [],
        rating: d.rating,
        reviewsCount: d.reviewsCount,
        isFeatured: d.isFeatured,
        isAvailable: d.isAvailable,
        createdAt: d.createdAt?.toISOString() || new Date().toISOString(),
      };
    }
    return null;
  }

  return localStore.rooms.find((r) => r.id === id) || null;
}

export async function createRoom(roomData: Omit<IRoom, 'id' | 'createdAt'>): Promise<IRoom> {
  if (isMongoConnected) {
    const doc = await RoomModel.create(roomData);
    return {
      id: doc._id.toString(),
      roomNumber: doc.roomNumber,
      title: doc.title,
      type: doc.type,
      pricePerNight: doc.pricePerNight,
      capacity: doc.capacity,
      sizeSqFt: doc.sizeSqFt,
      view: doc.view,
      floor: doc.floor,
      description: doc.description,
      amenities: doc.amenities,
      images: doc.images,
      rating: doc.rating,
      reviewsCount: doc.reviewsCount,
      isFeatured: doc.isFeatured,
      isAvailable: doc.isAvailable,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  const newRoom: IRoom = {
    ...roomData,
    id: `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  localStore.rooms.unshift(newRoom);
  saveLocalStore();
  return newRoom;
}

export async function updateRoom(id: string, updateData: Partial<IRoom>): Promise<IRoom | null> {
  if (isMongoConnected) {
    const doc = await RoomModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!doc) return null;
    return {
      id: (doc as any)._id.toString(),
      roomNumber: doc.roomNumber,
      title: doc.title,
      type: doc.type,
      pricePerNight: doc.pricePerNight,
      capacity: doc.capacity,
      sizeSqFt: doc.sizeSqFt,
      view: doc.view,
      floor: doc.floor,
      description: doc.description,
      amenities: doc.amenities,
      images: doc.images,
      rating: doc.rating,
      reviewsCount: doc.reviewsCount,
      isFeatured: doc.isFeatured,
      isAvailable: doc.isAvailable,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
    };
  }

  const idx = localStore.rooms.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  localStore.rooms[idx] = {
    ...localStore.rooms[idx],
    ...updateData,
  };
  saveLocalStore();
  return localStore.rooms[idx];
}

export async function deleteRoom(id: string): Promise<boolean> {
  if (isMongoConnected) {
    const res = await RoomModel.findByIdAndDelete(id);
    return Boolean(res);
  }

  const idx = localStore.rooms.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  localStore.rooms.splice(idx, 1);
  saveLocalStore();
  return true;
}

export async function toggleRoomAvailability(id: string): Promise<IRoom | null> {
  const room = await getRoomById(id);
  if (!room) return null;
  return updateRoom(id, { isAvailable: !room.isAvailable });
}

// ---------------- BOOKING OPERATIONS ----------------

/**
 * Check if a room is booked for overlapping dates
 */
export async function checkRoomDateConflict(
  roomId: string,
  checkIn: string,
  checkOut: string,
  excludeBookingId?: string
): Promise<boolean> {
  const allBookings = await getAllBookings();
  const targetIn = new Date(checkIn).getTime();
  const targetOut = new Date(checkOut).getTime();

  const conflicting = allBookings.filter((b) => {
    if (b.roomId !== roomId) return false;
    if (b.status === 'Cancelled') return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;

    const bIn = new Date(b.checkInDate).getTime();
    const bOut = new Date(b.checkOutDate).getTime();

    // Overlap condition: (StartA < EndB) and (EndA > StartB)
    return targetIn < bOut && targetOut > bIn;
  });

  return conflicting.length > 0;
}

export async function createBooking(bookingData: Omit<IBooking, 'id' | 'bookingReference' | 'createdAt'>): Promise<IBooking> {
  const reference = `HP-${Math.floor(100000 + Math.random() * 900000)}`;

  if (isMongoConnected) {
    const doc = await BookingModel.create({
      ...bookingData,
      bookingReference: reference,
    });
    return {
      id: doc._id.toString(),
      bookingReference: doc.bookingReference,
      userId: doc.userId,
      roomId: doc.roomId,
      roomDetails: doc.roomDetails,
      guestDetails: doc.guestDetails,
      checkInDate: doc.checkInDate,
      checkOutDate: doc.checkOutDate,
      nights: doc.nights,
      guestsCount: doc.guestsCount,
      pricing: doc.pricing,
      paymentMethod: doc.paymentMethod as any,
      paymentStatus: doc.paymentStatus as any,
      status: doc.status as any,
      createdAt: doc.createdAt.toISOString(),
    };
  }

  const newBooking: IBooking = {
    ...bookingData,
    id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    bookingReference: reference,
    createdAt: new Date().toISOString(),
  };

  localStore.bookings.unshift(newBooking);
  saveLocalStore();
  return newBooking;
}

export async function getAllBookings(): Promise<IBooking[]> {
  if (isMongoConnected) {
    const docs = await BookingModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d: any) => ({
      id: d._id.toString(),
      bookingReference: d.bookingReference,
      userId: d.userId,
      roomId: d.roomId,
      roomDetails: d.roomDetails,
      guestDetails: d.guestDetails,
      checkInDate: d.checkInDate,
      checkOutDate: d.checkOutDate,
      nights: d.nights,
      guestsCount: d.guestsCount,
      pricing: d.pricing,
      paymentMethod: d.paymentMethod,
      paymentStatus: d.paymentStatus,
      status: d.status,
      createdAt: d.createdAt?.toISOString() || new Date().toISOString(),
    }));
  }

  return [...localStore.bookings];
}

export async function getBookingsByUser(userId: string): Promise<IBooking[]> {
  const all = await getAllBookings();
  return all.filter((b) => b.userId === userId);
}

export async function getBookingById(id: string): Promise<IBooking | null> {
  const all = await getAllBookings();
  return all.find((b) => b.id === id || b.bookingReference === id) || null;
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: 'Confirmed' | 'Cancelled' | 'Completed'
): Promise<IBooking | null> {
  if (isMongoConnected) {
    const doc = await BookingModel.findByIdAndUpdate(bookingId, { status: newStatus }, { new: true }).lean();
    if (!doc) return null;
    return {
      id: (doc as any)._id.toString(),
      bookingReference: doc.bookingReference,
      userId: doc.userId,
      roomId: doc.roomId,
      roomDetails: doc.roomDetails,
      guestDetails: doc.guestDetails,
      checkInDate: doc.checkInDate,
      checkOutDate: doc.checkOutDate,
      nights: doc.nights,
      guestsCount: doc.guestsCount,
      pricing: doc.pricing,
      paymentMethod: doc.paymentMethod as any,
      paymentStatus: doc.paymentStatus as any,
      status: doc.status as any,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
    };
  }

  const booking = localStore.bookings.find((b) => b.id === bookingId || b.bookingReference === bookingId);
  if (!booking) return null;
  booking.status = newStatus;
  saveLocalStore();
  return booking;
}

export async function cancelBooking(bookingId: string, userId?: string, isAdmin?: boolean): Promise<{ success: boolean; message: string; booking?: IBooking }> {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return { success: false, message: 'Reservation not found' };
  }

  if (!isAdmin && userId && booking.userId !== userId) {
    return { success: false, message: 'Unauthorized to cancel this reservation' };
  }

  if (booking.status === 'Cancelled') {
    return { success: false, message: 'Reservation is already cancelled' };
  }

  const updated = await updateBookingStatus(booking.id, 'Cancelled');
  return { success: true, message: 'Reservation successfully cancelled', booking: updated || undefined };
}

// ---------------- ADMIN STATS & RESET ----------------

export async function getAdminStats() {
  const bookings = await getAllBookings();
  const rooms = await getAllRooms();
  const users = await getAllUsers();

  const totalRevenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);

  const activeBookingsCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const availableRoomsCount = rooms.filter((r) => r.isAvailable).length;
  const occupancyRate = rooms.length > 0 ? Math.round(((rooms.length - availableRoomsCount) / rooms.length) * 100) : 0;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalBookings: bookings.length,
    activeBookingsCount,
    totalRooms: rooms.length,
    availableRoomsCount,
    totalUsers: users.length,
    occupancyRate,
    recentBookings: bookings.slice(0, 5),
  };
}

export async function resetDemoData() {
  if (fs.existsSync(DB_FILE)) {
    try {
      fs.unlinkSync(DB_FILE);
    } catch {}
  }
  await initLocalStore();
  return { success: true, message: 'Sample demo data successfully re-seeded' };
}
