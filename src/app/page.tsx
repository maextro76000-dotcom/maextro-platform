import type { Metadata } from "next";
import Link from "next/link";

import {
  Star, Shield, Zap, Clock, ChevronRight, Phone, CheckCircle2, Quote
} from "lucide-react";

export const metadata: Metadata = {
  title: "Maextro — Agence de Staffing Événementiel à Rouen",
  description:
    "Maextro, agence de staffing événementiel à Rouen. Personnel qualifié pour vos événements, galas, traiteurs et restauration. Disponible 7j/7.",
};

const clients = [
  "Coca-Cola", "La Poste", "Porsche", "Stellantis", "Bouygues Telecom",
  "Leboncoin", "NEOMA Business School", "L'Oréal", "BNP Paribas", "Renault",
  "Orange", "Crédit Agricole", "Michelin", "Air France", "SNCF", "Décathlon",
];

const valeurs = [
  { titre: "Excellence", desc: "Chaque prestation est réalisée avec le plus grand soin et le souci du détail." },
  { titre: "Confiance", desc: "Des profils vérifiés, des engagements tenus, une relation durable." },
  { titre: "Engagement", desc: "Disponibles 7j/7, réactifs et impliqués dans la réussite de vos événements." },
];

const pourquoi = [
  { icon: <Star className="text-yellow-600" size={24} />, titre: "Culture du Service", desc: "Nos intervenants sont formés aux codes de l'excellence événementielle et du service haut de gamme." },
  { icon: <Shield className="text-yellow-600" size={24} />, titre: "Sélection rigoureuse", desc: "Chaque profil est validé par notre équipe : expérience, compétences et présentation vérifiées." },
  { icon: <Zap className="text-yellow-600" size={24} />, titre: "Profils Adaptés", desc: "Serveurs, hôtes, barmen, chefs de rang — le bon profil pour chaque poste et chaque événement." },
  { icon: <Clock className="text-yellow-600" size={24} />, titre: "Réactivité 7j/7", desc: "Une demande urgente ? Notre équipe est disponible 7 jours sur 7 pour répondre à vos besoins." },
];

const temoignages = [
  { nom: "Marie L.", poste: "Directrice événementiel, Grand Hôtel de Rouen", texte: "Maextro nous a fourni une équipe de serveurs impeccables pour notre gala annuel. Professionnalisme et réactivité au rendez-vous." },
  { nom: "Thomas B.", poste: "Responsable RH, Porsche Normandie", texte: "Nous faisons appel à Maextro depuis 3 ans pour tous nos événements corporate. La qualité est constante et le suivi exemplaire." },
  { nom: "Sophie M.", poste: "Chef de projet, NEOMA Business School", texte: "Des intervenants toujours ponctuels, bien présentés et à l'écoute. Maextro est devenu notre partenaire de confiance." },
];

const faqCandidats = [
  { q: "Comment rejoindre Maextro en tant qu'intervenant ?", r: "Créez votre compte, complétez votre profil avec vos expériences et compétences, puis notre équipe valide votre candidature sous 48h." },
  { q: "Quels types de missions sont disponibles ?", r: "Service en salle, bar, cuisine, accueil, hôtesses — des missions ponctuelles ou régulières dans toute la région normande." },
  { q: "Comment suis-je payé ?", r: "Après chaque mission validée, votre rémunération est calculée automatiquement selon la grille tarifaire et versée rapidement." },
];

