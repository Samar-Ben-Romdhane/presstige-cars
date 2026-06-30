import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import BookingPage from './pages/BookingPage';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './utils/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Initial load
    const user = api.auth.getCurrentUser();
    setCurrentUser(user);

    // Sync auth status across components on tab changes or custom triggers
    const syncAuth = () => {
      setCurrentUser(api.auth.getCurrentUser());
    };
    window.addEventListener('auth-change', syncAuth);
    
    // Smoothly scroll to top when changing page tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      window.removeEventListener('auth-change', syncAuth);
    };
  }, [currentTab]);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
  };

  // Render view depending on state
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return <Home setCurrentTab={setCurrentTab} />;
      case 'services':
        return <Services setCurrentTab={setCurrentTab} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'booking':
        return <BookingPage currentUser={currentUser} setCurrentTab={setCurrentTab} />;
      case 'auth':
        return <AuthPage onLoginSuccess={handleLoginSuccess} setCurrentTab={setCurrentTab} />;
      case 'dashboard':
        return <UserDashboard currentUser={currentUser} setCurrentTab={setCurrentTab} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-yellow-500 selection:text-slate-950 font-sans antialiased">
      {/* Premium Header/Navigation bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
      />

      {/* Main viewport with motion transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared luxury footer component */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}
