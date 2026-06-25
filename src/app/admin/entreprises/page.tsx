import { db } from "@/db";
import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";

export const metadata = { title: "Entreprises / Clients — Admin Maextro" };

export const dynamic = "force-dynamic";
export default async function AdminEntreprisesPage() {
  const tous = await db.query.entreprises.findMany({
    orderBy: (e, { desc }) => [desc(e.createdAt)],
    with: { evenements: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Entreprises / Clients</h1>
        <p className="text-gray-400 mt-1">{tous.length} client(s) enregistré(s)</p>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Entreprise</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">SIRET</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Adresse facturation</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Événements</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">TVA Intra</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {tous.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                    Aucune entreprise enregistrée
                  </td>
                </tr>
              )}
              {tous.map((e) => (
                <tr key={e.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 size={16} className="text-purple-400" />
                      </div>
                      <p className="font-medium text-white">{e.raisonSociale ?? "—"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-400 text-xs">{e.siret ?? "—"}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm max-w-xs truncate">{e.adresseFacturation ?? "—"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-white font-semibold">{e.evenements?.length ?? 0}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{e.tvaIntra ?? "—"}</td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/admin/entreprises/${e.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-lg hover:bg-purple-500/20 transition-colors">
                      Voir <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
