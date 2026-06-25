import { db } from "@/db";
import { factures, missions, evenements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export const metadata = { title: "Facturation & Paiements — Admin Maextro" };

function formatEuros(val: string | number | null) {
  if (val === null || val === undefined) return "—";
  const num = typeof val === "string" ? parseFloat(val) : val;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(num);
}

const statutColors: Record<string, string> = {
  en_attente: "bg-yellow-500/20 text-yellow-400",
  paye: "bg-green-500/20 text-green-400",
  en_retard: "bg-red-500/20 text-red-400",
  annule: "bg-gray-700 text-gray-500",
};
const statutLabels: Record<string, string> = {
  en_attente: "En attente",
  paye: "Payée",
  en_retard: "En retard",
  annule: "Annulée",
};

export const dynamic = "force-dynamic";
export default async function AdminFacturationPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const { statut } = await searchParams;

  const toutes = await db.query.factures.findMany({
    orderBy: [desc(factures.dateEmission)],
    with: {
      mission: {
        with: {
          evenement: { with: { entreprise: true } },
          intervenant: true,
          poste: true,
        },
      },
    },
  });

  const filtered = statut ? toutes.filter((f) => f.statutPaiement === statut) : toutes;

  const totalPaye = toutes
    .filter((f) => f.statutPaiement === "paye")
    .reduce((acc, f) => acc + parseFloat(f.montantTtc ?? "0"), 0);
  const totalEnAttente = toutes
    .filter((f) => f.statutPaiement === "en_attente")
    .reduce((acc, f) => acc + parseFloat(f.montantTtc ?? "0"), 0);
  const totalEnRetard = toutes
    .filter((f) => f.statutPaiement === "en_retard")
    .reduce((acc, f) => acc + parseFloat(f.montantTtc ?? "0"), 0);

  // Missions validées sans facture
  const missionsValideesSansFacture = await db.query.missions.findMany({
    where: eq(missions.statutPointage, "concordant"),
    with: {
      factures: true,
      evenement: { with: { entreprise: true } },
      poste: true,
      intervenant: true,
    },
  }).then((ms) => ms.filter((m) => m.factures.length === 0 && m.heuresFacturables));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Facturation & Paiements</h1>
        <p className="text-gray-400 mt-1">Gérez les factures et le suivi des paiements</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-3">
            <CheckCircle2 size={20} className="text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatEuros(totalPaye)}</p>
          <p className="text-sm text-gray-400 mt-1">CA encaissé</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-3">
            <Clock size={20} className="text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatEuros(totalEnAttente)}</p>
          <p className="text-sm text-gray-400 mt-1">En attente de paiement</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center mb-3">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatEuros(totalEnRetard)}</p>
          <p className="text-sm text-gray-400 mt-1">En retard</p>
        </div>
      </div>

      {/* Missions sans facture */}
      {missionsValideesSansFacture.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
          <h3 className="text-yellow-400 font-semibold text-sm mb-3 flex items-center gap-2">
            <AlertTriangle size={16} />
            {missionsValideesSansFacture.length} mission(s) validée(s) sans facture
          </h3>
          <div className="space-y-2">
            {missionsValideesSansFacture.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-gray-900/50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {m.intervenant?.prenom} {m.intervenant?.nom} — {m.poste?.libelle}
                  </p>
                  <p className="text-xs text-gray-400">
                    {m.evenement?.nom} · {m.heuresFacturables}h
                  </p>
                </div>
                <Link
                  href={`/admin/rapprochement`}
                  className="px-3 py-1.5 bg-yellow-600/10 text-yellow-400 text-xs font-medium rounded-lg hover:bg-yellow-600/20 transition-colors"
                >
                  Voir
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: `Toutes (${toutes.length})` },
          { value: "en_attente", label: "En attente" },
          { value: "paye", label: "Payées" },
          { value: "en_retard", label: "En retard" },
        ].map((f) => (
          <Link
            key={f.value}
            href={`/admin/facturation${f.value ? `?statut=${f.value}` : ""}`}
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

      {/* Tableau */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Émetteur</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Destinataire</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mission</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">HT</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">TTC</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-gray-300 text-sm truncate max-w-[160px]">{f.emetteur}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm truncate max-w-[160px]">{f.destinataire}</td>
                  <td className="px-6 py-4 font-medium text-white text-sm">
                    {f.mission?.evenement?.nom ?? "—"}
                    {f.mission?.poste && (
                      <span className="block text-xs text-gray-500 font-normal">{f.mission.poste.libelle}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {f.dateEmission
                      ? new Date(f.dateEmission).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-300 text-sm">{formatEuros(f.montantHt)}</td>
                  <td className="px-6 py-4 text-right font-semibold text-white">{formatEuros(f.montantTtc)}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statutColors[f.statutPaiement] ?? "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {statutLabels[f.statutPaiement] ?? f.statutPaiement}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {f.pdfBlobUrl ? (
                      <a
                        href={f.pdfBlobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 font-medium"
                      >
                        <FileText size={12} /> PDF
                      </a>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                    Aucune facture trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
