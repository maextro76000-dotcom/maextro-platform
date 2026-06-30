import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, Shield, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Entreprises — Recrutez du personnel événementiel",
  description:
    "Maextro met à disposition des entreprises et agences événementielles des profils qualifiés et validés pour tous vos événements. Réactivité 7j/7.",
};

const services = [
  { titre: "Service en salle", desc: "Serveurs, maîtres d'hôtel, chefs de rang pour vos galas et dîners d'entreprise." },
  { titre: "Accueil & Hôtesses", desc: "Personnel d'accueil formé aux codes du service haut de gamme." },
  { titre: "Bar & Cocktail", desc: "Barmen et barmaid expérimentés pour animer vos soirées et cocktails." },
  { titre: "Cuisine & Traiteur", desc: "Commis, cuisiniers et pâtissiers pour renforcer vos équipes en cuisine." },
];

const etapes = [
  { num: "01", titre: "Créez votre espace", desc: "Inscrivez-vous gratuitement et créez le profil de votre entreprise en quelques minutes." },
  { num: "02", titre: "Déclarez votre événement", desc: "Renseignez les dates, le lieu et les postes nécessaires pour votre événement." },
  { num: "03", titre: "Recevez des profils", desc: "Notre équipe sélectionne et vous propose les meilleurs profils sous 24h." },
  { num: "04", titre: "Validez et c'est parti", desc: "Confirmez les intervenants, gérez le planning et suivez les prestations en temps réel." },
];

const avantages = [
  { icon: <Shield size={20} className="text-yellow-600" />, titre: "Profils 100% vérifiés", desc: "Chaque intervenant est validé par notre équipe avant d'être proposé." },
  { icon: <Clock size={20} className="text-yellow-600" />, titre: "Réponse sous 24h", desc: "Nous répondons à toutes les demandes dans les 24 heures ouvrées." },
  { icon: <Zap size={20} className="text-yellow-600" />, titre: "Urgences acceptées", desc: "Besoin de personnel en urgence ? Nous intervenons 7j/7." },
  { icon: <Users size={20} className="text-yellow-600" />, titre: "Pool de 500+ talents", desc: "Un vivier de profils qualifiés disponibles en Normandie et région parisienne." },
];

export default function EntreprisesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=80')" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-4">Espace Entreprises</p>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6">
            Recrutez le personnel<br />
            <span className="text-yellow-400">parfait pour vos événements</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Accédez instantanément à des profils validés pour vos galas, cocktails,
            dîners d&apos;entreprise et événements corporate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/inscription" className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg text-lg transition-all hover:scale-105 active:scale-95">
              Créer mon espace entreprise
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white/40 hover:border-white text-white font-semibold rounded-lg text-lg transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Nos prestations</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900">Des profils pour chaque besoin</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.titre} className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-yellow-600 font-bold text-lg">✦</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Comment ça marche</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900">Simple et rapide</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {etapes.map((e, i) => (
              <div key={e.num} className="relative text-center">
                {i < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] right-[-40%] h-px bg-yellow-200" />
                )}
                <div className="w-16 h-16 bg-yellow-600 text-white rounded-2xl flex items-center justify-center font-serif text-xl font-bold mx-auto mb-4 relative z-10">
                  {e.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{e.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-4">Pourquoi Maextro</p>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                Votre partenaire de confiance
              </h2>
              <div className="space-y-5">
                {avantages.map((a) => (
                  <div key={a.titre} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {a.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{a.titre}</p>
                      <p className="text-sm text-gray-500">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-10 text-white">
              <h3 className="font-serif text-2xl font-bold mb-6">Commencer maintenant</h3>
              <ul className="space-y-4 mb-8">
                {[
                  "Inscription gratuite en 2 minutes",
                  "Premier devis sous 24h",
                  "Aucun engagement à la première demande",
                  "Facturation simplifiée après prestation",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 size={18} className="text-yellow-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-colors"
              >
                Créer mon espace entreprise <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
