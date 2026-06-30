export interface Vehicle {
  id: string;
  name: string;
  category: 'Sedan' | 'SUV' | 'Van';
  passengerCapacity: number;
  luggageCapacity: number;
  baseRate: number; // base flat rate in Euros
  ratePerKm: number; // rate per kilometer in Euros
  hourlyRate: number; // rate per hour in Euros
  image: string;
  specifications: string[];
  available: boolean;
  maintenanceStatus?: 'Good' | 'Maintenance' | 'Inspection';
  nextMaintenanceDate?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  tripsCount: number;
  languages: string[];
  photo: string;
  available: boolean;
  status?: 'Active' | 'On Trip' | 'On Leave';
  licenseNumber?: string;
  insuranceExpiry?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  favoriteLocations?: string[];
  savedPaymentMethods?: { id: string; brand: string; last4: string }[];
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  tripType: 'one-way' | 'round-trip';
  durationHours?: number; // for hourly rentals
  distanceKm?: number;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: 'Sedan' | 'SUV' | 'Van';
  addons: string[];
  driverId?: string;
  driverName?: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  specialRequests?: string;
  luggageCount: number;
  basePrice: number;
  taxes: number;
  fees: number;
  discountCode?: string;
  discountAmount?: number;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  paymentMethod: 'Stripe' | 'Local';
  createdAt: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export interface Review {
  id: string;
  bookingId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  vehicleCategory: 'Sedan' | 'SUV' | 'Van';
  date: string;
}

export interface PricingRule {
  id: string;
  name: string;
  baseRate: number;
  ratePerKm: number;
  peakHourMultiplier: number;
  active: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  active: boolean;
  description: string;
}

export interface CompanySettings {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  stripePublishableKey: string;
  supportHours: string;
  emailTemplates: {
    confirmation: string;
    assignment: string;
    reminder: string;
    completion: string;
  };
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  activeVehicles: number;
  activeDrivers: number;
  revenueByMonth: { month: string; revenue: number }[];
  bookingsTrend: { date: string; bookings: number }[];
  vehicleUtilization: { name: string; utilization: number }[];
}
