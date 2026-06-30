import { Sparkles, HelpCircle } from 'lucide-react';
import BookingWizard from '../components/BookingWizard';
import { Booking } from '../types';

interface BookingPageProps {
  currentUser: any;
  setCurrentTab: (tab: string) => void;
}

export default function BookingPage({ currentUser, setCurrentTab }: BookingPageProps) {
  const handleBookingSuccess = (booking: Booking) => {
    console.log('Booking completed successfully:', booking);
    // Automatically dispatch custom event to refresh dashboards
    window.dispatchEvent(new Event('booking-created'));
  };

  return (
    <div id="booking-page-container" className="bg-slate-950 min-h-screen pt-28 pb-16 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Intro */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-yellow-500">Formulaire Numérique</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide uppercase mt-2">
            Réserver Votre Chauffeur
          </h1>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4" />
          
          {!currentUser && (
            <p className="text-xs text-yellow-500/80 bg-yellow-500/5 p-2 rounded max-w-md mx-auto mt-6 border border-yellow-500/10">
              💡 Astuce: <button onClick={() => setCurrentTab('auth')} className="underline font-bold text-yellow-400">Connectez-vous</button> pour enregistrer ce trajet sur votre compte et pré-remplir vos coordonnées !
            </p>
          )}
        </div>

        {/* Mount BookingWizard */}
        <div id="wizard-mount-point" className="relative z-10">
          <BookingWizard onSuccess={handleBookingSuccess} currentUser={currentUser} />
        </div>

        {/* Security / Quality guarantee banner */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-xs text-slate-400 text-left bg-slate-900/30 p-5 rounded-xl border border-slate-900">
          <div className="flex items-start space-x-2.5">
            <Sparkles className="h-4.5 w-4.5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold uppercase tracking-wider text-[10px] mb-1">Garantie Grande Remise</p>
              <p>Chauffeurs titulaires de cartes d'aptitude VTC délivrées par la Préfecture. Véhicules soumis à un protocole de nettoyage et d'inspection minutieux entre chaque transfert.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2.5">
            <HelpCircle className="h-4.5 w-4.5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold uppercase tracking-wider text-[10px] mb-1">Modification Sans Frais</p>
              <p>Modifiez ou annulez gratuitement votre trajet jusqu'à 24 heures avant l'heure de prise en charge directement depuis votre espace client.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
