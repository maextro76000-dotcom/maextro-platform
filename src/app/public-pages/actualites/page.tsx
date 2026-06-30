import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Actualités — Le blog Maextro",
  description: "Retrouvez toutes les actualités de Maextro : conseils métier, tendances événementielles, nouveautés de la plateforme.",
};

const articles = [
  {
    id: 1,
    titre: "5 conseils pour réussir votre premier gala d'entreprise",
    categorie: "Conseils",
    date: "15 juin 2025",
    resume: "Organiser un gala d'entreprise demande une préparation minutieuse. Découvrez nos conseils pour garantir une soirée mémorable, du choix du personnel à la coordination des équipes.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
    vedette: true,
  },
  {
    id: 2,
    titre: "Comment devenir serveur événementiel certifié Maextro",
    categorie: "Intervenants",
    date: "8 juin 2025",
    resume: "Rejoindre Maextro, c'est intégrer une communauté de professionnels exigeants. Voici le parcours de certification et ce que nous attendons de nos intervenants.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    vedette: false,
  },
  {
    id: 3,
    titre: "Tendances 2025 : le service événementiel se réinvente",
    categorie: "Tendances",
    date: "1 juin 2025",
    resume: "Expériences immersives, service personnalisé, digitalisation du pointage — le secteur événementiel évolue rapidement. Maextro s'adapte.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    vedette: false,
  },
  {
    id: 4,
    titre: "Maextro s'étend en Île-de-France",
    categorie: "Actualités",
    date: "20 mai 2025",
    resume: "Après 3 ans de succès en Normandie, Maextro ouvre son activité en Île-de-France pour répondre à la demande croissante des organisateurs parisiens.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    vedette: false,
  },
  {
    id: 5,
    titre: "Le pointage à l'aveugle : une innovation pour plus de transparence",
    categorie: "Plateforme",
    date: "12 mai 2025",
    resume: "Notre nouveau système de pointage à l'aveugle garantit une objectivité totale dans le calcul des heures facturées. Explications.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    vedette: false,
  },
  {
    id: 6,
    titre: "Retour sur le Gala Porsche Normandie 2025",
    categorie: "Réalisations",
    date: "5 mai 2025",
    resume: "Maextro a mobilisé 24 intervenants pour le gala annuel de Porsche Normandie. Un événement d'exception qui illustre notre savoir-faire.",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80",
    vedette: false,
  },
];

const categories = ["Tous", "Conseils", "Intervenants", "Tendances", "Actualités", "Plateforme", "Réalisations"];

export default function ActualitesPage() {
  const vedette = articles.find((a) => a.vedette);
  const autres = articles.filter((a) => !a.vedette);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Le blog</p>
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">Actualités Maextro</h1>
          <p className="text-gray-500 text-lg">
            Conseils, tendances et nouveautés de l&apos;agence de staffing événementiel.
          </p>
        </div>
      </section>

      {/* Filtres catégories */}
      <section className="py-6 px-4 border-b border-gray-200 bg-white sticky top-16 lg:top-20 z-30">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                cat === "Tous"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Article vedette */}
          {vedette && (
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[16/9] lg:aspect-auto overflow-hidden">
                  <img
                    src={vedette.image}
                    alt={vedette.titre}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">{vedette.categorie}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">À la une</span>
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4 leading-tight">{vedette.titre}</h2>
                  <p className="text-gray-500 leading-relaxed mb-6">{vedette.resume}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} />
                      {vedette.date}
                    </div>
                    <Link href={`/actualites/${vedette.id}`} className="inline-flex items-center gap-1 text-yellow-600 font-semibold text-sm hover:text-yellow-700 transition-colors">
                      Lire l&apos;article <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grille articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {autres.map((article) => (
              <article key={article.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{article.categorie}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={11} /> {article.date}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-yellow-700 transition-colors">
                    {article.titre}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{article.resume}</p>
                  <Link href={`/actualites/${article.id}`} className="inline-flex items-center gap-1 text-yellow-600 font-semibold text-sm hover:text-yellow-700 transition-colors">
                    Lire la suite <ChevronRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
