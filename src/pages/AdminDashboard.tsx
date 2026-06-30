import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, TrendingUp, Users, DollarSign, Star, Car, Settings, Edit3, Trash2, Check, RefreshCw, Plus, Save } from 'lucide-react';
import { api } from '../utils/api';
import { Booking, Vehicle, Driver, DashboardStats, CompanySettings } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'vehicles' | 'drivers' | 'settings'>('bookings');
  
  // States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
  const [editingDriver, setEditingDriver] = useState<Partial<Driver> | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await api.admin.getStats();
      setStats(statsData);

      const bookingsData = await api.bookings.list();
      setBookings(bookingsData);

      const vehiclesData = await api.vehicles.list();
      setVehicles(vehiclesData);

      const driversData = await api.drivers.list();
      setDrivers(driversData);

      const settingsData = await api.admin.getSettings();
      setSettings(settingsData);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Refresh listener when booking is created
    window.addEventListener('booking-created', loadData);
    return () => {
      window.removeEventListener('booking-created', loadData);
    };
  }, []);

  // Update booking details / assign driver / update status
  const handleUpdateBooking = async (id: string, payload: Partial<Booking>) => {
    try {
      await api.bookings.update(id, payload);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Impossible de mettre à jour la réservation");
    }
  };

  // Vehicle CRUD
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    try {
      if (editingVehicle.id) {
        await api.vehicles.update(editingVehicle.id, editingVehicle);
      } else {
        await api.vehicles.create(editingVehicle);
      }
      setEditingVehicle(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Erreur de sauvegarde du véhicule");
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Voulez-vous supprimer ce véhicule de la flotte d\'élite ?')) return;
    try {
      await api.vehicles.delete(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  // Driver CRUD
  const handleSaveDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;
    try {
      if (editingDriver.id) {
        await api.drivers.update(editingDriver.id, editingDriver);
      } else {
        await api.drivers.create(editingDriver);
      }
      setEditingDriver(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Erreur de sauvegarde du chauffeur");
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!confirm('Voulez-vous révoquer ce chauffeur de la liste ?')) return;
    try {
      await api.drivers.delete(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la révocation");
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.admin.updateSettings(settings);
      alert('Paramètres généraux sauvegardés avec succès.');
      await loadData();
    } catch (err: any) {
      alert(err.message || "Erreur de sauvegarde des paramètres");
    }
  };

  return (
    <div id="admin-dashboard-container" className="text-white font-sans bg-slate-950 min-h-screen pt-28 pb-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 flex justify-between items-center border-b border-slate-900 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-yellow-500">
              <Shield className="h-5 w-5" />
              <span className="text-xs font-mono tracking-widest uppercase font-bold">Console d'Administration Globale</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wide mt-1">
              Prestige Cars Backoffice
            </h1>
          </div>
          <button
            onClick={loadData}
            title="Rafraîchir les données"
            className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-yellow-400 rounded-lg border border-slate-800 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Bento Stats Block */}
        {stats && (
          <div id="bento-metrics-grid" className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {[
              { label: 'Revenu Global', value: `${stats.totalRevenue} DT`, icon: <DollarSign className="h-5 w-5 text-emerald-500" /> },
              { label: 'Réservations', value: stats.totalBookings, icon: <TrendingUp className="h-5 w-5 text-blue-500" /> },
              { label: 'Avis Clients', value: `${stats.averageRating} / 5`, icon: <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> },
              { label: 'Flotte Active', value: stats.activeVehicles, icon: <Car className="h-5 w-5 text-purple-500" /> },
              { label: 'Chauffeurs Prêts', value: stats.activeDrivers, icon: <Users className="h-5 w-5 text-amber-500" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase text-slate-500 font-mono font-semibold tracking-wider">{stat.label}</span>
                  <span className="block text-xl font-mono font-bold mt-1 text-white">{stat.value}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex space-x-1 p-1 bg-slate-900 rounded-xl max-w-xl mb-8 border border-slate-850">
          {[
            { id: 'bookings', label: 'Courses' },
            { id: 'vehicles', label: 'Véhicules Flotte' },
            { id: 'drivers', label: 'Chauffeurs Équipe' },
            { id: 'settings', label: 'Modèles & Options' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-slate-950 bg-yellow-500 shadow-md shadow-yellow-500/10'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: BOOKING & DISPATCH */}
        {activeTab === 'bookings' && (
          <div id="tab-bookings-manager" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl font-bold uppercase text-white">Gestion de Course & Dispatching</h2>
              <span className="text-xs font-mono text-slate-500">{bookings.length} trajets répertoriés</span>
            </div>

            <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-955 border-b border-slate-800 text-slate-500 uppercase tracking-widest font-mono text-[9px]">
                      <th className="p-4">Référence</th>
                      <th className="p-4">Date/Heure</th>
                      <th className="p-4">Passager</th>
                      <th className="p-4">Itinéraire</th>
                      <th className="p-4">Véhicule</th>
                      <th className="p-4">Chauffeur Assigné</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-sans">
                    {bookings.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-850/30 transition-colors">
                        <td className="p-4 font-mono font-bold text-yellow-500">{book.bookingReference}</td>
                        <td className="p-4">
                          <span className="block text-white font-medium">{book.pickupDate}</span>
                          <span className="text-slate-400 font-mono">{book.pickupTime}</span>
                        </td>
                        <td className="p-4">
                          <span className="block text-white font-medium">{book.passengerName}</span>
                          <span className="text-slate-500 block text-[10px]">{book.passengerPhone}</span>
                        </td>
                        <td className="p-4 max-w-xs truncate">
                          <span className="block text-slate-300">De: {book.pickupLocation.split(',')[0]}</span>
                          <span className="block text-slate-400">À: {book.dropoffLocation.split(',')[0]}</span>
                        </td>
                        <td className="p-4">
                          <span className="block text-white font-medium">{book.vehicleName.split(' ')[0]}</span>
                          <span className="text-slate-500 uppercase font-mono text-[9px]">{book.vehicleCategory}</span>
                        </td>
                        <td className="p-4">
                          <select
                            value={book.driverId || ''}
                            onChange={(e) => handleUpdateBooking(book.id, { driverId: e.target.value })}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-yellow-500"
                          >
                            <option value="">-- Assigner Chauffeur --</option>
                            {drivers.filter(d => d.available).map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value={book.status}
                            onChange={(e) => handleUpdateBooking(book.id, { status: e.target.value as any })}
                            className={`border rounded px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                              book.status === 'Confirmed' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                              book.status === 'Completed' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                              book.status === 'Cancelled' ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' : 'border-slate-800 bg-slate-950 text-slate-400'
                            }`}
                          >
                            <option value="Pending">En attente</option>
                            <option value="Confirmed">Confirmé</option>
                            <option value="In Progress">En Course</option>
                            <option value="Completed">Terminé</option>
                            <option value="Cancelled">Annulé</option>
                          </select>
                        </td>
                        <td className="p-4 font-mono font-bold text-white text-right">{book.totalPrice} DT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VEHICLES FLEET */}
        {activeTab === 'vehicles' && (
          <div id="tab-vehicles-manager" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl font-bold uppercase text-white">Flotte Automobile d'Exception</h2>
              <button
                onClick={() => setEditingVehicle({ name: '', category: 'Sedan', specifications: ['WiFi 5G', 'Eau Sabrine', 'Cuir', 'Climatisation'], baseRate: 100, ratePerKm: 3.5, hourlyRate: 150, passengerCapacity: 4, luggageCapacity: 4, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600' })}
                className="flex items-center space-x-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nouveau Véhicule</span>
              </button>
            </div>

            {/* Editing Form Overlay */}
            {editingVehicle && (
              <form onSubmit={handleSaveVehicle} className="bg-slate-900 border border-yellow-500/15 p-6 rounded-2xl space-y-4 max-w-2xl text-left">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-yellow-500">
                  {editingVehicle.id ? 'Éditer Véhicule Prestige' : 'Enregistrer Nouveau Véhicule'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400">Désignation du Modèle</label>
                    <input
                      type="text"
                      required
                      value={editingVehicle.name || ''}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                      placeholder="Ex: Mercedes S-Class Executive"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400">Catégorie</label>
                    <select
                      value={editingVehicle.category || 'Sedan'}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Sedan">Sedan Luxe</option>
                      <option value="SUV">SUV Prestige</option>
                      <option value="Van">Van Business</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400">Tarif de Base (DT)</label>
                    <input
                      type="number"
                      required
                      value={editingVehicle.baseRate || 0}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, baseRate: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400">Tarif au Kilomètre (DT)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editingVehicle.ratePerKm || 0}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, ratePerKm: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400">Tarif Horaire (DT)</label>
                    <input
                      type="number"
                      required
                      value={editingVehicle.hourlyRate || 0}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, hourlyRate: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400">Passagers</label>
                      <input
                        type="number"
                        required
                        value={editingVehicle.passengerCapacity || 4}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, passengerCapacity: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400">Bagages</label>
                      <input
                        type="number"
                        required
                        value={editingVehicle.luggageCapacity || 4}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, luggageCapacity: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] uppercase text-slate-400">Équipements à bord (séparés par des virgules)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingVehicle.specifications) ? editingVehicle.specifications.join(', ') : ''}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, specifications: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="Ex: WiFi 5G, Boissons fraîches, Cuir Nappa, Climatisation tri-zone"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] uppercase text-slate-400">Photo du véhicule</label>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <div className="flex-1 w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditingVehicle({ ...editingVehicle, image: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-yellow-500 file:text-slate-950 hover:file:bg-yellow-400"
                        />
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-[10px] text-slate-500">OU URL direct :</span>
                          <input
                            type="text"
                            value={editingVehicle.image || ''}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 bg-slate-950 border border-slate-850 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none"
                          />
                        </div>
                      </div>
                      {editingVehicle.image && (
                        <div className="h-14 w-24 border border-slate-800 rounded overflow-hidden shrink-0 bg-slate-950">
                          <img src={editingVehicle.image} alt="Aperçu" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingVehicle(null)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-850 rounded text-xs text-slate-400 border border-slate-850"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 rounded text-xs text-slate-950 font-bold"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vehicles.map((car) => (
                <div key={car.id} className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div className="aspect-video bg-slate-950 border-b border-slate-850">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="p-5 text-left space-y-3">
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-widest text-yellow-500">Catégorie: {car.category}</span>
                      <h3 className="text-base font-serif font-bold text-white mt-0.5">{car.name}</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-955 p-2 rounded border border-slate-850 text-[10px] font-mono">
                      <div>
                        <span className="block text-slate-500 uppercase text-[8px]">Base</span>
                        <span className="text-white font-semibold">{car.baseRate} DT</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 uppercase text-[8px]">Km</span>
                        <span className="text-white font-semibold">{car.ratePerKm} DT</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 uppercase text-[8px]">Horaire</span>
                        <span className="text-white font-semibold">{car.hourlyRate} DT</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setEditingVehicle(car)}
                        className="p-1.5 rounded bg-slate-950 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteVehicle(car.id)}
                        className="p-1.5 rounded bg-slate-950 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DRIVERS TEAM */}
        {activeTab === 'drivers' && (
          <div id="tab-drivers-manager" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl font-bold uppercase text-white">Chauffeurs Grande Remise Certifiés</h2>
              <button
                onClick={() => setEditingDriver({ name: '', phone: '', email: '', languages: ['Français', 'Anglais'], rating: 5.0, tripsCount: 0 })}
                className="flex items-center space-x-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nouveau Chauffeur</span>
              </button>
            </div>

            {/* Editing Form Overlay */}
            {editingDriver && (
              <form onSubmit={handleSaveDriver} className="bg-slate-900 border border-yellow-500/15 p-6 rounded-2xl space-y-4 max-w-2xl text-left">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-yellow-500">
                  {editingDriver.id ? 'Éditer Chauffeur' : 'Enregistrer Nouveau Chauffeur'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400">Nom Complet</label>
                    <input
                      type="text"
                      required
                      value={editingDriver.name || ''}
                      onChange={(e) => setEditingDriver({ ...editingDriver, name: e.target.value })}
                      placeholder="Ex: Jean-Louis Moreau"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400">Téléphone Portable</label>
                    <input
                      type="tel"
                      required
                      value={editingDriver.phone || ''}
                      onChange={(e) => setEditingDriver({ ...editingDriver, phone: e.target.value })}
                      placeholder="Ex: +33 6 12 34 56 78"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400">Adresse Email</label>
                    <input
                      type="email"
                      required
                      value={editingDriver.email || ''}
                      onChange={(e) => setEditingDriver({ ...editingDriver, email: e.target.value })}
                      placeholder="Ex: jl.moreau@prestige.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400">Licence VTC</label>
                    <input
                      type="text"
                      value={editingDriver.licenseNumber || ''}
                      onChange={(e) => setEditingDriver({ ...editingDriver, licenseNumber: e.target.value })}
                      placeholder="Ex: TX-2023-88321"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingDriver(null)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-855 rounded text-xs text-slate-400 border border-slate-850"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 rounded text-xs text-slate-950 font-bold"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {drivers.map((drv) => (
                <div key={drv.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 flex items-center space-x-4 text-left">
                  <div className="h-16 w-16 rounded-full overflow-hidden border border-slate-800 shrink-0 bg-slate-950">
                    <img
                      src={drv.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256'}
                      alt={drv.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div>
                      <h3 className="text-sm font-bold text-white truncate leading-tight">{drv.name}</h3>
                      <span className="text-[9px] font-mono text-yellow-500">{drv.licenseNumber || 'Licence VTC vérifiée'}</span>
                    </div>

                    <div className="flex space-x-3 text-[10px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 shrink-0" />
                        <span>{drv.rating}</span>
                      </span>
                      <span>•</span>
                      <span>{drv.tripsCount} courses</span>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-850 mt-1">
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-semibold">ACTIF</span>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingDriver(drv)}
                          className="p-1 rounded text-slate-500 hover:text-yellow-400 hover:bg-slate-850"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDriver(drv.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GENERAL SETTINGS */}
        {activeTab === 'settings' && settings && (
          <div id="tab-settings-manager" className="max-w-2xl text-left bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl">
            <h2 className="font-serif text-lg font-bold uppercase text-white border-b border-slate-800 pb-3 mb-6 flex items-center space-x-2">
              <Settings className="h-5 w-5 text-yellow-500" />
              <span>Options de Conciergerie & Modèles de Message</span>
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-yellow-500 font-bold tracking-wider">Nom de la Marque</label>
                  <input
                    type="text"
                    required
                    value={settings.companyName || ''}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-yellow-500 font-bold tracking-wider">Téléphone Général</label>
                  <input
                    type="text"
                    required
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              {/* Email notifications templates */}
              <div className="space-y-4 pt-4 border-t border-slate-850">
                <span className="block text-[11px] font-mono text-yellow-500 font-bold uppercase tracking-wider">📬 Modèles de Notifications Émail Automatiques</span>
                
                <div className="space-y-2">
                  <label className="text-[9px] uppercase text-slate-400 font-semibold tracking-wider">Confirmation de course client</label>
                  <textarea
                    value={settings.emailTemplates?.confirmation || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      emailTemplates: { ...settings.emailTemplates, confirmation: e.target.value }
                    })}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-yellow-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] uppercase text-slate-400 font-semibold tracking-wider">Confirmation d'assignation Chauffeur</label>
                  <textarea
                    value={settings.emailTemplates?.assignment || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      emailTemplates: { ...settings.emailTemplates, assignment: e.target.value }
                    })}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="pt-4 text-right">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-5 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 text-xs font-bold uppercase rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Enregistrer les Modèles</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
