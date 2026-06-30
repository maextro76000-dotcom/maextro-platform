import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Candidats — Trouvez des missions événementielles",
  description:
    "Rejoignez Maextro et accédez à des missions certifiées dans l'événementiel, le traiteur et la restauration. Inscription gratuite, paiement sécurisé.",
};

const metiers = [
  { titre: "Directeur de réception", desc: "Pilotez l'ensemble d'un service événementiel de prestige." },
  { titre: "Maître d'hôtel / Chef", desc: "Encadrez les équipes et garantissez la qualité du service." },
  { titre: "MDH / Second", desc: "Secondez le maître d'hôtel et assurez la fluidité du service." },
  { titre: "Chef de rang / Partie", desc: "Gérez votre rang avec professionnalisme et précision." },
  { titre: "Serveur(se) / Cuisinier", desc: "Assurez le service en salle ou la production en cuisine." },
  { titre: "Commis (Salle / Cuisine)", desc: "Débutez votre carrière dans les plus beaux établissements." },
  { titre: "Pâtissier(ère)", desc: "Exprimez votre créativité dans des événements d'exception." },
  { titre: "Hôte(sse)", desc: "Incarnez l'image de marque de nos clients les plus exigeants." },
];

const etapes = [
  { num: "01", titre: "Créez votre profil", desc: "Inscrivez-vous gratuitement, renseignez vos expériences et compétences." },
  { num: "02", titre: "Validation Maextro", desc: "Notre équipe valide votre profil sous 48h et vous certifie." },
  { num: "03", titre: "Recevez des missions", desc: "Consultez les missions disponibles et postulez en un clic." },
  { num: "04", titre: "Pointez et soyez payé", desc: "Pointez vos arrivées/départs, votre rémunération est calculée automatiquement." },
];

const avantages = [
  "Missions sélectionnées dans des établissements de prestige",
  "Paiement rapide et sécurisé après chaque prestation",
  "Planning flexible selon vos disponibilités",
  "Accompagnement et montée en compétences",
  "Communauté de professionnels de l'événementiel",
  "Application mobile pour gérer vos missions",
];

export default function CandidatsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80')" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-4">Espace Candidats</p>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6">
            Trouvez des missions<br />
            <span className="text-yellow-400">à la hauteur de votre talent</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Rejoignez la communauté Maextro et accédez aux plus beaux événements
            de Normandie et d&apos;Île-de-France.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/inscription" className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg text-lg transition-all hover:scale-105 active:scale-95">
              Rejoindre Maextro
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white/40 hover:border-white text-white font-semibold rounded-lg text-lg transition-colors">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Processus</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900">Comment ça marche ?</h2>
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

      {/* Métiers */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Nos postes</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900">Les métiers que nous recrutons</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metiers.map((m) => (
              <div key={m.titre} className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all duration-300">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-yellow-200 transition-colors">
                  <span className="text-yellow-600 text-sm font-bold">✦</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{m.titre}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-4">Vos avantages</p>
              <h2 className="font-serif text-4xl font-bold text-white mb-8">
                Pourquoi choisir Maextro ?
              </h2>
              <ul className="space-y-4">
                {avantages.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 size={18} className="text-yellow-400 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-10">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Prêt à commencer ?</h3>
              <p className="text-gray-500 text-sm mb-6">Inscription gratuite, validation sous 48h.</p>
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-colors"
              >
                Créer mon profil intervenant <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
