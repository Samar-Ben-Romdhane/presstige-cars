import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck, Star } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div id="contact-page-container" className="text-white font-sans bg-slate-950 min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-yellow-500">Demande d'Information</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide uppercase mt-2">
            Nous Contacter
          </h1>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4" />
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-6">
            Notre service client haut de gamme est disponible pour répondre à toutes vos demandes de devis sur-mesure ou partenariats corporate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Left Side: Contact Information and Map */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wide">Prestige Cars</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Notre secrétariat général vous accueille au cœur du quartier des Berges du Lac de Tunis. Pour toute urgence opérationnelle ou modification de course immédiate, merci de privilégier l'appel téléphonique.
              </p>
            </div>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="absolute-icon h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Siège Social</span>
                  <span className="text-slate-400 text-xs">Rue du Lac Léman, Les Berges du Lac 1, 1053 Tunis, Tunisie</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="absolute-icon h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Téléphone Conciergerie (24/7)</span>
                  <a href="tel:+21671860111" className="text-slate-400 hover:text-yellow-400 transition-colors text-xs">
                    +216 71 860 111
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="absolute-icon h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Administration / Devis</span>
                  <a href="mailto:contact@prestigecars-chauffeur.com" className="text-slate-400 hover:text-yellow-400 transition-colors text-xs">
                    contact@prestigecars.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="absolute-icon h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Engagement de Réponse</span>
                  <span className="text-slate-400 text-xs">Nous répondons à vos demandes écrites sous 2 heures maximum.</span>
                </div>
              </li>
            </ul>

            {/* Simulated beautiful Leaflet/Google map representation */}
            <div id="simulated-map-element" className="relative rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase font-mono tracking-widest text-[10px]">Flagship Tunis</span>
                <span className="text-emerald-400 flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                  <span>En ligne</span>
                </span>
              </div>
              <div className="h-40 rounded bg-slate-950 border border-slate-850 relative overflow-hidden flex items-center justify-center">
                {/* Beautiful custom layout schematic representing map */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#facc15_1.2px,transparent_1.2px)] [background-size:16px_16px]" />
                <div className="absolute h-px w-full bg-slate-800 top-1/2" />
                <div className="absolute w-px h-full bg-slate-800 left-1/3" />
                <div className="absolute w-px h-full bg-slate-800 left-2/3" />
                
                {/* Simulated Vendome columns and pointer */}
                <div className="relative z-10 text-center space-y-1 bg-slate-950/90 py-2.5 px-4 rounded-lg border border-yellow-500/10 shadow-lg">
                  <MapPin className="h-5 w-5 text-yellow-500 mx-auto animate-bounce" />
                  <p className="text-[10px] text-white font-mono uppercase tracking-wide">Les Berges du Lac</p>
                  <p className="text-[8px] text-slate-500">Latitude: 36.8324 | Longitude: 10.2375</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Message form */}
          <div className="lg:col-span-7 bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-800/80">
            <div className="border-l-2 border-yellow-500 pl-4 mb-6">
              <h3 className="font-serif text-xl font-bold uppercase text-white">Formulaire de Contact</h3>
              <p className="text-slate-400 text-xs">Transmettez-nous vos requêtes spécifiques pour étude personnalisée.</p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-center space-y-3.5">
                <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto" />
                <h4 className="text-white font-semibold text-base uppercase">Message Envoyé Avec Succès !</h4>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Nous vous remercions pour votre intérêt. Un conseiller Prestige Cars prendra contact avec vous dans les plus brefs délais.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-yellow-500 text-xs font-semibold rounded border border-yellow-500/10 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-yellow-500 font-semibold">Nom Complet</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="M. Prénom Nom"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-yellow-500 font-semibold">Téléphone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+216 2• ••• •••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-yellow-500 font-semibold">Adresse Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adresse@email.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-yellow-500 font-semibold">Votre Message</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Indiquez ici les détails de vos besoins (évènementiel, mariage, navettes régulières, partenariat d'entreprise, options de facturation spécifiques...)"
                    rows={5}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase rounded-lg tracking-wider transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 text-slate-950" />
                        <span>Envoyer la Demande</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
