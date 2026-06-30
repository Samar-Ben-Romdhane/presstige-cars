import { Shield, Sparkles, Clock, Globe, Star, ArrowRight, UserCheck, CalendarDays, ShieldCheck } from 'lucide-react';

interface HomeProps {
  setCurrentTab: (tab: string) => void;
}

export default function Home({ setCurrentTab }: HomeProps) {
  // Exact generated hero image filename
  const HERO_IMAGE = '/src/assets/images/luxury_chauffeur_hero_1782314759929.jpg';

  const testimonials = [
    {
      id: 1,
      name: 'Jean-René de Chastellux',
      role: 'Directeur Général, Hermès International',
      text: 'Un service d\'exception d\'une rigueur irréprochable. Nos VIPs de passage à Tunis sont systématiquement confiés à Prestige Cars Tunisie. Les chauffeurs sont de parfaits ambassadeurs de l\'hospitalité tunisienne haut de gamme.',
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      role: 'VP Global Operations, Morgan Stanley',
      text: 'Extremely professional team. Their flight-tracking feature is flawless — my driver was waiting at Tunis-Carthage (TUN) right at the gate, even with my flight being delayed by two hours. Highly recommended.',
      rating: 5
    },
    {
      id: 3,
      name: 'Marc-Olivier Giraud',
      role: 'Organisateur, Tunis Fashion Week',
      text: 'La logistique de notre dernier défilé de mode a été assurée avec brio. La Classe V de Prestige Cars Tunisie a fourni un confort exceptionnel et un espace optimal pour nos stylistes et invités de marque.',
      rating: 5
    }
  ];

  return (
    <div id="home-page-container" className="text-white font-sans overflow-hidden">
      {/* 1. HERO SECTION */}
      <section
        id="hero-section"
        className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center pt-24"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.5), rgba(2, 6, 23, 0.95)), url(${HERO_IMAGE})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-yellow-400 font-semibold font-mono">
              Grande Remise & Service Chauffeur VIP
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase max-w-5xl mx-auto leading-tight">
            L'Excellence du Voyage <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
              Avec Chauffeur Privé
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Profitez d'un confort absolu, d'une discrétion totale et de chauffeurs bilingues agréés pour tous vos transferts et événements à Tunis, Hammamet et Sousse.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              id="hero-cta-booking"
              onClick={() => setCurrentTab('booking')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold uppercase rounded-lg tracking-wider transition-all duration-300 shadow-xl shadow-yellow-500/15 flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Réserver une Course</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <button
              id="hero-cta-services"
              onClick={() => setCurrentTab('services')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase rounded-lg tracking-wider border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Découvrir nos Offres</span>
            </button>
          </div>
        </div>

        {/* Sub-hero stats line */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent h-24 pointer-events-none" />
      </section>

      {/* 2. CORE FEATURES / TRUST */}
      <section id="trust-factors-section" className="bg-slate-950 py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-yellow-500">L'Expérience Prestige</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide uppercase mt-2">
              Pourquoi nous confier vos trajets ?
            </h2>
            <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-7 w-7 text-yellow-500" />,
                title: 'Discrétion Absolue',
                desc: 'Vitres teintées, insonorisation de cabine et chauffeurs formés au secret professionnel pour votre sérénité.'
              },
              {
                icon: <Clock className="h-7 w-7 text-yellow-500" />,
                title: 'Disponibilité 24/7',
                desc: 'Un accueil téléphonique dédié et une prise en charge assurée à toute heure du jour et de la nuit.'
              },
              {
                icon: <Globe className="h-7 w-7 text-yellow-500" />,
                title: 'Chauffeurs Multilingues',
                desc: 'Des chauffeurs de grande remise bilingues Anglais/Français d\'une courtoisie exemplaire.'
              },
              {
                icon: <Sparkles className="h-7 w-7 text-yellow-500" />,
                title: 'Prestations VIP de Bord',
                desc: 'WiFi, boissons fraîches, presse du jour, chargeurs multimarques et tablettes à votre disposition.'
              }
            ].map((feat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 p-6 rounded-xl border border-slate-800/60 hover:border-yellow-500/20 hover:bg-slate-900/80 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-yellow-500 mb-5 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="font-serif text-lg font-bold uppercase mb-3 text-white tracking-wide">{feat.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SHUTTLE & AIRPORT TRANSFERS SPOTLIGHT */}
      <section id="services-highlights-section" className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-yellow-500">Service Signature</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide uppercase text-white leading-tight">
                Transferts Aéroport & Hôtels de Tunisie
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Profitez d'un accueil VIP sur-mesure dès votre descente d'avion. Nos chauffeurs vous attendent directement après la douane avec une pancarte nominative, gèrent vos bagages et adaptent leur horaire aux variations de votre vol grâce au suivi radar en temps réel.
              </p>
              
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-yellow-500 shrink-0" />
                  <span>Accueil personnalisé avec pancarte nominative</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-500 shrink-0" />
                  <span>Attente gracieuse de 60 minutes incluse aux aéroports</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ShieldCheck className="h-5 w-5 text-yellow-500 shrink-0" />
                  <span>Chauffeurs certifiés VTC avec licences Grande Remise</span>
                </li>
              </ul>

              <button
                id="home-cdg-cta"
                onClick={() => setCurrentTab('booking')}
                className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-semibold px-6 py-3 rounded-lg text-sm tracking-wider uppercase transition-colors"
              >
                <span>Réserver un transfert</span>
                <ArrowRight className="h-4 w-4 text-slate-950" />
              </button>
            </div>

            {/* Simulated interactive booking preview */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-video bg-slate-900 group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
              <img
                src="/src/assets/images/luxury_sedan_s_class_1782314709798.jpg"
                alt="Chauffeur Service Tunis"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-left">
                <span className="text-[10px] font-mono tracking-widest text-yellow-500 uppercase">Tunis-Carthage → The Residence Gammarth</span>
                <p className="text-white font-serif text-lg font-bold uppercase mt-1">À partir de 190 DT TTC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLIENT TESTIMONIALS CAROUSEL */}
      <section id="testimonials-section" className="bg-slate-900/30 py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-yellow-500">Témoignages</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide uppercase mt-2">
              L'Avis de nos Clients Prestigieux
            </h2>
            <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-800/60 flex flex-col justify-between hover:border-yellow-500/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex text-yellow-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm italic leading-relaxed">
                    "{test.text}"
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6 text-left">
                  <p className="text-white font-semibold text-sm">{test.name}</p>
                  <p className="text-yellow-500/70 font-mono text-[10px] uppercase tracking-wider mt-0.5">{test.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION CONTAINER */}
      <section id="footer-cta-section" className="bg-gradient-to-b from-slate-950 to-slate-900 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white mb-6">
            Commandez Votre Chauffeur Privé Dès Aujourd'hui
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Profitez de nos tarifs forfaitaires calculés au kilomètre sans surprise. Simple, rapide et 100% sécurisé.
          </p>
          <button
            id="last-cta-booking"
            onClick={() => setCurrentTab('booking')}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold uppercase rounded-lg tracking-wider transition-all duration-300 shadow-xl shadow-yellow-500/15 inline-flex items-center space-x-3 active:scale-95"
          >
            <CalendarDays className="h-5 w-5" />
            <span>Réserver en 3 clics</span>
          </button>
        </div>
      </section>
    </div>
  );
}
