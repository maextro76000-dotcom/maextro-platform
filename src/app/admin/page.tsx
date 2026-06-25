import { db } from "@/db";
import { intervenants, entreprises, evenements, missions, factures } from "@/db/schema";
import { eq, count, sum, gte } from "drizzle-orm";
import Link from "next/link";
import { Users, Building2, CalendarDays, Euro, Clock, AlertTriangle, ChevronRight, TrendingUp } from "lucide-react";

export const metadata = { title: "Tableau de bord Admin — Maextro" };

function formatEuros(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function AdminDashboard() {
  const [
    totalIntervenants,
    intervenantsEnAttente,
    totalEntreprises,
    totalEvenements,
    evenementsEnCours,
    missionsDivergentes,
    totalFacture,
  ] = await Promise.all([
    db.select({ count: count() }).from(intervenants),
    db.select({ count: count() }).from(intervenants).where(eq(intervenants.statutValidation, "en_attente")),
    db.select({ count: count() }).from(entreprises),
    db.select({ count: count() }).from(evenements),
    db.select({ count: count() }).from(evenements).where(eq(evenements.statut, "en_cours")),
    db.select({ count: count() }).from(missions).where(eq(missions.statutPointage, "divergent")),
    db.select({ total: sum(factures.montantTtc) }).from(factures).where(eq(factures.statutPaiement, "paye")),
  ]);

  const kpis = [
    {
      label: "Intervenants", value: totalIntervenants[0]?.count ?? 0,
      sub: `${intervenantsEnAttente[0]?.count ?? 0} en attente`,
      icon: <Users size={20} className="text-blue-400" />, bg: "bg-blue-500/10",
      href: "/admin/intervenants",
      alert: (intervenantsEnAttente[0]?.count ?? 0) > 0,
    },
    {
      label: "Entreprises", value: totalEntreprises[0]?.count ?? 0,
      sub: "clients actifs",
      icon: <Building2 size={20} className="text-purple-400" />, bg: "bg-purple-500/10",
      href: "/admin/entreprises",
    },
    {
      label: "Événements", value: totalEvenements[0]?.count ?? 0,
      sub: `${evenementsEnCours[0]?.count ?? 0} en cours`,
      icon: <CalendarDays size={20} className="text-green-400" />, bg: "bg-green-500/10",
      href: "/admin/evenements",
    },
    {
      label: "Pointages divergents", value: missionsDivergentes[0]?.count ?? 0,
      sub: "à arbitrer",
      icon: <Clock size={20} className="text-red-400" />, bg: "bg-red-500/10",
      href: "/admin/rapprochement",
      alert: (missionsDivergentes[0]?.count ?? 0) > 0,
    },
    {
      label: "CA facturé", value: formatEuros(parseInt(String(totalFacture[0]?.total ?? 0))),
      sub: "total réglé",
      icon: <Euro size={20} className="text-yellow-400" />, bg: "bg-yellow-500/10",
      href: "/admin/facturation",
    },
  ];

  const derniersMissions = await db.query.missions.findMany({
    where: eq(missions.statutPointage, "divergent"),
    limit: 5,
    with: { evenement: true, poste: true, intervenant: true },
  });

  const derniersIntervenants = await db.query.intervenants.findMany({
    where: eq(intervenants.statutValidation, "en_attente"),
    limit: 5,
    orderBy: (i, { desc }) => [desc(i.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Tableau de bord</h1>
        <p className="text-gray-400 mt-1">Vue d&apos;ensemble de la plateforme Maextro</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}
            className="relative bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-yellow-600/50 transition-all group">
            {kpi.alert && (
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
            <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
              {kpi.icon}
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{kpi.label}</p>
            <p className="text-xs text-gray-600 mt-0.5">{kpi.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pointages divergents */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" />
              Pointages divergents
            </h2>
            <Link href="/admin/rapprochement" className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
              Voir tout <ChevronRight size={12} />
            </Link>
          </div>
          {derniersMissions.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 text-sm">Aucun pointage divergent</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {derniersMissions.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {m.intervenant?.prenom} {m.intervenant?.nom}
                    </p>
                    <p className="text-xs text-gray-500">{m.evenement?.nom} · {m.poste?.libelle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.ecartMinutes && (
                      <span className="text-xs text-red-400 font-medium">Écart {m.ecartMinutes} min</span>
                    )}
                    <Link href={`/admin/rapprochement/${m.id}`}
                      className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-colors">
                      Arbitrer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Intervenants en attente */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Users size={16} className="text-yellow-400" />
              Profils en attente de validation
            </h2>
            <Link href="/admin/intervenants" className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
              Voir tout <ChevronRight size={12} />
            </Link>
          </div>
          {derniersIntervenants.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 text-sm">Aucun profil en attente</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {derniersIntervenants.map((i) => (
                <div key={i.id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-400 text-xs font-bold">
                        {i.prenom?.[0]}{i.nom?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{i.prenom} {i.nom}</p>
                      <p className="text-xs text-gray-500">{i.telephone ?? i.clerkUserId}</p>
                    </div>
                  </div>
                  <Link href={`/admin/intervenants/${i.id}`}
                    className="px-2.5 py-1 bg-yellow-600/10 text-yellow-400 text-xs font-medium rounded-lg hover:bg-yellow-600/20 transition-colors">
                    Valider
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/evenements", label: "Dispatch événements", icon: "🎯" },
          { href: "/admin/planning", label: "Planning global", icon: "📅" },
          { href: "/admin/facturation", label: "Émettre des factures", icon: "💳" },
          { href: "/admin/parametres", label: "Grille tarifaire", icon: "⚙️" },
        ].map((link) => (
          <Link key={link.href} href={link.href}
            className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-yellow-600/50 transition-all group">
            <span className="text-xl">{link.icon}</span>
            <span className="text-xs font-medium text-gray-400 group-hover:text-yellow-400 transition-colors">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
