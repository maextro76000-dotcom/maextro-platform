import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { intervenants, missions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Euro, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Facturation & Revenus — Espace Intervenant" };

function formatEuros(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export const dynamic = "force-dynamic";
export default async function FacturationIntervenantPage() {
  const { userId } = await auth();
  const intervenant = await db.query.intervenants.findFirst({
    where: eq(intervenants.clerkUserId, userId!),
  });

  const mesMissions = intervenant
    ? await db.query.missions.findMany({
        where: eq(missions.intervenantId, intervenant.id),
        orderBy: [desc(missions.dateDebut)],
        with: { evenement: true, poste: true },
      })
    : [];

  const terminees = mesMissions.filter((m) => m.statut === "passee" && m.statutPointage === "valide");
  const totalHeures = terminees.reduce((acc, m) => acc + parseFloat(m.heuresFacturables ?? "0"), 0);
  const totalBrut = terminees.reduce((acc, m) => acc + 0, 0);
  const enAttente = mesMissions.filter((m) => m.statut === "passee" && m.statutPointage !== "valide").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Facturation & Revenus</h1>
        <p className="text-gray-500 mt-1">Suivi de vos heures facturables et rémunérations</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
            <Euro size={20} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatEuros(totalBrut)}</p>
          <p className="text-sm text-gray-500 mt-1">Total brut validé</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
            <Clock size={20} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalHeures.toFixed(1)}h</p>
          <p className="text-sm text-gray-500 mt-1">Heures facturées</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp size={20} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{enAttente}</p>
          <p className="text-sm text-gray-500 mt-1">Missions en attente de validation</p>
        </div>
      </div>

      {/* Tableau des missions facturables */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Détail des prestations</h2>
        </div>
        {mesMissions.length === 0 ? (
          <div className="p-12 text-center">
            <Euro size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune prestation enregistrée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Événement</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Poste</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Heures</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Montant</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mesMissions.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{m.evenement?.nom ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{m.poste?.libelle ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(m.dateDebut).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {m.heuresFacturables ? `${m.heuresFacturables}h` : "—"}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {0 ? formatEuros(0) : "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        m.statutPointage === "valide"
                          ? "bg-green-100 text-green-700"
                          : m.statutPointage === "divergent"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {m.statutPointage === "valide" ? "Validé" :
                         m.statutPointage === "concordant" ? "Concordant" :
                         m.statutPointage === "divergent" ? "Divergent" : "En attente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <CheckCircle2 size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Les montants affichés sont bruts avant charges sociales. Le paiement est effectué après validation
          du rapprochement des heures par notre équipe.
        </p>
      </div>
    </div>
  );
}
