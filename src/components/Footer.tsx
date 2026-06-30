import { Mail, Phone, MapPin, ShieldCheck, Award, Star } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-slate-950 border-t border-yellow-500/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand details & Trust */}
          <div id="footer-col-brand" className="space-y-6">
            <div>
              <span className="font-serif text-2xl font-bold tracking-widest text-white block uppercase">
                PRESTIGE
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-yellow-500 font-mono -mt-1 block">
                Chauffeur Service
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              Service de transport privé de luxe avec chauffeur de grande remise. Discrétion, excellence opérationnelle et confort absolu pour tous vos transferts.
            </p>
            <div className="flex items-center space-x-3 text-yellow-500/80">
              <ShieldCheck className="h-5 w-5 text-yellow-500" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300">Chauffeurs agréés VTC</span>
            </div>
          </div>

          {/* Column 2: Navigation links */}
          <div id="footer-col-nav" className="space-y-4">
            <h3 className="text-white text-xs font-bold tracking-[0.2em] uppercase font-serif pb-2 border-b border-slate-900">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm font-sans">
              {[
                { id: 'home', label: 'Accueil' },
                { id: 'services', label: 'Nos Services d\'Élite' },
                { id: 'about', label: 'Notre Maison' },
                { id: 'contact', label: 'Demande de Contact' },
                { id: 'booking', label: 'Réserver une Course' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setCurrentTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-yellow-400 hover:translate-x-1 transition-all duration-300 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact information */}
          <div id="footer-col-contact" className="space-y-4">
            <h3 className="text-white text-xs font-bold tracking-[0.2em] uppercase font-serif pb-2 border-b border-slate-900">
              Coordonnées
            </h3>
            <ul className="space-y-4 text-sm font-sans text-slate-400">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <span>Rue du Lac Léman, Les Berges du Lac 1, 1053 Tunis, Tunisie</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-500 shrink-0" />
                <a href="tel:+21671860111" className="hover:text-yellow-400 transition-colors">
                  +216 71 860 111
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-500 shrink-0" />
                <a href="mailto:contact@prestigecars-chauffeur.com" className="hover:text-yellow-400 transition-colors">
                  contact@prestigecars.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Rating */}
          <div id="footer-col-trust" className="space-y-6">
            <h3 className="text-white text-xs font-bold tracking-[0.2em] uppercase font-serif pb-2 border-b border-slate-900">
              Certifications & Avis
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <Award className="h-5 w-5 text-yellow-500 shrink-0" />
                <div className="text-xs font-sans">
                  <p className="text-white font-semibold">Chauffeur d'Élite 2026</p>
                  <p className="text-slate-400">Certifié Limousine Prestige Tunisie</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                  ))}
                </div>
                <div className="text-xs font-sans">
                  <p className="text-white font-semibold">Note 4.95 / 5.0</p>
                  <p className="text-slate-400">Basé sur 1,200+ avis vérifiés</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 text-center md:flex md:justify-between md:items-center text-xs text-slate-500 font-sans">
          <p>© {currentYear} Prestige Cars Chauffeur. Tous droits réservés.</p>
          <div className="flex justify-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-yellow-400 transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">CGV</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Politique de Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
