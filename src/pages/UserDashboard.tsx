import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Car, Shield, Award, User, Phone, CheckCircle, Clock, Trash2, Star, MessageSquare, Edit3, Loader2 } from 'lucide-react';
import { api } from '../utils/api';
import { Booking } from '../types';

interface UserDashboardProps {
  currentUser: any;
  setCurrentTab: (tab: string) => void;
}

export default function UserDashboard({ currentUser, setCurrentTab }: UserDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const [starRating, setStarRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  
  // Profile edit
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.list();
      setBookings(data);
      
      const profile = await api.auth.getProfile();
      setName(profile.name);
      setPhone(profile.phone || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Refresh listener when booking is created or state updates
    window.addEventListener('booking-created', loadData);
    return () => {
      window.removeEventListener('booking-created', loadData);
    };
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation Prestige ?')) return;
    try {
      await api.bookings.cancel(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Impossible d'annuler cette réservation.");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingBooking) return;
    try {
      await api.bookings.submitReview(ratingBooking.id, starRating, commentText);
      setRatingBooking(null);
      setCommentText('');
      setStarRating(5);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Impossible d\'envoyer votre avis.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    try {
      await api.auth.updateProfile({ name, phone });
      setProfileSuccess('Profil mis à jour avec succès.');
      setTimeout(() => setProfileSuccess(''), 3000);
      window.dispatchEvent(new Event('auth-change'));
    } catch (err: any) {
      alert(err.message || 'Une erreur est survenue.');
    }
  };

  // Find next upcoming active booking
  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
  const upcomingBooking = activeBookings.length > 0 
    ? activeBookings.sort((a, b) => a.pickupDate.localeCompare(b.pickupDate))[0]
    : null;

  return (
    <div id="user-dashboard-container" className="text-white font-sans bg-slate-950 min-h-screen pt-28 pb-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-yellow-500">Tableau de bord</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wide mt-1">
              Bonjour, {currentUser?.name || 'Client VIP'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">Gérez vos réservations, factures, favoris et préférences.</p>
          </div>
          <button
            id="dashboard-cta-booking"
            onClick={() => setCurrentTab('booking')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold uppercase text-xs tracking-widest rounded-lg transition-colors"
          >
            Réserver un Chauffeur
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Bookings & Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Upcoming booking spotlight card */}
            {upcomingBooking && (
              <div id="upcoming-booking-alert" className="bg-gradient-to-br from-slate-900 via-slate-900 to-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-yellow-500 text-slate-950 font-bold px-2.5 py-1 rounded">
                    Prochaine course
                  </span>
                  <span className="text-xs text-slate-400">Réf: {upcomingBooking.bookingReference}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-sm">
                      <span className="block text-slate-500 text-[10px] uppercase font-semibold">Date & Heure de Prise en Charge</span>
                      <strong className="text-base text-yellow-400">{upcomingBooking.pickupDate} à {upcomingBooking.pickupTime}</strong>
                    </p>
                    <p className="text-xs text-slate-300">
                      <span className="block text-slate-500 text-[10px] uppercase font-semibold">Itinéraire</span>
                      De: {upcomingBooking.pickupLocation} <br />
                      À: {upcomingBooking.dropoffLocation}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center space-x-4">
                    <div className="h-12 w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500 shrink-0 border border-yellow-500/10">
                      <Car className="h-6 w-6" />
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-500 uppercase tracking-widest block text-[9px]">Véhicule réservé</span>
                      <strong className="text-white block text-[13px] font-serif">{upcomingBooking.vehicleName}</strong>
                      <span className="text-slate-400">{upcomingBooking.vehicleCategory} • WiFi inclus</span>
                    </div>
                  </div>
                </div>

                {upcomingBooking.driverName ? (
                  <div className="mt-4 flex items-center space-x-3 text-xs bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/15">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Votre Chauffeur <strong>{upcomingBooking.driverName}</strong> a validé la course et sera présent à l'adresse.</span>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center space-x-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                    <Clock className="h-4 w-4 text-yellow-500 shrink-0 animate-pulse" />
                    <span>Recherche opérationnelle du meilleur chauffeur en cours...</span>
                  </div>
                )}
              </div>
            )}

            {/* List of Bookings */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-white border-b border-slate-900 pb-2">
                Historique des Courses
              </h3>

              {loading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 text-yellow-500 animate-spin mx-auto" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-12 bg-slate-900/40 border border-slate-900 rounded-xl text-center">
                  <Calendar className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Aucune course enregistrée pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((book) => (
                    <div
                      key={book.id}
                      id={`booking-list-card-${book.id}`}
                      className="bg-slate-900/40 border border-slate-850 hover:border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors"
                    >
                      <div className="space-y-2 text-xs text-slate-350 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white tracking-widest uppercase font-mono">{book.bookingReference}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                            book.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' :
                            book.status === 'Completed' ? 'bg-blue-500/10 text-blue-400' :
                            book.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {book.status === 'Confirmed' ? 'Confirmé' :
                             book.status === 'Completed' ? 'Terminé' :
                             book.status === 'Cancelled' ? 'Annulé' : 'En attente'}
                          </span>
                        </div>
                        
                        <p>
                          <strong className="text-white">{book.pickupDate} à {book.pickupTime}</strong> <br />
                          <span className="text-slate-500">De:</span> {book.pickupLocation} <br />
                          <span className="text-slate-500">À:</span> {book.dropoffLocation}
                        </p>
                        
                        <p className="text-slate-400 text-[11px]">
                          Véhicule: {book.vehicleName} • Chauffeur: {book.driverName || 'Non assigné'}
                        </p>
                      </div>

                      {/* Side controls */}
                      <div className="text-right shrink-0 space-y-2.5 w-full md:w-auto flex md:flex-col justify-between items-center md:items-end">
                        <div className="font-mono text-base font-bold text-yellow-500">{book.totalPrice} DT</div>
                        
                        <div className="flex space-x-2">
                          {book.status === 'Completed' && !book.review && (
                            <button
                              type="button"
                              onClick={() => {
                                setRatingBooking(book);
                                setStarRating(5);
                                setCommentText('');
                              }}
                              className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-semibold rounded text-[10px] uppercase tracking-wide transition-colors"
                            >
                              Évaluer
                            </button>
                          )}

                          {(book.status === 'Pending' || book.status === 'Confirmed') && (
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(book.id)}
                              className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/10 transition-colors"
                              title="Annuler la réservation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit rating overlay / modal form */}
            {ratingBooking && (
              <div className="p-6 bg-slate-900 border border-yellow-500/10 rounded-2xl space-y-4">
                <div className="border-l-2 border-yellow-500 pl-4 text-left">
                  <h4 className="font-serif text-lg font-bold uppercase text-white">Évaluer Votre Course</h4>
                  <p className="text-slate-400 text-xs">Partagez votre avis sur le trajet {ratingBooking.bookingReference} avec {ratingBooking.driverName || 'notre chauffeur'}.</p>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Note Étoiles</label>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setStarRating(num)}
                          className="p-1 text-yellow-500 focus:outline-none"
                        >
                          <Star className={`h-6 w-6 ${starRating >= num ? 'fill-current' : 'stroke-[1.5]'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Commentaire</label>
                    <textarea
                      required
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Conduite du chauffeur, accueil, propreté du véhicule..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setRatingBooking(null)}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-400 text-xs rounded border border-slate-850 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-semibold rounded transition-colors"
                    >
                      Envoyer l'Avis
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT: Profile Settings & Quick Stats */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick stats panel */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
                Votre Rang Prestige
              </h3>
              
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center text-slate-950 font-bold shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-semibold text-white">Membre Privilège Gold</span>
                  <span className="text-[10px] font-mono text-yellow-500 uppercase">Service VIP garanti</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-center text-xs pt-2">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="block font-mono text-lg font-bold text-white">{bookings.length}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Courses</span>
                </div>
                
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="block font-mono text-lg font-bold text-yellow-500">
                    {bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.totalPrice, 0)} DT
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">Dépensé</span>
                </div>
              </div>
            </div>

            {/* Profile editor */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-left">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3 mb-4">
                Paramètres du Profil
              </h3>

              {profileSuccess && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-xs mb-3">
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400">Téléphone Portable</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400">Adresse Email</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full bg-slate-950/40 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-950 hover:bg-slate-850 text-yellow-500 text-xs font-semibold rounded border border-yellow-500/20 hover:border-yellow-500 transition-colors uppercase tracking-wider"
                >
                  Mettre à jour le profil
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
