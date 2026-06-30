import { useState, useEffect } from 'react';
import { User, LogOut, Shield, Calendar, Menu, X, Car } from 'lucide-react';
import { api } from '../utils/api';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check local storage for user changes
    const checkUser = () => {
      setCurrentUser(api.auth.getCurrentUser());
    };
    checkUser();
    
    // Scrolled state
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Custom event listener for auth changes
    window.addEventListener('auth-change', checkUser);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-change', checkUser);
    };
  }, [currentTab]);

  const handleLogoutClick = () => {
    api.auth.logout();
    onLogout();
    setCurrentTab('home');
    window.dispatchEvent(new Event('auth-change'));
  };

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'services', label: 'Nos Services' },
    { id: 'about', label: 'À Propos' },
    { id: 'contact', label: 'Contact' },
    { id: 'booking', label: 'Réserver' },
  ];

  return (
    <nav
      id="navbar-container"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md py-4 border-b border-yellow-500/10 shadow-lg shadow-black/50'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo / Branding */}
          <div
            id="navbar-logo"
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentTab('home')}
          >
            <div className="relative p-2 bg-gradient-to-br from-yellow-500 to-amber-700 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Car className="h-6 w-6 text-slate-950 stroke-[1.5]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-widest text-white uppercase block">
                PRESTIGE
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-yellow-500 font-mono -mt-1 block">
                Chauffeur Service
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div id="desktop-menu" className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-md uppercase font-sans ${
                  currentTab === item.id
                    ? 'text-yellow-400 bg-yellow-500/5 border border-yellow-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Account Controls */}
          <div id="desktop-account" className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-900/60 p-1 pr-3 rounded-full border border-slate-800">
                <button
                  id="nav-dashboard-avatar"
                  onClick={() => setCurrentTab(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-950 font-bold hover:opacity-90 transition-opacity"
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </button>
                
                <span className="text-xs text-slate-300 font-medium truncate max-w-[100px]">
                  {currentUser.name}
                </span>

                <div className="h-4 w-px bg-slate-800" />

                {currentUser.role === 'admin' ? (
                  <button
                    id="nav-btn-admin"
                    onClick={() => setCurrentTab('admin')}
                    title="Console Administrateur"
                    className={`p-1.5 rounded-full transition-colors ${
                      currentTab === 'admin'
                        ? 'text-yellow-400 bg-yellow-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    id="nav-btn-user"
                    onClick={() => setCurrentTab('dashboard')}
                    title="Espace Client"
                    className={`p-1.5 rounded-full transition-colors ${
                      currentTab === 'dashboard'
                        ? 'text-yellow-400 bg-yellow-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                  </button>
                )}

                <button
                  id="nav-btn-logout"
                  onClick={handleLogoutClick}
                  title="Déconnexion"
                  className="p-1.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-btn-login"
                onClick={() => setCurrentTab('auth')}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-semibold text-sm rounded-lg tracking-wider uppercase transition-all duration-300 shadow-lg shadow-yellow-500/10 active:scale-95"
              >
                <User className="h-4 w-4" />
                <span>Connexion</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        id="mobile-menu-dropdown"
        className={`md:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-b border-yellow-500/10 transition-all duration-300 transform ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => {
                setCurrentTab(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium tracking-wider uppercase ${
                currentTab === item.id
                  ? 'text-yellow-400 bg-yellow-500/10 border-l-2 border-yellow-500'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="h-px bg-slate-800 my-4" />

          {currentUser ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="h-9 w-9 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{currentUser.name}</div>
                  <div className="text-xs text-slate-400">{currentUser.email}</div>
                </div>
              </div>
              
              <button
                id="nav-mobile-dashboard"
                onClick={() => {
                  setCurrentTab(currentUser.role === 'admin' ? 'admin' : 'dashboard');
                  setIsOpen(false);
                }}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg"
              >
                {currentUser.role === 'admin' ? <Shield className="h-5 w-5 text-yellow-500" /> : <Calendar className="h-5 w-5 text-yellow-500" />}
                <span>{currentUser.role === 'admin' ? 'Console Admin' : 'Mon Tableau de Bord'}</span>
              </button>

              <button
                id="nav-mobile-logout"
                onClick={() => {
                  handleLogoutClick();
                  setIsOpen(false);
                }}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          ) : (
            <button
              id="nav-mobile-login"
              onClick={() => {
                setCurrentTab('auth');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-bold uppercase rounded-lg tracking-widest shadow-lg shadow-yellow-500/20"
            >
              <User className="h-5 w-5" />
              <span>Connexion / Inscription</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
