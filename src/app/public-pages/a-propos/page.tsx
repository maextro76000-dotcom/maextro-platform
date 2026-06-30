import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "À Propos — Notre histoire et nos valeurs",
  description: "Découvrez l'histoire de Maextro, agence de staffing événementiel fondée à Rouen, ses valeurs et son équipe dédiée à l'excellence.",
};

const chiffres = [
  { valeur: "500+", label: "Talents certifiés" },
  { valeur: "200+", label: "Événements par an" },
  { valeur: "7j/7", label: "Disponibilité" },
  { valeur: "3 ans", label: "D'expérience" },
];

const equipe = [
  { nom: "Direction", role: "Fondateurs & Direction générale", initiales: "MX" },
  { nom: "Recrutement", role: "Équipe sélection & validation", initiales: "RH" },
  { nom: "Opérations", role: "Coordination & dispatch", initiales: "OP" },
];

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80')" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-4">Notre histoire</p>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6">
            À Propos de <span className="text-yellow-400">Maextro</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Née à Rouen, Maextro est l&apos;agence de staffing événementiel qui place
            l&apos;excellence humaine au cœur de chaque prestation.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-4">Notre mission</p>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                Créer des ponts entre les talents et les événements d&apos;exception
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Maextro est née d&apos;un constat simple : le secteur événementiel manquait d&apos;une
                agence de staffing vraiment spécialisée, capable de comprendre les exigences
                particulières des métiers de la table et de l&apos;accueil.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Basée à Rouen, nous intervenons dans toute la Normandie et au-delà, en mettant
                en relation des professionnels certifiés avec les événements les plus exigeants :
                galas, dîners d&apos;entreprise, cocktails, salons, congrès.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-yellow-600 font-semibold hover:text-yellow-700 transition-colors">
                Nous contacter <ChevronRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"
                  alt="Équipe Maextro"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 px-4 bg-yellow-600">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {chiffres.map((c) => (
              <div key={c.label}>
                <p className="font-serif text-4xl font-bold text-white mb-1">{c.valeur}</p>
                <p className="text-yellow-100 text-sm font-medium">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Ce qui nous guide</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { titre: "Excellence", desc: "Chaque prestation est réalisée avec le plus grand soin. Nous ne proposons que des profils qui correspondent à nos standards élevés de qualité.", icon: "⭐" },
              { titre: "Confiance", desc: "Des profils vérifiés, des engagements tenus, une relation durable. La confiance est le fondement de chaque collaboration avec nos clients et intervenants.", icon: "🤝" },
              { titre: "Engagement", desc: "Disponibles 7j/7, réactifs et impliqués dans la réussite de vos événements. Votre succès est notre priorité absolue.", icon: "💪" },
            ].map((v) => (
              <div key={v.titre} className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">{v.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Les équipes</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900">Qui sommes-nous ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipe.map((m) => (
              <div key={m.nom} className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-serif text-xl font-bold">{m.initiales}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{m.nom}</h3>
                <p className="text-sm text-gray-500">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
