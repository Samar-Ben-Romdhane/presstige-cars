import { Router, Response } from 'express';
import { readDb, writeDb } from './db';
import { hashPassword, generateToken, requireAuth, requireAdmin, AuthenticatedRequest } from './auth';
import { Booking, Vehicle, Driver, Review, User, PromoCode } from '../src/types';

const router = Router();

// -------------------------------------------------------------------------
// AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------------------

// Register
router.post('/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires (nom, email, mot de passe).' });
  }

  const db = readDb();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return res.status(400).json({ error: 'Cette adresse email est déjà enregistrée.' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    role: email.toLowerCase() === 'samar8brm@gmail.com' ? 'admin' : 'user', // Samar is pre-configured admin
    favoriteLocations: [],
    savedPaymentMethods: [],
    createdAt: new Date().toISOString()
  };

  // We save the password inside our simulated user table for simple auth (hashed!)
  // In a real app we'd use a separate credentials table, but since this is file-based and secure server-side:
  const userToSave = {
    ...newUser,
    passwordHash: hashPassword(password)
  };

  db.users.push(userToSave as any);
  writeDb(db);

  const token = generateToken(newUser);
  res.status(201).json({ token, user: newUser });
});

// Login
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez entrer votre email et votre mot de passe.' });
  }

  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) as any;

  if (!user) {
    return res.status(401).json({ error: 'Identifiants incorrects.' });
  }

  const computedHash = hashPassword(password);
  // Default accounts check
  const isDefaultAdmin = email.toLowerCase() === 'samar8brm@gmail.com' && password === 'admin';
  const isDefaultUser = email.toLowerCase() === 'client@prestige.com' && password === 'client';
  const isPasswordCorrect = user.passwordHash ? user.passwordHash === computedHash : (isDefaultAdmin || isDefaultUser);

  if (!isPasswordCorrect) {
    return res.status(401).json({ error: 'Mot de passe incorrect.' });
  }

  // Strip password hash before sending
  const sanitizedUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    favoriteLocations: user.favoriteLocations || [],
    savedPaymentMethods: user.savedPaymentMethods || [],
    createdAt: user.createdAt
  };

  const token = generateToken(sanitizedUser);
  res.json({ token, user: sanitizedUser });
});

// Profile - Get
router.get('/auth/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === req.user?.email.toLowerCase());
  
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé.' });
  }
  
  res.json(user);
});

// Profile - Update
router.put('/auth/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const { name, phone, favoriteLocations } = req.body;
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === req.user?.email.toLowerCase());
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Utilisateur non trouvé.' });
  }

  const currentUser = db.users[userIndex];
  db.users[userIndex] = {
    ...currentUser,
    name: name || currentUser.name,
    phone: phone !== undefined ? phone : currentUser.phone,
    favoriteLocations: favoriteLocations || currentUser.favoriteLocations || []
  };

  writeDb(db);
  res.json(db.users[userIndex]);
});


// -------------------------------------------------------------------------
// VEHICLES ENDPOINTS
// -------------------------------------------------------------------------

// List Vehicles
router.get('/vehicles', (req, res) => {
  const db = readDb();
  res.json(db.vehicles);
});

// Create Vehicle (Admin)
router.post('/vehicles', requireAdmin, (req, res) => {
  const vehicle: Vehicle = req.body;
  if (!vehicle.name || !vehicle.category || !vehicle.baseRate) {
    return res.status(400).json({ error: 'Veuillez remplir les informations obligatoires du véhicule.' });
  }

  const db = readDb();
  const newVehicle: Vehicle = {
    ...vehicle,
    id: `vehicle-${Date.now()}`,
    available: vehicle.available !== undefined ? vehicle.available : true,
    maintenanceStatus: vehicle.maintenanceStatus || 'Good'
  };

  db.vehicles.push(newVehicle);
  writeDb(db);
  res.status(201).json(newVehicle);
});

// Update Vehicle (Admin)
router.put('/vehicles/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = db.vehicles.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Véhicule non trouvé.' });

  db.vehicles[index] = { ...db.vehicles[index], ...req.body };
  writeDb(db);
  res.json(db.vehicles[index]);
});

// Delete Vehicle (Admin)
router.delete('/vehicles/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const filtered = db.vehicles.filter(v => v.id !== req.params.id);
  if (filtered.length === db.vehicles.length) {
    return res.status(404).json({ error: 'Véhicule non trouvé.' });
  }
  db.vehicles = filtered;
  writeDb(db);
  res.json({ message: 'Véhicule supprimé avec succès.' });
});


