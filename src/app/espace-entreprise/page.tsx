import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { entreprises, evenements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Calendar, Users, FileText, ChevronRight, Plus, AlertCircle } from "lucide-react";

export const metadata = { title: "Tableau de bord — Espace Entreprise" };

const statutColors: Record<string, string> = {
  brouillon: "bg-gray-100 text-gray-600",
  publie: "bg-blue-100 text-blue-700",
  en_cours: "bg-green-100 text-green-700",
  termine: "bg-gray-100 text-gray-500",
  annule: "bg-red-100 text-red-600",
};

const statutLabels: Record<string, string> = {
  brouillon: "Brouillon",
  publie: "Publié",
  en_cours: "En cours",
  termine: "Terminé",
  annule: "Annulé",
};

export const dynamic = "force-dynamic";
export default async function EntrepriseDashboard() {
  const { orgId } = await auth();
  const entreprise = await db.query.entreprises.findFirst({
    where: eq(entreprises.clerkOrgId, orgId!),
  });

  const mesEvenements = entreprise
    ? await db.query.evenements.findMany({
        where: eq(evenements.entrepriseId, entreprise.id),
        orderBy: [desc(evenements.dateDebut)],
        limit: 5,
        with: { missions: true },
      })
    : [];

  const aVenir = mesEvenements.filter((e) => ["publie", "en_cours"].includes(e.statut)).length;
  const termines = mesEvenements.filter((e) => e.statut === "passe").length;
  const totalIntervenants = mesEvenements.reduce(
    (acc, e) => acc + e.missions.length,
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Bonjour{entreprise ? `, ${entreprise.raisonSociale}` : ""} 👋
          </h1>
          <p className="text-gray-500 mt-1">Gérez vos événements et vos équipes</p>
        </div>
        <Link
          href="/espace-entreprise/evenements/nouveau"
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nouvel événement
        </Link>
      </div>

      {/* Alerte profil incomplet */}
      {!entreprise?.siret && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800 text-sm">Profil incomplet</p>
            <p className="text-yellow-700 text-sm mt-0.5">
              Complétez votre profil entreprise pour accéder à toutes les fonctionnalités.{" "}
              <Link href="/espace-entreprise/profil" className="underline font-semibold">Compléter maintenant →</Link>
            </p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Événements actifs", value: aVenir, icon: <Calendar size={20} className="text-blue-600" />, bg: "bg-blue-50" },
          { label: "Intervenants mobilisés", value: totalIntervenants, icon: <Users size={20} className="text-green-600" />, bg: "bg-green-50" },
          { label: "Événements terminés", value: termines, icon: <FileText size={20} className="text-gray-500" />, bg: "bg-gray-50" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
              {kpi.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Derniers événements */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Mes événements récents</h2>
          <Link href="/espace-entreprise/evenements" className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
            Voir tout <ChevronRight size={14} />
          </Link>
        </div>
        {mesEvenements.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun événement créé</p>
            <Link href="/espace-entreprise/evenements/nouveau" className="inline-flex items-center gap-1 mt-3 text-sm text-yellow-600 font-semibold hover:text-yellow-700">
              <Plus size={14} /> Créer mon premier événement
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {mesEvenements.map((e) => (
              <Link
                key={e.id}
                href={`/espace-entreprise/evenements/${e.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 text-sm">{e.nom}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(e.dateDebut).toLocaleDateString("fr-FR")} · {e.lieu ?? "Lieu non défini"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{e.missions.length} poste(s)</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[e.statut] ?? "bg-gray-100 text-gray-600"}`}>
                    {statutLabels[e.statut] ?? e.statut}
                  </span>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/espace-entreprise/planning", label: "Voir le planning", icon: "📅" },
          { href: "/espace-entreprise/equipe", label: "Gérer l'équipe", icon: "👥" },
          { href: "/espace-entreprise/facturation", label: "Facturation", icon: "💳" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-yellow-200 hover:shadow-sm transition-all group"
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700 transition-colors">{link.label}</span>
            <ChevronRight size={14} className="text-gray-300 ml-auto group-hover:text-yellow-500 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
