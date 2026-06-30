import { Award, ShieldCheck, Heart, Users, MapPin, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div id="about-page-container" className="text-white font-sans bg-slate-950 min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-yellow-500">Maison d'Excellence</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide uppercase mt-2">
            Notre Maison
          </h1>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4" />
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-6">
            Prestige Cars perpétue la tradition du service de grande remise à la française, associant rigueur logistique et sens absolu du détail.
          </p>
        </div>

        {/* Brand values / Core values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6 text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase text-white leading-tight">
              Une Tradition d'Excellence <br />
              Depuis plus d'une décennie
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Fondée à Paris, Prestige Cars est née de la volonté d'offrir un service de chauffeur privé qui surpasse les standards de l'industrie. Spécialisée à l'origine dans l'accompagnement des dirigeants de la finance et de la haute couture, notre maison s'est développée pour devenir un acteur incontournable de la grande remise en France.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Chacun de nos chauffeurs est minutieusement sélectionné pour son professionnalisme, sa parfaite connaissance des itinéraires parisiens et son sens inné du service client. Nos véhicules, tous issus des plus grandes signatures allemandes et britanniques, sont renouvelés tous les 18 mois pour vous garantir une sécurité technologique et un confort d'assise absolu.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-3">
              <Award className="h-8 w-8 text-yellow-500 mx-auto" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Chauffeurs Agrées</h3>
              <p className="text-xs text-slate-400">Titulaire de la carte professionnelle VTC Grande Remise.</p>
            </div>
            
            <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-3">
              <ShieldCheck className="h-8 w-8 text-yellow-500 mx-auto" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Sécurité Maximale</h3>
              <p className="text-xs text-slate-400">Assurance responsabilité civile illimitée pour le transport de voyageurs.</p>
            </div>

            <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-3">
              <Sparkles className="h-8 w-8 text-yellow-500 mx-auto" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Prestige Élite</h3>
              <p className="text-xs text-slate-400">Véhicules sur-équipés avec eau fraîche, tablettes et conciergerie.</p>
            </div>

            <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-3">
              <Users className="h-8 w-8 text-yellow-500 mx-auto" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Service 24/7</h3>
              <p className="text-xs text-slate-400">Une assistance opérationnelle réactive prête à modifier vos trajets à tout moment.</p>
            </div>
          </div>
        </div>

        {/* Company certifications */}
        <div id="about-certs-panel" className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-left max-w-4xl mx-auto space-y-6">
          <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3">
            Nos Engagements & Certifications Professionnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold uppercase text-[10px] tracking-wider mb-1">Licence Ministérielle VTC</p>
                <p>Enregistré au registre des exploitants de voitures de transport avec chauffeur sous le numéro EVTC-075210042.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheck className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold uppercase text-[10px] tracking-wider mb-1">Responsabilité Civile Professionnelle</p>
                <p>Couverture multirisque intégrale souscrite auprès d'AXA Assurances pour la protection absolue de nos passagers et de leurs bagages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
