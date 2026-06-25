import { db } from "@/db";
import { missions, pointages } from "@/db/schema";
import { eq, or, inArray } from "drizzle-orm";
import Link from "next/link";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import RapprochementActions from "./RapprochementActions";

export const metadata = { title: "Rapprochement des heures — Admin Maextro" };

export default async function RapprochementPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut } = await searchParams;

  // Récupérer les missions avec pointages divergents ou concordants
  const touteMissions = await db.query.missions.findMany({
    where: or(
      eq(missions.statutPointage, "divergent"),
      eq(missions.statutPointage, "concordant"),
      eq(missions.statutPointage, "valide"),
    ),
    orderBy: (m, { desc }) => [desc(m.updatedAt)],
    with: {
      evenement: true,
      poste: true,
      intervenant: true,
      pointages: true,
    },
  });

  const filtered = statut
    ? touteMissions.filter((m) => m.statutPointage === statut)
    : touteMissions;

  const counts = {
    tous: touteMissions.length,
    divergent: touteMissions.filter((m) => m.statutPointage === "divergent").length,
    concordant: touteMissions.filter((m) => m.statutPointage === "concordant").length,
    valide: touteMissions.filter((m) => m.statutPointage === "valide").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Rapprochement des heures</h1>
        <p className="text-gray-400 mt-1">Vérifiez et arbitrez les pointages intervenants vs établissements</p>
      </div>

      {/* Explication */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
        <h3 className="text-blue-400 font-semibold text-sm mb-2">Comment fonctionne le rapprochement ?</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Chaque intervenant pointe son arrivée et son départ <strong className="text-white">à l&apos;aveugle</strong> (sans voir les heures saisies par l&apos;établissement).
          Le système compare automatiquement les deux pointages. Si l&apos;écart est inférieur au seuil configuré (défaut : 15 min), la mission est validée automatiquement.
          Au-delà, elle passe en statut <span className="text-red-400 font-medium">Divergent</span> et requiert un arbitrage admin.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.tous, color: "text-white", bg: "bg-gray-800" },
          { label: "Divergents", value: counts.divergent, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Concordants", value: counts.concordant, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Validés", value: counts.valide, color: "text-green-400", bg: "bg-green-500/10" },
        ].map((k) => (
          <div key={k.label} className={`${k.bg} rounded-xl border border-gray-800 p-4`}>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: "Tous" },
          { value: "divergent", label: "Divergents" },
          { value: "concordant", label: "Concordants" },
          { value: "valide", label: "Validés" },
        ].map((f) => (
          <Link
            key={f.value}
            href={`/admin/rapprochement${f.value ? `?statut=${f.value}` : ""}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              (statut ?? "") === f.value
                ? "bg-yellow-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Liste des missions */}
      <div className="space-y-3">
        {filtered.map((m) => {
          const ptIntervenant = m.pointages.find((p) => p.source === "intervenant");
          const ptEtablissement = m.pointages.find((p) => p.source === "etablissement");

          return (
            <div key={m.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        m.statutPointage === "divergent"
                          ? "bg-red-500/20 text-red-400"
                          : m.statutPointage === "valide"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {m.statutPointage === "divergent"
                        ? "Divergent"
                        : m.statutPointage === "valide"
                        ? "Validé"
                        : "Concordant"}
                    </span>
                    {m.ecartMinutes && m.ecartMinutes > 0 && (
                      <span className="text-xs text-red-400 font-medium flex items-center gap-1">
                        <AlertTriangle size={12} /> Écart de {m.ecartMinutes} min
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-white">
                    {m.intervenant?.prenom} {m.intervenant?.nom}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {m.evenement?.nom} · {m.poste?.libelle}
                  </p>

                  {/* Tableau de comparaison des pointages */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        Pointage Intervenant
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Arrivée</span>
                          <span className="text-white font-medium">
                            {ptIntervenant?.heureArrivee
                              ? new Date(ptIntervenant.heureArrivee).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Départ</span>
                          <span className="text-white font-medium">
                            {ptIntervenant?.heureDepart &&
                            ptIntervenant.heureDepart.getTime() !== ptIntervenant.heureArrivee.getTime()
                              ? new Date(ptIntervenant.heureDepart).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </span>
                        </div>
                        {ptIntervenant?.pauseMinutes ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Pause</span>
                            <span className="text-white font-medium">{ptIntervenant.pauseMinutes} min</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        Pointage Établissement
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Arrivée</span>
                          <span className="text-white font-medium">
                            {ptEtablissement?.heureArrivee
                              ? new Date(ptEtablissement.heureArrivee).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Départ</span>
                          <span className="text-white font-medium">
                            {ptEtablissement?.heureDepart &&
                            ptEtablissement.heureDepart.getTime() !== ptEtablissement.heureArrivee.getTime()
                              ? new Date(ptEtablissement.heureDepart).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </span>
                        </div>
                        {ptEtablissement?.pauseMinutes ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Pause</span>
                            <span className="text-white font-medium">{ptEtablissement.pauseMinutes} min</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Heures facturables si concordant/validé */}
                  {m.heuresFacturables && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-gray-400">Heures facturables :</span>
                      <span className="text-yellow-400 font-semibold text-sm">{m.heuresFacturables}h</span>
                    </div>
                  )}
                </div>

                {/* Actions arbitrage */}
                {m.statutPointage === "divergent" && (
                  <RapprochementActions missionId={m.id} />
                )}
                {(m.statutPointage === "valide" || m.statutPointage === "concordant") && (
                  <div className="flex items-center gap-2 text-green-400 text-sm flex-shrink-0">
                    <CheckCircle2 size={16} />
                    <span className="font-medium">
                      {m.statutPointage === "concordant" ? "Concordant" : "Validé"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <Clock size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun pointage dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
}
