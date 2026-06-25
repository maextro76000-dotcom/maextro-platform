import { db } from "@/db";
import { intervenants } from "@/db/schema";
import { eq, like, or } from "drizzle-orm";
import Link from "next/link";
import { Users, CheckCircle2, XCircle, Clock, ChevronRight, Search } from "lucide-react";

export const metadata = { title: "Intervenants — Admin Maextro" };

const statutColors: Record<string, string> = {
  en_attente: "bg-yellow-500/10 text-yellow-400",
  valide: "bg-green-500/10 text-green-400",
  suspendu: "bg-red-500/10 text-red-400",
  rejete: "bg-gray-500/10 text-gray-400",
};
const statutLabels: Record<string, string> = {
  en_attente: "En attente",
  valide: "Validé",
  suspendu: "Suspendu",
  rejete: "Rejeté",
};

export default async function AdminIntervenantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string }>;
}) {
  const { q, statut } = await searchParams;

  let query = db.query.intervenants.findMany({
    orderBy: (i, { desc }) => [desc(i.createdAt)],
    with: { missions: true },
  });

  const tous = await db.query.intervenants.findMany({
    orderBy: (i, { desc }) => [desc(i.createdAt)],
    with: { missions: true },
  });

  const filtered = tous.filter((i) => {
    const matchQ = !q || `${i.prenom} ${i.nom} ${i.telephone ?? i.clerkUserId}`.toLowerCase().includes(q.toLowerCase());
    const matchStatut = !statut || i.statutValidation === statut;
    return matchQ && matchStatut;
  });

  const counts = {
    tous: tous.length,
    en_attente: tous.filter((i) => i.statutValidation === "en_attente").length,
    valide: tous.filter((i) => i.statutValidation === "valide").length,
    suspendu: tous.filter((i) => i.statutValidation === "refuse").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Intervenants</h1>
        <p className="text-gray-400 mt-1">{tous.length} profil(s) enregistré(s)</p>
      </div>

      {/* Filtres statut */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: `Tous (${counts.tous})` },
          { value: "en_attente", label: `En attente (${counts.en_attente})` },
          { value: "valide", label: `Validés (${counts.valide})` },
          { value: "refuse", label: `Suspendus (${counts.suspendu})` },
        ].map((f) => (
          <Link
            key={f.value}
            href={`/admin/intervenants?${new URLSearchParams({ ...(q ? { q } : {}), ...(f.value ? { statut: f.value } : {}) })}`}
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Intervenant</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Postes</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Missions</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((i) => (
                <tr key={i.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-yellow-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-400 text-xs font-bold">{i.prenom?.[0]}{i.nom?.[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{i.prenom} {i.nom}</p>
                        <p className="text-xs text-gray-500">
                          Inscrit le {i.createdAt ? new Date(i.createdAt).toLocaleDateString("fr-FR") : "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-300 text-sm">{i.telephone ?? i.clerkUserId}</p>
                    <p className="text-gray-500 text-xs">{i.telephone ?? "—"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(i.competences as unknown as number[] ?? []).slice(0, 2).map((pid) => (
                        <span key={pid} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full">Poste #{pid}</span>
                      ))}
                      {(i.competences as unknown as number[] ?? []).length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">+{(i.competences as unknown as number[]).length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-white font-semibold">{i.missions?.length ?? 0}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[i.statutValidation] ?? "bg-gray-700 text-gray-400"}`}>
                      {statutLabels[i.statutValidation] ?? i.statutValidation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/admin/intervenants/${i.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-600/10 text-yellow-400 text-xs font-medium rounded-lg hover:bg-yellow-600/20 transition-colors">
                      Voir <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                    Aucun intervenant trouvé
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