// -------------------------------------------------------------------------
// DRIVERS ENDPOINTS
// -------------------------------------------------------------------------

// List Drivers (Admin Only or authenticated user if needed, let's allow read for auth)
router.get('/drivers', requireAuth, (req, res) => {
  const db = readDb();
  res.json(db.drivers);
});

// Create Driver (Admin)
router.post('/drivers', requireAdmin, (req, res) => {
  const driver: Driver = req.body;
  if (!driver.name || !driver.phone || !driver.email) {
    return res.status(400).json({ error: 'Informations de contact du chauffeur requises.' });
  }

  const db = readDb();
  const newDriver: Driver = {
    ...driver,
    id: `driver-${Date.now()}`,
    rating: 5.0,
    tripsCount: 0,
    available: driver.available !== undefined ? driver.available : true,
    status: driver.status || 'Active'
  };

  db.drivers.push(newDriver);
  writeDb(db);
  res.status(201).json(newDriver);
});

// Update Driver (Admin)
router.put('/drivers/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = db.drivers.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Chauffeur non trouvé.' });

  db.drivers[index] = { ...db.drivers[index], ...req.body };
  writeDb(db);
  res.json(db.drivers[index]);
});

// Delete Driver (Admin)
router.delete('/drivers/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const filtered = db.drivers.filter(d => d.id !== req.params.id);
  if (filtered.length === db.drivers.length) {
    return res.status(404).json({ error: 'Chauffeur non trouvé.' });
  }
  db.drivers = filtered;
  writeDb(db);
  res.json({ message: 'Chauffeur supprimé avec succès.' });
});


// -------------------------------------------------------------------------
// PROMO CODES ENDPOINTS
// -------------------------------------------------------------------------

router.get('/promos', (req, res) => {
  const db = readDb();
  res.json(db.promoCodes.filter(p => p.active));
});

router.post('/promos/validate', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code manquant.' });

  const db = readDb();
  const promo = db.promoCodes.find(p => p.code.toUpperCase() === code.trim().toUpperCase());

  if (!promo || !promo.active) {
    return res.status(404).json({ error: 'Code promo invalide ou expiré.' });
  }

  res.json(promo);
});


// -------------------------------------------------------------------------
// BOOKINGS & RESERVATION ENDPOINTS
// -------------------------------------------------------------------------

// Check real-time availability
router.post('/bookings/check-availability', (req, res) => {
  const { date, time, vehicleCategory } = req.body;
  if (!date || !time) {
    return res.status(400).json({ error: 'Veuillez renseigner la date et l\'heure.' });
  }

  const db = readDb();
  // Check vehicle counts vs active bookings at that time (simulate simple rule)
  const formattedDateTime = `${date}T${time}`;
  const bookingsAtTime = db.bookings.filter(b => 
    b.pickupDate === date && 
    b.status !== 'Cancelled' &&
    (vehicleCategory ? b.vehicleCategory === vehicleCategory : true)
  );

  // High end simulation: if booking count for category on date is > 5, say peak period
  const totalVehiclesInCategory = db.vehicles.filter(v => 
    v.available && (vehicleCategory ? v.category === vehicleCategory : true)
  ).length;

  const availableCount = Math.max(0, totalVehiclesInCategory - bookingsAtTime.length);
  const isPeakPeriod = ['08:00', '09:00', '17:00', '18:00', '19:00'].some(h => time.startsWith(h)) || 
                       new Date(date).getDay() === 0 || new Date(date).getDay() === 6; // Sunday or Saturday

  res.json({
    available: availableCount > 0 || totalVehiclesInCategory === 0, // Fallback if no vehicles created yet
    availableCount,
    isPeakPeriod,
    multiplier: isPeakPeriod ? 1.25 : 1.0,
    message: isPeakPeriod ? 'Période de forte affluence (Tarif majoré +25%)' : 'Tarif standard disponible'
  });
});

// List User's Bookings
router.get('/bookings', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const userEmail = req.user?.email.toLowerCase();
  
  if (req.user?.role === 'admin') {
    // Admins see all bookings
    return res.json(db.bookings);
  }

  // Customers see only their own
  const userBookings = db.bookings.filter(b => b.userEmail.toLowerCase() === userEmail);
  res.json(userBookings);
});

// Get Booking Detail
router.get('/bookings/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const booking = db.bookings.find(b => b.id === req.params.id);
  
  if (!booking) {
    return res.status(404).json({ error: 'Réservation introuvable.' });
  }

  if (req.user?.role !== 'admin' && booking.userEmail.toLowerCase() !== req.user?.email.toLowerCase()) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  res.json(booking);
});

