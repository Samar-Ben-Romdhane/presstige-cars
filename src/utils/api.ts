import { Booking, Vehicle, Driver, User, Review, CompanySettings, PromoCode, DashboardStats } from '../types';

const API_BASE = '/api';

function getHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('prestige_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Authentication
  auth: {
    async register(data: any): Promise<{ token: string; user: User }> {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await handleResponse(res);
      localStorage.setItem('prestige_token', result.token);
      localStorage.setItem('prestige_user', JSON.stringify(result.user));
      return result;
    },

    async login(data: any): Promise<{ token: string; user: User }> {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await handleResponse(res);
      localStorage.setItem('prestige_token', result.token);
      localStorage.setItem('prestige_user', JSON.stringify(result.user));
      return result;
    },

    logout() {
      localStorage.removeItem('prestige_token');
      localStorage.removeItem('prestige_user');
    },

    async getProfile(): Promise<User> {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async updateProfile(data: Partial<User>): Promise<User> {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const result = await handleResponse(res);
      localStorage.setItem('prestige_user', JSON.stringify(result));
      return result;
    },

    getCurrentUser(): User | null {
      const userStr = localStorage.getItem('prestige_user');
      if (!userStr) return null;
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  },

  // Vehicles
  vehicles: {
    async list(): Promise<Vehicle[]> {
      const res = await fetch(`${API_BASE}/vehicles`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async create(data: Partial<Vehicle>): Promise<Vehicle> {
      const res = await fetch(`${API_BASE}/vehicles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
      const res = await fetch(`${API_BASE}/vehicles/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async delete(id: string): Promise<{ message: string }> {
      const res = await fetch(`${API_BASE}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Drivers
  drivers: {
    async list(): Promise<Driver[]> {
      const res = await fetch(`${API_BASE}/drivers`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async create(data: Partial<Driver>): Promise<Driver> {
      const res = await fetch(`${API_BASE}/drivers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async update(id: string, data: Partial<Driver>): Promise<Driver> {
      const res = await fetch(`${API_BASE}/drivers/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async delete(id: string): Promise<{ message: string }> {
      const res = await fetch(`${API_BASE}/drivers/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Bookings
  bookings: {
    async list(): Promise<Booking[]> {
      const res = await fetch(`${API_BASE}/bookings`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async get(id: string): Promise<Booking> {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async create(data: Partial<Booking>): Promise<Booking> {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async update(id: string, data: Partial<Booking>): Promise<Booking> {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async cancel(id: string): Promise<Booking> {
      const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async submitReview(id: string, rating: number, comment: string): Promise<Booking> {
      const res = await fetch(`${API_BASE}/bookings/${id}/review`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ rating, comment }),
      });
      return handleResponse(res);
    },

    async checkAvailability(date: string, time: string, vehicleCategory?: string): Promise<{
      available: boolean;
      availableCount: number;
      isPeakPeriod: boolean;
      multiplier: number;
      message: string;
    }> {
      const res = await fetch(`${API_BASE}/bookings/check-availability`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ date, time, vehicleCategory }),
      });
      return handleResponse(res);
    }
  },

  // Promo Codes
  promos: {
    async validate(code: string): Promise<PromoCode> {
      const res = await fetch(`${API_BASE}/promos/validate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ code }),
      });
      return handleResponse(res);
    }
  },

  // Payments
  payments: {
    async createIntent(bookingId: string, amount: number): Promise<{ clientSecret: string }> {
      const res = await fetch(`${API_BASE}/payments/create-intent`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ bookingId, amount }),
      });
      return handleResponse(res);
    },

    async confirmPayment(bookingId: string, paymentMethod: string): Promise<{ success: boolean; booking: Booking }> {
      const res = await fetch(`${API_BASE}/payments/confirm`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ bookingId, paymentMethod }),
      });
      return handleResponse(res);
    }
  },

  // Admin settings & metrics
  admin: {
    async getStats(): Promise<DashboardStats> {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async getSettings(): Promise<CompanySettings> {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async updateSettings(data: Partial<CompanySettings>): Promise<CompanySettings> {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    }
  }
};