const faqEntreprises = [
  { q: "Comment publier un besoin en personnel ?", r: "Créez votre espace entreprise, déclarez votre événement et les postes nécessaires. Notre équipe vous propose des profils sous 24h." },
  { q: "Quels sont vos délais d'intervention ?", r: "Nous pouvons répondre à des demandes urgentes sous 24h. Pour les événements planifiés, nous recommandons 5 à 7 jours à l'avance." },
  { q: "Comment fonctionne la facturation ?", r: "Une facture est générée automatiquement après chaque prestation, basée sur les heures pointées et validées des deux côtés." },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
          <p className="text-yellow-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Agence de Staffing Événementiel
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            MAEXTRO<br />
            <span className="text-yellow-400">Agence de Staffing</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Talents d&apos;exception pour vos événements. Votre agence dédiée aux métiers
            de l&apos;événementiel, du traiteur et de la restauration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            
              <Link
                href="/inscription"
                className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg text-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Rejoindre Maextro
              </Link>
            
            
              <Link
                href="/onboarding"
                className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg text-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Mon espace
              </Link>
            
            <a
              href="tel:0259161224"
              className="flex items-center gap-2 px-6 py-4 border-2 border-white/40 hover:border-white text-white font-semibold rounded-lg text-lg transition-all duration-200 hover:bg-white/10"
            >
              <Phone size={18} />
              02 59 16 12 24
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── BANDEAU CLIENTS ──────────────────────────────────────────────── */}
      <section className="py-10 bg-gray-50 border-y border-gray-200 overflow-hidden">
        <p className="text-center text-xs font-semibold text-gray-400 tracking-widest uppercase mb-6">
          Ils nous font confiance
        </p>
        <div className="flex overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...clients, ...clients].map((c, i) => (
              <span key={i} className="text-gray-400 font-semibold text-sm tracking-wide flex-shrink-0">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUEL EST VOTRE BESOIN ────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Notre offre</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-gray-900">
              Quel est votre besoin ?
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Candidats */}
            <div className="group relative overflow-hidden rounded-2xl bg-gray-900 text-white p-10 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-4">Pour vous</p>
              <h3 className="font-serif text-3xl font-bold mb-4">Candidats &amp; Professionnels</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Accédez à des missions certifiées dans l&apos;événementiel, le traiteur et la restauration.
                Inscription gratuite, profil validé, paiement sécurisé.
              </p>
              <ul className="space-y-2 mb-8">
                {["Missions sélectionnées", "Paiement rapide et sécurisé", "Communauté de professionnels"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-yellow-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/candidats"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors"
              >
                Trouver des missions <ChevronRight size={16} />
              </Link>
            </div>
            {/* Entreprises */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-yellow-200 p-10 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-50 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-yellow-600 text-xs font-semibold tracking-widest uppercase mb-4">Pour votre structure</p>
              <h3 className="font-serif text-3xl font-bold text-gray-900 mb-4">Organisateurs &amp; Agences</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Accédez instantanément à des profils validés pour vos événements.
                Gestion administrative simplifiée, réactivité immédiate.
              </p>
              <ul className="space-y-2 mb-8">
                {["Profils vérifiés et certifiés", "Gestion simplifiée des besoins", "Disponibilité 7j/7"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-yellow-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/entreprises"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
              >
                Recruter du personnel <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── À PROPOS ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-4">Notre histoire</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                L&apos;excellence au cœur de chaque prestation
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Née à Rouen, Maextro est l&apos;agence de staffing événementiel qui met l&apos;excellence
                au cœur de chaque prestation. Nous créons des ponts entre les meilleurs talents
                et les événements les plus exigeants.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {valeurs.map((v) => (
                  <div key={v.titre} className="text-center p-4 bg-white rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star size={18} className="text-yellow-600" />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{v.titre}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"
                  alt="Équipe Maextro en action"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-yellow-600 text-white rounded-2xl p-6 shadow-xl">
                <p className="font-serif text-3xl font-bold">500+</p>
                <p className="text-sm text-yellow-100">Talents certifiés</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POURQUOI MAEXTRO ─────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Nos atouts</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-gray-900">
              Pourquoi choisir Maextro ?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pourquoi.map((item) => (
              <div
                key={item.titre}
                className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIE ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Portfolio</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900">Nos réalisations</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80",
              "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
              "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
              "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80",
            ].map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src={src}
                  alt={`Réalisation Maextro ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/a-propos"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold rounded-lg transition-all duration-200"
            >
              Voir toutes nos réalisations <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-3">Avis clients</p>
            <h2 className="font-serif text-4xl font-bold text-white">Ce que disent nos clients</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {temoignages.map((t) => (
              <div key={t.nom} className="bg-gray-800 rounded-2xl p-8">
                <Quote size={32} className="text-yellow-600 mb-4" />
                <p className="text-gray-300 leading-relaxed mb-6 italic">&ldquo;{t.texte}&rdquo;</p>
                <div>
                  <p className="font-semibold text-white">{t.nom}</p>
                  <p className="text-sm text-gray-400">{t.poste}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Questions fréquentes</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900">FAQ</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xs">👤</span>
                Candidats
              </h3>
              <div className="space-y-4">
                {faqCandidats.map((item) => (
                  <details key={item.q} className="group border border-gray-200 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 text-sm">
                      {item.q}
                      <ChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                    </summary>
                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.r}</div>
                  </details>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xs">🏢</span>
                Entreprises
              </h3>
              <div className="space-y-4">
                {faqEntreprises.map((item) => (
                  <details key={item.q} className="group border border-gray-200 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 text-sm">
                      {item.q}
                      <ChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                    </summary>
                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.r}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-yellow-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">
            Prêt à rejoindre Maextro ?
          </h2>
          <p className="text-yellow-100 text-lg mb-8">
            Que vous soyez intervenant ou organisateur, créez votre compte gratuitement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="px-8 py-4 bg-white text-yellow-700 hover:bg-yellow-50 font-bold rounded-lg text-lg transition-colors"
            >
              Rejoindre Maextro
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white/60 hover:border-white text-white font-semibold rounded-lg text-lg transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
