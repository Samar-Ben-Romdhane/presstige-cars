import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Briefcase, ChevronRight, ChevronLeft, CreditCard, Sparkles, CheckCircle, Gift, Download, Loader2, Star, ShieldCheck } from 'lucide-react';
import { api } from '../utils/api';
import { Vehicle, Booking } from '../types';

interface BookingWizardProps {
  onSuccess: (booking: Booking) => void;
  currentUser: any;
}

const ADDONS = [
  { id: 'champagne', name: 'Bouteille de Champagne Moët & Chandon', price: 350 },
  { id: 'meet_greet', name: 'Accueil pancarte nominative à l\'aéroport/gare', price: 40 },
  { id: 'wifi', name: 'Routeur WiFi 5G Privatif Haut Débit', price: 0 },
  { id: 'water', name: 'Sélection d\'Eaux de Luxe (Safia / Sabrine)', price: 0 },
  { id: 'child_seat', name: 'Siège auto bébé / rehausseur haut de gamme', price: 25 },
];

const POPULAR_LOCATIONS = [
  'Aéroport International de Tunis-Carthage (TUN)',
  'Aéroport International d\'Enfidha-Hammamet (NBE)',
  'Aéroport International de Monastir Habib-Bourguiba (MIR)',
  'Les Berges du Lac 1 & 2, Tunis',
  'La Marsa / Gammarth, Tunis',
  'Yasmine Hammamet, Hammamet',
  'Sousse / Port El Kantaoui',
  'Sidi Bou Saïd, Tunis',
];

