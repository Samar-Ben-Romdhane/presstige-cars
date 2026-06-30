import { Users, Briefcase, Wifi, Coffee, Calendar, HelpCircle, Check, Sparkles } from 'lucide-react';

interface ServicesProps {
  setCurrentTab: (tab: string) => void;
}

export default function Services({ setCurrentTab }: ServicesProps) {
  const categories = [
    {
      id: 'sedan',
      title: 'Sedan Luxe',
      model: 'Mercedes-Benz Classe S Limousine',
      image: '/src/assets/images/luxury_sedan_s_class_1782314709798.jpg',
      passenger: '2-3',
      luggage: '3',
      rate: '150 DT / H',
      kmRate: '3.50 DT / Km',
      desc: 'Le fleuron mondial du transport d\'affaires et diplomatique. Alliant une insonorisation acoustique absolue, une suspension pneumatique de premier ordre et des finitions intérieures en cuir précieux, la Classe S est le salon idéal pour voyager sereinement ou travailler entre vos rendez-vous.',
      amenities: ['WiFi 5G illimité', 'Sélection d\'Eaux de Source Safia / Sabrine', 'Tablette tactile iPad Pro', 'Chargeurs multimarques à induction', 'Climatisation active filtrée', 'Presse nationale & internationale']
    },
    {
      id: 'suv',
      title: 'SUV Prestige',
      model: 'Range Rover Autobiography LWB',
      image: '/src/assets/images/prestige_suv_black_1782314726642.jpg',
      passenger: '3-4',
      luggage: '4',
      rate: '200 DT / H',
      kmRate: '4.50 DT / Km',
      desc: 'Prenez de la hauteur avec notre Range Rover Châssis Long (LWB). Parfait pour les voyages longue distance et les conditions météo exigeantes, ce SUV ultra-exclusif offre une habitabilité record pour les jambes, un toit panoramique ouvrant et un coffre spacieux pour vos malles et bagages lourds.',
      amenities: ['Châssis long Ultra-Espace', 'Toit vitré panoramique', 'WiFi 5G Haut Débit', 'Compartiment réfrigéré à bord', 'Insonorisation acoustique premium', 'Guide touristique local bilingue']
    },
    {
      id: 'van',
      title: 'Van Business',
      model: 'Mercedes-Benz Classe V Luxe Extra-Long',
      image: '/src/assets/images/business_van_v_class_1782314742231.jpg',
      passenger: '5-7',
      luggage: '7',
      rate: '250 DT / H',
      kmRate: '5.50 DT / Km',
      desc: 'Le transport de groupe d\'affaires sans compromis. Grâce à sa configuration exclusive en "Salon Face-à-Face", la Classe V permet de tenir des réunions professionnelles improvisées, d\'accueillir des délégations officielles ou de voyager confortablement en famille avec un volume de bagages XXL.',
      amenities: ['Salon de réunion amovible', 'Prises électriques 220V', 'WiFi Multi-connexions Pro', 'Portes coulissantes électriques', 'Climatisation automatique tri-zone', 'Capacité de bagages surdimensionnée']
    }
  ];

  return (
    <div id="services-page-container" className="text-white font-sans bg-slate-950 min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-yellow-500">Notre Flotte & Offres</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide uppercase mt-2">
            La Flotte Prestige Cars
          </h1>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4" />
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-6">
            Découvrez nos catégories de véhicules d'exception. Chaque véhicule est configuré sur-mesure et révisé quotidiennement.
          </p>
        </div>

        {/* Categories Showcase */}
        <div className="space-y-24">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              id={`service-row-${cat.id}`}
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image box */}
              <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative aspect-video bg-slate-900 group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 z-20 bg-yellow-500 text-slate-950 font-mono text-xs font-bold px-3 py-1.5 rounded shadow">
                  Tarif: {cat.kmRate}
                </div>
              </div>

              {/* Text specifications */}
              <div className="w-full lg:w-1/2 text-left space-y-6">
                <div className="flex items-center space-x-2 text-yellow-500 font-mono text-xs uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  <span>PRESTIGE {cat.title.toUpperCase()}</span>
                </div>
                
                <h2 className="font-serif text-3xl font-bold uppercase text-white leading-tight">
                  {cat.model}
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {cat.desc}
                </p>

                {/* Capacity pills */}
                <div className="grid grid-cols-2 gap-4 border-y border-slate-900 py-4 text-sm text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-yellow-500 shrink-0" />
                    <span>Capacité de {cat.passenger} Passagers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-yellow-500 shrink-0" />
                    <span>Jusqu'à {cat.luggage} Bagages soute</span>
                  </div>
                </div>

                {/* Amenities checklist */}
                <div className="space-y-2.5 text-xs text-slate-400">
                  <span className="block font-mono text-yellow-500 uppercase tracking-widest text-[10px] mb-3">Équipements Inclus à Bord:</span>
                  <div className="grid grid-cols-2 gap-3">
                    {cat.amenities.map((am) => (
                      <div key={am} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{am}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <button
                    id={`service-cta-${cat.id}`}
                    onClick={() => setCurrentTab('booking')}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-850 text-yellow-400 border border-yellow-500/20 hover:border-yellow-500 text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-300"
                  >
                    Réserver en catégorie {cat.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Pricing structure detail */}
        <div id="pricing-policy-panel" className="mt-28 p-8 md:p-10 bg-slate-900/40 rounded-2xl border border-slate-800 text-left space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 text-yellow-500">
            <HelpCircle className="h-6 w-6 shrink-0" />
            <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-white">
              Comment nos tarifs sont-ils calculés ?
            </h3>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Chez Prestige Cars, nous croyons en une tarification transparente et sans frais dissimulés. Les tarifs indiqués lors de votre devis de réservation sont fermes et garantis, indépendamment des embouteillages ou conditions de trafic.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 pt-2 font-sans">
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-850">
              <span className="block font-bold text-yellow-500 uppercase tracking-wide mb-1.5">Forfait Kilométrique</span>
              <span>Calculé sur l'itinéraire le plus rapide via notre simulateur de cartographie. Le prix par km varie de 3.50 DT à 5.50 DT selon le modèle.</span>
            </div>
            
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-850">
              <span className="block font-bold text-yellow-500 uppercase tracking-wide mb-1.5">Mise à Disposition</span>
              <span>Pour vos événements ou shopping, louez un véhicule de luxe à l'heure avec kilométrage inclus. Minimum requis de 3 heures.</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-850">
              <span className="block font-bold text-yellow-500 uppercase tracking-wide mb-1.5">Périodes Peak</span>
              <span>Une majoration de 25% est appliquée lors des heures de pointe (08:00 - 09:30, 17:00 - 19:30) ou pour les trajets nocturnes complexes.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