// Create Booking (Can be called by guest or logged-in user)
router.post('/bookings', (req, res) => {
  const bookingData: Partial<Booking> = req.body;
  
  if (!bookingData.pickupLocation || !bookingData.dropoffLocation || !bookingData.pickupDate || !bookingData.pickupTime || !bookingData.vehicleId) {
    return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires à la réservation.' });
  }

  const db = readDb();
  const vehicle = db.vehicles.find(v => v.id === bookingData.vehicleId);
  if (!vehicle) return res.status(404).json({ error: 'Véhicule sélectionné introuvable.' });

  // Generate Reference
  const refNum = Math.floor(100000 + Math.random() * 900000);
  const bookingReference = `PR-${refNum}`;

  // Find an available driver automatically
  const availableDriver = db.drivers.find(d => d.available && d.status === 'Active');

  const newBooking: Booking = {
    id: `booking-${Date.now()}`,
    bookingReference,
    userEmail: (bookingData.userEmail || bookingData.passengerEmail || 'guest@prestige.com').toLowerCase(),
    userName: bookingData.userName || bookingData.passengerName || 'Client Prestige',
    userPhone: bookingData.userPhone || bookingData.passengerPhone || '',
    pickupLocation: bookingData.pickupLocation,
    dropoffLocation: bookingData.dropoffLocation,
    pickupDate: bookingData.pickupDate,
    pickupTime: bookingData.pickupTime,
    tripType: bookingData.tripType || 'one-way',
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    vehicleCategory: vehicle.category,
    addons: bookingData.addons || [],
    driverId: availableDriver?.id,
    driverName: availableDriver?.name,
    passengerName: bookingData.passengerName || 'Passager',
    passengerPhone: bookingData.passengerPhone || '',
    passengerEmail: (bookingData.passengerEmail || '').toLowerCase(),
    specialRequests: bookingData.specialRequests || '',
    luggageCount: bookingData.luggageCount || 0,
    basePrice: bookingData.basePrice || 100,
    taxes: bookingData.taxes || 20,
    fees: bookingData.fees || 10,
    discountCode: bookingData.discountCode,
    discountAmount: bookingData.discountAmount || 0,
    totalPrice: bookingData.totalPrice || 130,
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: bookingData.paymentMethod || 'Stripe',
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  writeDb(db);

  // Simulate Confirmation email log (would use nodemailer, we log for visualization)
  console.log(`[EMAIL SEND] Booking confirmation sent to ${newBooking.passengerEmail}`);

  res.status(201).json(newBooking);
});

// Update Booking Status / Assign Driver (Admin)
router.put('/bookings/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Réservation non trouvée.' });

  const booking = db.bookings[index];

  // Only admin or the booking owner can update (though owner is limited to Cancel)
  if (req.user?.role !== 'admin' && booking.userEmail.toLowerCase() !== req.user?.email.toLowerCase()) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  // If customer, they can only request Cancellation
  if (req.user?.role !== 'admin') {
    if (req.body.status !== 'Cancelled') {
      return res.status(403).json({ error: 'Seul l\'administrateur peut modifier ces informations de course.' });
    }
  }

  // Update fields
  const updatedBooking = {
    ...booking,
    ...req.body
  };

  // Resolve driver names if driver ID changes
  if (req.body.driverId && req.body.driverId !== booking.driverId) {
    const driver = db.drivers.find(d => d.id === req.body.driverId);
    if (driver) {
      updatedBooking.driverId = driver.id;
      updatedBooking.driverName = driver.name;
    }
  }

  db.bookings[index] = updatedBooking;
  writeDb(db);

  res.json(updatedBooking);
});

// Cancel Booking
router.post('/bookings/:id/cancel', requireAuth, (req: AuthenticatedRequest, res) => {
  const db = readDb();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Réservation non trouvée.' });

  const booking = db.bookings[index];
  if (req.user?.role !== 'admin' && booking.userEmail.toLowerCase() !== req.user?.email.toLowerCase()) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  booking.status = 'Cancelled';
  writeDb(db);
  res.json(booking);
});