export default function BookingWizard({ onSuccess, currentUser }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [isPeak, setIsPeak] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);

  // Form State
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [languagePref, setLanguagePref] = useState('Français (Bilingue)');
  
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [luggageCount, setLuggageCount] = useState(1);
  const [passengerCount, setPassengerCount] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'Local'>('Stripe');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');

  // Loaded booking response
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Load vehicles
    api.vehicles.list().then(setVehicles).catch(console.error);

    // Auto-fill user information if logged in
    if (currentUser) {
      setPassengerName(currentUser.name);
      setPassengerEmail(currentUser.email);
      setPassengerPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Handle live date/time check
  useEffect(() => {
    if (date && time) {
      api.bookings.checkAvailability(date, time, selectedVehicle?.category)
        .then(res => {
          setIsPeak(res.isPeakPeriod);
          setMultiplier(res.multiplier);
          setAvailabilityMsg(res.message);
        })
        .catch(console.error);
    }
  }, [date, time, selectedVehicle]);

  // Calculate dynamic price
  const calculatePrice = () => {
    if (!selectedVehicle) return { base: 0, tax: 0, fees: 0, discount: 0, total: 0 };
    
    // Simulate distance pricing (flat rate + per-km or simple base rate scaled)
    const mockDistance = Math.floor(15 + Math.random() * 25); // simulated km
    let base = selectedVehicle.baseRate + (mockDistance * selectedVehicle.ratePerKm);
    
    if (tripType === 'round-trip') {
      base = base * 1.8; // 10% discount on return
    }

    // Apply peak multiplier
    base = base * multiplier;

    // Addons cost
    const addonsCost = selectedAddons.reduce((sum, addonId) => {
      const ad = ADDONS.find(a => a.id === addonId);
      return sum + (ad ? ad.price : 0);
    }, 0);

    base = base + addonsCost;

    // Fees and Taxes
    const fees = 15.00; // Service fee
    const subtotal = base + fees;
    const tax = subtotal * 0.19; // 19% TVA en Tunisie

    // Discount
    const discount = subtotal * (discountPercent / 100);
    const total = subtotal + tax - discount;

    return {
      base: Math.round(base * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      fees,
      discount: Math.round(discount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  };

  const priceDetails = calculatePrice();

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoError('');
    try {
      const res = await api.promos.validate(promoCode);
      setDiscountPercent(res.discountPercent);
      setAppliedPromo(res.code);
    } catch (err: any) {
      setPromoError(err.message || 'Code promotionnel invalide');
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!pickup || !dropoff || !date || !time) {
        alert('Veuillez remplir tous les champs du trajet pour continuer.');
        return;
      }
    }
    if (step === 2) {
      if (!selectedVehicle) {
        alert('Veuillez sélectionner votre véhicule prestige.');
        return;
      }
    }
    if (step === 3) {
      if (!passengerName || !passengerEmail || !passengerPhone) {
        alert('Veuillez renseigner les coordonnées complètes du passager.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // Step 1: Create local booking first
      const payload = {
        userEmail: currentUser?.email || passengerEmail,
        userName: passengerName,
        userPhone: passengerPhone,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        pickupDate: date,
        pickupTime: time,
        tripType,
        vehicleId: selectedVehicle?.id,
        vehicleName: selectedVehicle?.name,
        vehicleCategory: selectedVehicle?.category,
        addons: selectedAddons.map(id => ADDONS.find(a => a.id === id)?.name || id),
        passengerName,
        passengerPhone,
        passengerEmail,
        specialRequests,
        luggageCount,
        basePrice: priceDetails.base,
        taxes: priceDetails.tax,
        fees: priceDetails.fees,
        discountCode: appliedPromo,
        discountAmount: priceDetails.discount,
        totalPrice: priceDetails.total,
        paymentMethod,
      };

      const bookingResult = await api.bookings.create(payload);

      // Step 2: Simulate Payment if Stripe selected
      if (paymentMethod === 'Stripe') {
        const intentResult = await api.payments.createIntent(bookingResult.id, priceDetails.total);
        // Simulate credit card processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        const confirmResult = await api.payments.confirmPayment(bookingResult.id, 'Stripe Card');
        setConfirmedBooking(confirmResult.booking);
      } else {
        // Cash or invoicing
        const confirmResult = await api.bookings.update(bookingResult.id, { paymentStatus: 'Pending', status: 'Confirmed' });
        setConfirmedBooking(confirmResult);
      }

      setStep(5);
      onSuccess(bookingResult);
    } catch (err: any) {
      alert(err.message || 'Une erreur est survenue pendant le paiement.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const stepsHeader = [
    { num: 1, label: 'Détails du Trajet' },
    { num: 2, label: 'Véhicule & Options' },
    { num: 3, label: 'Coordonnées' },
    { num: 4, label: 'Paiement' },
    { num: 5, label: 'Confirmation' },
  ];

  return (
    <div id="booking-wizard-component" className="w-full bg-slate-950 border border-yellow-500/10 rounded-2xl shadow-2xl overflow-hidden text-white font-sans max-w-4xl mx-auto">
      {/* Step Progress Bar */}
      <div id="wizard-steps-progress" className="bg-slate-900 px-6 py-4 border-b border-yellow-500/10 flex items-center justify-between overflow-x-auto scrollbar-none">
        {stepsHeader.map((s) => (
          <div key={s.num} className="flex items-center space-x-2 shrink-0">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= s.num 
                ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20' 
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {s.num}
            </span>
            <span className={`text-xs font-medium tracking-wider uppercase transition-colors duration-300 ${
              step === s.num ? 'text-yellow-400 font-semibold' : step > s.num ? 'text-slate-300' : 'text-slate-500'
            }`}>
              {s.label}
            </span>
            {s.num < 5 && <ChevronRight className="h-4 w-4 text-slate-700" />}
          </div>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {/* STEP 1: TRIP DETAILS */}
        {step === 1 && (
          <div id="step-1-trip-details" className="space-y-6 animate-fade-in">
            <div className="border-l-2 border-yellow-500 pl-4">
              <h2 className="font-serif text-2xl font-bold tracking-wide uppercase">Votre Trajet d'Élite</h2>
              <p className="text-slate-400 text-sm">Définissez vos points de prise en charge et destinations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup location */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Lieu de Prise en Charge
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Adresse, Aéroport, Gare..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
                {/* Popular locations quick pick */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {POPULAR_LOCATIONS.slice(0, 4).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setPickup(loc)}
                      className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded transition-colors"
                    >
                      + {loc.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropoff location */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Lieu de Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    placeholder="Adresse, Hôtel..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {POPULAR_LOCATIONS.slice(4).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setDropoff(loc)}
                      className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded transition-colors"
                    >
                      + {loc.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Date de Départ
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Heure de Départ
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>

              {/* Trip type */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Type de Course
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTripType('one-way')}
                    className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all ${
                      tripType === 'one-way'
                        ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Aller Simple
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType('round-trip')}
                    className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all ${
                      tripType === 'round-trip'
                        ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Aller-Retour
                  </button>
                </div>
              </div>
            </div>

            {/* Availability Warning */}
            {availabilityMsg && (
              <div className={`p-4 rounded-lg border text-sm flex items-center space-x-3 ${
                isPeak 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                <Sparkles className="h-5 w-5 shrink-0" />
                <span>{availabilityMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SERVICE & OPTIONS */}
        {step === 2 && (
          <div id="step-2-service-selection" className="space-y-6 animate-fade-in">
            <div className="border-l-2 border-yellow-500 pl-4">
              <h2 className="font-serif text-2xl font-bold tracking-wide uppercase">Votre Flotte Prestige</h2>
              <p className="text-slate-400 text-sm">Sélectionnez la catégorie de véhicule et les options souhaitées.</p>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                Véhicules Disponibles
              </label>
              <div className="grid grid-cols-1 gap-4">
                {vehicles.map((car) => (
                  <div
                    key={car.id}
                    id={`vehicle-card-${car.id}`}
                    onClick={() => setSelectedVehicle(car)}
                    className={`border rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer transition-all ${
                      selectedVehicle?.id === car.id
                        ? 'border-yellow-500 bg-yellow-500/5 shadow-lg shadow-yellow-500/5'
                        : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Vehicle image */}
                    <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Specifications details */}
                    <div className="flex-1 w-full text-left">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-yellow-500">
                            Catégorie {car.category}
                          </span>
                          <h3 className="text-lg font-serif font-bold text-white leading-tight">
                            {car.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-slate-400">À partir de</span>
                          <div className="text-xl font-serif font-bold text-yellow-500">
                            {car.baseRate} DT
                          </div>
                        </div>
                      </div>

                      {/* Capacity indices */}
                      <div className="flex space-x-4 mb-4 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span>{car.passengerCapacity} Passagers</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4 text-slate-500" />
                          <span>{car.luggageCapacity} Bagages</span>
                        </span>
                      </div>

                      {/* Specs pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {(car.specifications || []).slice(0, 4).map((spec) => (
                          <span
                            key={spec}
                            className="text-[9px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-850"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Luxury Add-ons */}
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                Options & Conciergerie Additionnelle
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ADDONS.map((ad) => {
                  const isChecked = selectedAddons.includes(ad.id);
                  return (
                    <div
                      key={ad.id}
                      onClick={() => {
                        setSelectedAddons(prev => 
                          isChecked ? prev.filter(id => id !== ad.id) : [...prev, ad.id]
                        );
                      }}
                      className={`flex justify-between items-center p-3.5 rounded-lg border cursor-pointer text-sm transition-all ${
                        isChecked
                          ? 'border-yellow-500/50 bg-yellow-500/5 text-white'
                          : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 text-left">
                        <span className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked ? 'border-yellow-500 bg-yellow-500' : 'border-slate-700'
                        }`}>
                          {isChecked && <span className="h-2 w-2 rounded-sm bg-slate-950" />}
                        </span>
                        <span>{ad.name}</span>
                      </div>
                      <span className="font-mono text-yellow-500 shrink-0 font-semibold text-xs ml-2">
                        {ad.price === 0 ? 'Offert' : `+${ad.price} DT`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Driver Language Preference */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                Langue Souhaitée du Chauffeur
              </label>
              <select
                value={languagePref}
                onChange={(e) => setLanguagePref(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
              >
                <option value="Français (Bilingue)">Français (Natif/Bilingue)</option>
                <option value="Anglais (Natif)">Anglais (Natif / Global)</option>
                <option value="Espagnol">Espagnol (Courant)</option>
                <option value="Russe">Russe (Intermédiaire)</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: PASSENGER INFO */}
        {step === 3 && (
          <div id="step-3-passenger-info" className="space-y-6 animate-fade-in">
            <div className="border-l-2 border-yellow-500 pl-4">
              <h2 className="font-serif text-2xl font-bold tracking-wide uppercase">Détails des Passagers</h2>
              <p className="text-slate-400 text-sm">Informations de contact nécessaires pour le suivi en temps réel de votre chauffeur.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Nom Complet du Passager
                </label>
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="M. ou Mme Prénom Nom"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Téléphone Portable (SMS Chauffeur)
                </label>
                <input
                  type="tel"
                  required
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Adresse Email (Envoi de la confirmation & reçu)
                </label>
                <input
                  type="email"
                  required
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  placeholder="passager@prestige.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              {/* Luggage / Passenger counts */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Nombre de Bagages
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setLuggageCount(prev => Math.max(0, prev - 1))}
                    className="h-9 w-9 bg-slate-900 hover:bg-slate-800 text-white rounded border border-slate-800 text-lg"
                  >
                    -
                  </button>
                  <span className="text-sm font-mono w-8 text-center">{luggageCount}</span>
                  <button
                    type="button"
                    onClick={() => setLuggageCount(prev => Math.min(10, prev + 1))}
                    className="h-9 w-9 bg-slate-900 hover:bg-slate-800 text-white rounded border border-slate-800 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Nombre de Passagers
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setPassengerCount(prev => Math.max(1, prev - 1))}
                    className="h-9 w-9 bg-slate-900 hover:bg-slate-800 text-white rounded border border-slate-800 text-lg"
                  >
                    -
                  </button>
                  <span className="text-sm font-mono w-8 text-center">{passengerCount}</span>
                  <button
                    type="button"
                    onClick={() => setPassengerCount(prev => Math.min(8, prev + 1))}
                    className="h-9 w-9 bg-slate-900 hover:bg-slate-800 text-white rounded border border-slate-800 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                  Instructions Spéciales / Consignes de Vol (Optionnel)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Numéro de vol ou train (pour le suivi des retards), consignes de bagages spécifiques, boissons ou température de cabine souhaitées..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT */}
        {step === 4 && (
          <div id="step-4-payment" className="space-y-6 animate-fade-in">
            <div className="border-l-2 border-yellow-500 pl-4">
              <h2 className="font-serif text-2xl font-bold tracking-wide uppercase">Validation & Règlement</h2>
              <p className="text-slate-400 text-sm">Sécurisez votre réservation par carte ou réglez directement à bord.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Summary & Payment */}
              <div className="lg:col-span-7 space-y-6">
                {/* Method picker */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                    Mode de Paiement
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Stripe')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        paymentMethod === 'Stripe'
                          ? 'border-yellow-500 bg-yellow-500/5 text-yellow-400'
                          : 'border-slate-800 bg-slate-900 text-slate-500 hover:bg-slate-850'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">Carte de Crédit (Stripe)</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Local')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        paymentMethod === 'Local'
                          ? 'border-yellow-500 bg-yellow-500/5 text-yellow-400'
                          : 'border-slate-800 bg-slate-900 text-slate-500 hover:bg-slate-850'
                      }`}
                    >
                      <Users className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">À bord (Chauffeur)</span>
                    </button>
                  </div>
                </div>

                {/* Card Fields (If Stripe selected) */}
                {paymentMethod === 'Stripe' && (
                  <div id="stripe-card-inputs" className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Paiement Sécurisé SSL</span>
                      <div className="flex space-x-1.5 text-xs text-slate-500">
                        <span>Visa</span>
                        <span>•</span>
                        <span>Mastercard</span>
                        <span>•</span>
                        <span>Amex</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400">Numéro de Carte</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-yellow-500 transition-colors font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400">Expiration</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/AA"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-yellow-500 transition-colors font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400">Code CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="123"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-yellow-500 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Promo Code input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-yellow-500">
                    Code Promotionnel
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Ex: WELCOME15"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 uppercase focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-yellow-500 border border-yellow-500/20 hover:border-yellow-500 text-sm font-semibold rounded-lg transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                      <Gift className="h-3 w-3" />
                      <span>Code appliqué avec succès ({discountPercent}%)!</span>
                    </p>
                  )}
                  {promoError && <p className="text-xs text-rose-400">{promoError}</p>}
                </div>
              </div>

              {/* Right Side: Invoice breakdown */}
              <div className="lg:col-span-5 bg-slate-900/60 p-5 rounded-xl border border-slate-800/80 space-y-6">
                <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3">
                  Détails de la Facture
                </h3>

                <ul className="space-y-3.5 text-xs">
                  <li className="flex justify-between text-slate-400">
                    <span>Base Course ({selectedVehicle?.name})</span>
                    <span className="font-mono text-white">{priceDetails.base} DT</span>
                  </li>

                  {selectedAddons.length > 0 && (
                    <li className="space-y-1.5 pl-2 border-l border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block">Options incluses:</span>
                      {selectedAddons.map(id => {
                        const ad = ADDONS.find(a => a.id === id);
                        return (
                          <div key={id} className="flex justify-between text-[11px] text-slate-400">
                            <span>• {ad?.name}</span>
                            <span className="font-mono">{ad?.price === 0 ? 'Gratuit' : `${ad?.price} DT`}</span>
                          </div>
                        );
                      })}
                    </li>
                  )}

                  <li className="flex justify-between text-slate-400">
                    <span>Frais de réservation fixes</span>
                    <span className="font-mono text-white">{priceDetails.fees} DT</span>
                  </li>

                  <li className="flex justify-between text-slate-400">
                    <span>Taxes (TVA 19%)</span>
                    <span className="font-mono text-white">{priceDetails.tax} DT</span>
                  </li>

                  {priceDetails.discount > 0 && (
                    <li className="flex justify-between text-emerald-400 font-semibold bg-emerald-500/5 p-2 rounded">
                      <span className="flex items-center space-x-1">
                        <Gift className="h-3.5 w-3.5" />
                        <span>Code Promo ({appliedPromo})</span>
                      </span>
                      <span className="font-mono">-{priceDetails.discount} DT</span>
                    </li>
                  )}

                  <li className="h-px bg-slate-800 my-2" />

                  <li className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-yellow-500 uppercase tracking-wider font-bold">Total TTC</span>
                    <span className="text-xl font-serif font-bold text-white font-mono">{priceDetails.total} DT</span>
                  </li>
                </ul>

                {/* Brief details checklist */}
                <div className="bg-slate-950 p-3 rounded text-[11px] text-slate-400 space-y-1 text-left">
                  <p className="text-white font-medium mb-1">Résumé du Trajet:</p>
                  <p><span className="text-slate-500 font-semibold">Départ:</span> {pickup}</p>
                  <p><span className="text-slate-500 font-semibold">Destination:</span> {dropoff}</p>
                  <p><span className="text-slate-500 font-semibold">Date:</span> {date} à {time}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION RECEIPT */}
        {step === 5 && confirmedBooking && (
          <div id="step-5-confirmation" className="text-center space-y-6 py-6 animate-fade-in print:p-0">
            <div className="flex justify-center">
              <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-500 animate-bounce">
                <CheckCircle className="h-12 w-12 stroke-[1.5]" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold tracking-wide uppercase">Réservation Confirmée !</h2>
              <p className="text-emerald-400 font-semibold tracking-widest uppercase text-xs font-mono">
                Référence: {confirmedBooking.bookingReference}
              </p>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Votre chauffeur haut de gamme a été réservé avec succès. Un email de confirmation détaillé vous a été envoyé.
              </p>
            </div>

            {/* Print Friendly Booking Summary Table */}
            <div id="printable-receipt-card" className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left max-w-xl mx-auto space-y-4 print:bg-white print:text-black print:border-none">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 print:border-black">
                <div>
                  <span className="font-serif text-lg font-bold tracking-widest text-white uppercase print:text-black">PRESTIGE</span>
                  <span className="text-[8px] uppercase tracking-widest text-yellow-500 font-mono block">Chauffeur</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Date de réservation</span>
                  <span className="text-xs text-white font-medium print:text-black">
                    {new Date(confirmedBooking.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans text-slate-300 print:text-black">
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[9px] tracking-wider">Passager</span>
                  <span className="font-medium text-white print:text-black">{confirmedBooking.passengerName}</span>
                  <span className="block text-slate-400 text-[11px]">{confirmedBooking.passengerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[9px] tracking-wider">Véhicule</span>
                  <span className="font-medium text-white print:text-black">{confirmedBooking.vehicleName}</span>
                  <span className="block text-yellow-500 text-[11px] font-mono">{confirmedBooking.vehicleCategory}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-850 pt-3 print:border-black print:text-black">
                <p>
                  <strong className="text-slate-500 font-semibold uppercase text-[9px] tracking-wider block">Départ / Prise en Charge</strong>
                  {confirmedBooking.pickupLocation} <br />
                  <span className="text-yellow-500 font-semibold text-[11px]">{confirmedBooking.pickupDate} à {confirmedBooking.pickupTime}</span>
                </p>
                <p>
                  <strong className="text-slate-500 font-semibold uppercase text-[9px] tracking-wider block">Arrivée / Destination</strong>
                  {confirmedBooking.dropoffLocation}
                </p>
              </div>

              {confirmedBooking.driverName && (
                <div className="flex items-center space-x-3 bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/10 mt-2 print:border-black print:bg-slate-100">
                  <ShieldCheck className="h-5 w-5 text-yellow-500 shrink-0" />
                  <div className="text-xs">
                    <span className="text-yellow-500 font-mono uppercase tracking-wider text-[9px] block">Chauffeur Privé Assigné</span>
                    <strong className="text-white font-serif print:text-black">{confirmedBooking.driverName}</strong>
                    <span className="text-slate-400 block text-[11px] mt-0.5">Votre chauffeur d'élite sera sur place à {confirmedBooking.pickupTime}.</span>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-800 pt-3 flex justify-between items-center print:border-black print:text-black">
                <span className="text-xs font-bold text-slate-400 uppercase">Montant total réglé</span>
                <span className="text-lg font-serif font-bold text-yellow-500 font-mono print:text-black">
                  {confirmedBooking.totalPrice} DT
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 print:hidden">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger le Reçu PDF</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPickup('');
                  setDropoff('');
                  setDate('');
                  setTime('');
                  setSelectedVehicle(null);
                  setSelectedAddons([]);
                  setDiscountPercent(0);
                  setAppliedPromo('');
                  setPromoCode('');
                  setConfirmedBooking(null);
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
              >
                Nouvelle Réservation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer controls */}
      {step < 5 && (
        <div id="wizard-navigation-controls" className="bg-slate-900/60 px-6 py-4 border-t border-slate-900 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 1 || loading}
            className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded border transition-colors ${
              step === 1
                ? 'text-slate-600 border-slate-800 cursor-not-allowed'
                : 'text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded transition-all duration-300"
            >
              <span>Continuer</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded shadow-lg shadow-yellow-500/10 transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 text-slate-950" />
                  <span>Confirmer la Réservation</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
