import { IUser, IRoom, IBooking, DbStatusInfo, AdminStats } from '../types';

const TOKEN_KEY = 'hotelpro_auth_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async register(body: { name: string; email: string; password: string; phone?: string }) {
    return request<{ success: boolean; token: string; user: IUser; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async login(body: { email: string; password: string }) {
    return request<{ success: boolean; token: string; user: IUser; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async demoLogin(role: 'admin' | 'user') {
    return request<{ success: boolean; token: string; user: IUser; message: string }>('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  async getMe() {
    return request<{ success: boolean; user: IUser }>('/api/auth/me');
  },

  // Rooms
  async getRooms(params?: {
    search?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    amenity?: string;
    checkIn?: string;
    checkOut?: string;
    sort?: string;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    const qStr = query.toString();
    return request<{ success: boolean; count: number; rooms: IRoom[] }>(`/api/rooms${qStr ? `?${qStr}` : ''}`);
  },

  async getRoomById(id: string, dates?: { checkIn?: string; checkOut?: string }) {
    const query = new URLSearchParams();
    if (dates?.checkIn) query.set('checkIn', dates.checkIn);
    if (dates?.checkOut) query.set('checkOut', dates.checkOut);
    const qStr = query.toString();
    return request<{ success: boolean; room: IRoom }>(`/api/rooms/${id}${qStr ? `?${qStr}` : ''}`);
  },

  async createRoom(roomData: Partial<IRoom>) {
    return request<{ success: boolean; room: IRoom; message: string }>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  async updateRoom(id: string, roomData: Partial<IRoom>) {
    return request<{ success: boolean; room: IRoom; message: string }>(`/api/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  },

  async deleteRoom(id: string) {
    return request<{ success: boolean; message: string }>(`/api/rooms/${id}`, {
      method: 'DELETE',
    });
  },

  async toggleRoomAvailability(id: string) {
    return request<{ success: boolean; room: IRoom; message: string }>(`/api/rooms/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Bookings
  async createBooking(bookingData: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    guestDetails: {
      fullName: string;
      email: string;
      phone: string;
      specialRequests?: string;
    };
    guestsCount: { adults: number; children: number };
    paymentMethod: 'Credit Card' | 'Pay at Hotel';
  }) {
    return request<{ success: boolean; booking: IBooking; message: string }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async getMyBookings() {
    return request<{ success: boolean; count: number; bookings: IBooking[] }>('/api/bookings/my');
  },

  async getBookingById(id: string) {
    return request<{ success: boolean; booking: IBooking }>(`/api/bookings/${id}`);
  },

  async cancelBooking(id: string) {
    return request<{ success: boolean; message: string; booking: IBooking }>(`/api/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  // Admin
  async getAdminStats() {
    return request<{ success: boolean; stats: AdminStats; dbStatus: DbStatusInfo }>('/api/admin/stats');
  },

  async getAdminBookings(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const qStr = query.toString();
    return request<{ success: boolean; count: number; bookings: IBooking[] }>(`/api/bookings/admin/all${qStr ? `?${qStr}` : ''}`);
  },

  async updateBookingStatus(id: string, status: 'Confirmed' | 'Cancelled' | 'Completed') {
    return request<{ success: boolean; message: string; booking: IBooking }>(`/api/bookings/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async getAdminUsers() {
    return request<{ success: boolean; count: number; users: IUser[] }>('/api/admin/users');
  },

  async updateUserRole(id: string, role: 'user' | 'admin') {
    return request<{ success: boolean; message: string }>(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  async resetDemoData() {
    return request<{ success: boolean; message: string }>('/api/admin/seed-reset', {
      method: 'POST',
    });
  },

  // System
  async getSystemStatus() {
    return request<{ success: boolean; status: DbStatusInfo; timestamp: string }>('/api/system/status');
  },
};
