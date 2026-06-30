import React, { useState } from 'react';
import { User, Mail, Lock, Phone, UserCheck, Shield, ChevronRight, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
  setCurrentTab: (tab: string) => void;
}

export default function AuthPage({ onLoginSuccess, setCurrentTab }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.auth.login({ email, password });
        onLoginSuccess(res.user);
        setCurrentTab(res.user.role === 'admin' ? 'admin' : 'dashboard');
      } else {
        const res = await api.auth.register({ name, email, password, phone });
        onLoginSuccess(res.user);
        setCurrentTab('dashboard');
      }
      window.dispatchEvent(new Event('auth-change'));
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue pendant l\'identification.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to pre-populate testing accounts
  const handleQuickLogin = async (role: 'admin' | 'user') => {
    setLoading(true);
    setError('');
    try {
      const testCredentials = role === 'admin' 
        ? { email: 'samar8brm@gmail.com', password: 'admin' }
        : { email: 'client@prestige.com', password: 'client' };

      const res = await api.auth.login(testCredentials);
      onLoginSuccess(res.user);
      setCurrentTab(res.user.role === 'admin' ? 'admin' : 'dashboard');
      window.dispatchEvent(new Event('auth-change'));
    } catch (err: any) {
      setError('Impossible de se connecter avec le compte de démonstration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-page-container" className="bg-slate-950 min-h-screen pt-28 pb-16 flex flex-col justify-center items-center text-white font-sans px-4">
      <div className="w-full max-w-md bg-slate-900 border border-yellow-500/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Toggle tabs */}
        <div className="grid grid-cols-2 border-b border-slate-800">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`py-4 text-xs font-bold uppercase tracking-widest transition-colors ${
              isLogin 
                ? 'text-yellow-400 bg-yellow-500/5 border-b-2 border-yellow-500' 
                : 'text-slate-400 hover:text-white bg-transparent'
            }`}
          >
            Se Connecter
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`py-4 text-xs font-bold uppercase tracking-widest transition-colors ${
              !isLogin 
                ? 'text-yellow-400 bg-yellow-500/5 border-b-2 border-yellow-500' 
                : 'text-slate-400 hover:text-white bg-transparent'
            }`}
          >
            S'Inscrire
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Section title */}
          <div className="text-center">
            <span className="font-serif text-xl font-bold tracking-widest text-white uppercase block">
              PRESTIGE CARS
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-yellow-500 font-mono">
              {isLogin ? 'Accès à votre Espace Privé' : 'Création de votre Compte VIP'}
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs flex items-center space-x-2 text-left">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-yellow-500 font-semibold">Nom Complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="M. Prénom Nom"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-yellow-500 font-semibold">Téléphone Portable</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 •• •• •• ••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-yellow-500 font-semibold">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adresse@prestige.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] uppercase tracking-wider text-yellow-500 font-semibold">Mot de Passe</label>
                {isLogin && (
                  <button type="button" onClick={() => alert('Veuillez utiliser un compte d\'évaluation ou en créer un nouveau.')} className="text-[9px] text-slate-500 hover:text-slate-300">
                    Oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold uppercase text-xs tracking-widest rounded-lg transition-all duration-300 shadow-lg shadow-yellow-500/10 flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Se Connecter' : 'Créer un compte'}</span>
                  <ChevronRight className="h-4 w-4 text-slate-950" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* 3. PREMIUM DEMO ACCOUNTS QUICK LOGIN PANEL */}
        <div id="quick-login-accounts-panel" className="bg-slate-950 p-6 border-t border-slate-800 space-y-4 text-left">
          <div>
            <span className="block text-[10px] font-mono tracking-widest uppercase text-yellow-500 font-bold">
              ⚡ Comptes de Démonstration (Accès Rapide)
            </span>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Sélectionnez un compte pour vous connecter immédiatement sans saisir de mot de passe et tester les différents modules d'administration ou client.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Admin account */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-3 bg-slate-900 hover:bg-slate-855 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 text-left transition-colors flex items-center space-x-2.5"
            >
              <Shield className="h-5 w-5 text-yellow-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">Samar B.</span>
                <span className="block text-[9px] text-slate-400 font-mono truncate">Role: Admin</span>
              </div>
            </button>

            {/* Standard account */}
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              className="p-3 bg-slate-900 hover:bg-slate-855 rounded-xl border border-slate-800 hover:border-slate-700 text-left transition-colors flex items-center space-x-2.5"
            >
              <UserCheck className="h-5 w-5 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white">François D.</span>
                <span className="block text-[9px] text-slate-400 font-mono truncate">Role: Client</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