// Submit Review
router.post('/bookings/:id/review', requireAuth, (req: AuthenticatedRequest, res) => {
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ error: 'Une note est requise.' });

  const db = readDb();
  const bookingIndex = db.bookings.findIndex(b => b.id === req.params.id);
  if (bookingIndex === -1) return res.status(404).json({ error: 'Réservation non trouvée.' });

  const booking = db.bookings[bookingIndex];
  if (booking.userEmail.toLowerCase() !== req.user?.email.toLowerCase()) {
    return res.status(403).json({ error: 'Vous ne pouvez évaluer que vos propres trajets.' });
  }

  // Update booking
  booking.review = {
    rating: Number(rating),
    comment: comment || '',
    createdAt: new Date().toISOString()
  };

  // Add to global reviews list
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    bookingId: booking.id,
    userName: req.user?.name || 'Client',
    userEmail: req.user?.email || '',
    rating: Number(rating),
    comment: comment || '',
    vehicleCategory: booking.vehicleCategory,
    date: new Date().toISOString().split('T')[0]
  };

  db.reviews.unshift(newReview);

  // Recalculate driver & vehicle ratings if applicable
  if (booking.driverId) {
    const driver = db.drivers.find(d => d.id === booking.driverId);
    if (driver) {
      driver.tripsCount += 1;
      driver.rating = Number(((driver.rating * (driver.tripsCount - 1) + Number(rating)) / driver.tripsCount).toFixed(2));
    }
  }

  writeDb(db);
  res.status(201).json(booking);
});


// -------------------------------------------------------------------------
// STRIPE / PAYMENTS ENDPOINTS
// -------------------------------------------------------------------------

router.post('/payments/create-intent', (req, res) => {
  const { bookingId, amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'Montant requis.' });

  // Simulate Stripe payment intent creation
  res.json({
    clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
    amount,
    currency: 'tnd',
    status: 'requires_payment_method'
  });
});

router.post('/payments/confirm', (req, res) => {
  const { bookingId, paymentMethod } = req.body;
  if (!bookingId) return res.status(400).json({ error: 'Référence de réservation manquante.' });

  const db = readDb();
  const index = db.bookings.findIndex(b => b.id === bookingId);
  if (index === -1) return res.status(404).json({ error: 'Réservation introuvable.' });

  const booking = db.bookings[index];
  booking.paymentStatus = 'Paid';
  booking.status = 'Confirmed';
  
  writeDb(db);
  res.json({ success: true, booking });
});


// -------------------------------------------------------------------------
// ADMIN ANALYTICS & SETTINGS ENDPOINTS
// -------------------------------------------------------------------------

router.get('/admin/dashboard', requireAdmin, (req, res) => {
  const db = readDb();
  
  const totalBookings = db.bookings.length;
  const completedAndPaidBookings = db.bookings.filter(b => b.paymentStatus === 'Paid' && b.status !== 'Cancelled');
  const totalRevenue = completedAndPaidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  
  const reviews = db.reviews;
  const averageRating = reviews.length > 0 
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2))
    : 5.0;

  const activeVehicles = db.vehicles.filter(v => v.available).length;
  const activeDrivers = db.drivers.filter(d => d.available).length;

  // Revenue by month (simulated)
  const revenueByMonth = [
    { month: 'Jan', revenue: totalRevenue * 0.1 },
    { month: 'Feb', revenue: totalRevenue * 0.12 },
    { month: 'Mar', revenue: totalRevenue * 0.15 },
    { month: 'Apr', revenue: totalRevenue * 0.18 },
    { month: 'May', revenue: totalRevenue * 0.2 },
    { month: 'Jun', revenue: totalRevenue * 0.25 },
  ].map(item => ({ ...item, revenue: Math.round(item.revenue) }));

  // Bookings trend
  const bookingsTrend = db.bookings.map(b => ({
    date: b.pickupDate,
    bookings: 1
  })).reduce((acc: any[], current) => {
    const existing = acc.find(item => item.date === current.date);
    if (existing) {
      existing.bookings += 1;
    } else {
      acc.push({ date: current.date, bookings: 1 });
    }
    return acc;
  }, []).sort((a, b) => a.date.localeCompare(b.date)).slice(-7);

  // Vehicle utilization (simulated)
  const vehicleUtilization = db.vehicles.map(v => {
    const bookingsCount = db.bookings.filter(b => b.vehicleId === v.id).length;
    return {
      name: v.name,
      utilization: Math.min(100, Math.round((bookingsCount / (totalBookings || 1)) * 100))
    };
  });

  res.json({
    totalBookings,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageRating,
    activeVehicles,
    activeDrivers,
    revenueByMonth,
    bookingsTrend,
    vehicleUtilization
  });
});

router.get('/admin/settings', requireAdmin, (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

router.put('/admin/settings', requireAdmin, (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json(db.settings);
});

export default router;
