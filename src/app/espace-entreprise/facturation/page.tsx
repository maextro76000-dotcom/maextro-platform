import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { entreprises, missions, factures } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { FileText, Euro, Clock, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Facturation — Espace Entreprise" };

function formatEuros(val: string | number | null) {
  if (val === null || val === undefined) return "—";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(num);
}

const statutColors: Record<string, string> = {
  en_attente: "bg-yellow-100 text-yellow-700",
  paye: "bg-green-100 text-green-700",
  en_retard: "bg-red-100 text-red-600",
  annule: "bg-gray-100 text-gray-400",
};

const statutLabels: Record<string, string> = {
  en_attente: "En attente",
  paye: "Payée",
  en_retard: "En retard",
  annule: "Annulée",
};

export const dynamic = "force-dynamic";
export default async function FacturationEntreprisePage() {
  const { orgId } = await auth();
  const entreprise = await db.query.entreprises.findFirst({
    where: eq(entreprises.clerkOrgId, orgId!),
  });

  const mesMissions = entreprise
    ? await db.query.missions.findMany({
        where: eq(missions.entrepriseId, entreprise.id),
        columns: { id: true },
      })
    : [];

  const missionIds = mesMissions.map((m) => m.id);

  const mesFactures =
    missionIds.length > 0
      ? await db.query.factures.findMany({
          where: inArray(factures.missionId, missionIds),
          orderBy: [desc(factures.dateEmission)],
          with: { mission: { with: { evenement: true, poste: true } } },
        })
      : [];

  const totalPaye = mesFactures
    .filter((f) => f.statutPaiement === "paye")
    .reduce((acc, f) => acc + parseFloat(f.montantTtc ?? "0"), 0);
  const totalEnAttente = mesFactures
    .filter((f) => f.statutPaiement === "en_attente")
    .reduce((acc, f) => acc + parseFloat(f.montantTtc ?? "0"), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Facturation</h1>
        <p className="text-gray-500 mt-1">Historique de vos factures et paiements</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatEuros(totalPaye)}</p>
          <p className="text-sm text-gray-500 mt-1">Total réglé</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
            <Clock size={20} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatEuros(totalEnAttente)}</p>
          <p className="text-sm text-gray-500 mt-1">En attente de paiement</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-3">
            <FileText size={20} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{mesFactures.length}</p>
          <p className="text-sm text-gray-500 mt-1">Factures au total</p>
        </div>
      </div>

      {/* Tableau factures */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Mes factures</h2>
        </div>
        {mesFactures.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune facture émise</p>
            <p className="text-gray-400 text-xs mt-1">Les factures apparaîtront ici après chaque événement</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Émetteur</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mission</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Montant TTC</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mesFactures.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-700 text-sm">{f.emetteur}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {f.mission?.evenement?.nom ?? "—"}
                      {f.mission?.poste && <span className="block text-xs text-gray-400 font-normal">{f.mission.poste.libelle}</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {f.dateEmission ? new Date(f.dateEmission).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatEuros(f.montantTtc)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[f.statutPaiement] ?? "bg-gray-100 text-gray-600"}`}>
                        {statutLabels[f.statutPaiement] ?? f.statutPaiement}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {f.pdfBlobUrl ? (
                        <a href={f.pdfBlobUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-yellow-600 hover:text-yellow-700 font-medium">
                          <FileText size={12} /> PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
