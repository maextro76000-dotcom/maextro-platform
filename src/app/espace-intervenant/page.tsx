import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { intervenants, missions } from "@/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { formatDate, formatEuros } from "@/lib/utils";
import Link from "next/link";
import { Briefcase, Calendar, Euro, Clock, ChevronRight, AlertCircle } from "lucide-react";

export const metadata = { title: "Tableau de bord — Espace Intervenant" };

export default async function IntervenantDashboard() {
  const { userId } = await auth();

  const intervenant = await db.query.intervenants.findFirst({
    where: eq(intervenants.clerkUserId, userId!),
  });

  const messMissions = intervenant
    ? await db.query.missions.findMany({
        where: eq(missions.intervenantId, intervenant.id),
        orderBy: [desc(missions.dateDebut)],
        limit: 5,
        with: { evenement: true, poste: true },
      })
    : [];

  const missionsAVenir = messMissions.filter((m) => m.statut === "a_venir").length;
  const missionsTerminees = messMissions.filter((m) => m.statut === "passee").length;
  const heuresTotal = messMissions
    .filter((m) => m.heuresFacturables)
    .reduce((acc, m) => acc + parseFloat(m.heuresFacturables ?? "0"), 0);

  const statutColors: Record<string, string> = {
    a_venir: "bg-blue-100 text-blue-700",
    en_cours: "bg-green-100 text-green-700",
    termine: "bg-gray-100 text-gray-600",
    annule: "bg-red-100 text-red-600",
  };

  const statutLabels: Record<string, string> = {
    a_venir: "À venir",
    en_cours: "En cours",
    termine: "Terminée",
    annule: "Annulée",
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Bonjour{intervenant ? `, ${intervenant.prenom}` : ""} 👋
        </h1>
        <p className="text-gray-500 mt-1">Voici un résumé de votre activité</p>
      </div>

      {/* Alerte validation si en attente */}
      {intervenant?.statutValidation === "en_attente" && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800 text-sm">Profil en cours de validation</p>
            <p className="text-yellow-700 text-sm mt-0.5">
              Notre équipe vérifie votre profil. Vous recevrez une confirmation sous 48h.
            </p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Missions à venir", value: missionsAVenir, icon: <Calendar size={20} className="text-blue-600" />, bg: "bg-blue-50" },
          { label: "Missions terminées", value: missionsTerminees, icon: <Briefcase size={20} className="text-green-600" />, bg: "bg-green-50" },
          { label: "Heures facturables", value: `${heuresTotal.toFixed(1)}h`, icon: <Clock size={20} className="text-purple-600" />, bg: "bg-purple-50" },
          { label: "Statut profil", value: intervenant?.statutValidation === "valide" ? "Validé ✓" : "En attente", icon: <Euro size={20} className="text-yellow-600" />, bg: "bg-yellow-50" },
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

      {/* Prochaines missions */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Mes prochaines missions</h2>
          <Link href="/espace-intervenant/missions" className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
            Voir tout <ChevronRight size={14} />
          </Link>
        </div>
        {messMissions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune mission pour le moment</p>
            <p className="text-gray-400 text-xs mt-1">Les missions vous seront assignées par notre équipe</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {messMissions.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{m.poste?.libelle ?? "Mission"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.evenement?.nom ?? "—"} · {formatDate(m.dateDebut)}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[m.statut] ?? "bg-gray-100 text-gray-600"}`}>
                  {statutLabels[m.statut] ?? m.statut}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/espace-intervenant/disponibilites", label: "Gérer mes disponibilités", icon: "📅" },
          { href: "/espace-intervenant/profil", label: "Compléter mon profil", icon: "👤" },
          { href: "/espace-intervenant/facturation", label: "Voir mes revenus", icon: "💰" },
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
