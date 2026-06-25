import { db } from "@/db";
import { evenements } from "@/db/schema";
import Link from "next/link";
import { CalendarDays, ChevronRight, MapPin, Users } from "lucide-react";

export const metadata = { title: "Événements & Dispatch — Admin Maextro" };

const statutColors: Record<string, string> = {
  brouillon: "bg-gray-700 text-gray-400",
  publie: "bg-blue-500/20 text-blue-400",
  en_cours: "bg-green-500/20 text-green-400",
  termine: "bg-gray-700 text-gray-500",
  annule: "bg-red-500/20 text-red-400",
};
const statutLabels: Record<string, string> = {
  brouillon: "Brouillon", publie: "Publié", en_cours: "En cours", termine: "Terminé", annule: "Annulé",
};

export default async function AdminEvenementsPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const { statut } = await searchParams;

  const tous = await db.query.evenements.findMany({
    orderBy: (e, { desc }) => [desc(e.dateDebut)],
    with: {
      entreprise: true,
      missions: { with: { poste: true, intervenant: true } },
    },
  });

  const filtered = statut ? tous.filter((e) => e.statut === statut) : tous;

  const counts = {
    tous: tous.length,
    publie: tous.filter((e) => e.statut === "confirme").length,
    en_cours: tous.filter((e) => e.statut === "en_cours").length,
    brouillon: tous.filter((e) => e.statut === "brouillon").length,
    termine: tous.filter((e) => e.statut === "passe").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Événements & Dispatch</h1>
        <p className="text-gray-400 mt-1">Gérez les événements et affectez les intervenants</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: `Tous (${counts.tous})` },
          { value: "confirme", label: `Publiés (${counts.publie})` },
          { value: "en_cours", label: `En cours (${counts.en_cours})` },
          { value: "brouillon", label: `Brouillons (${counts.brouillon})` },
          { value: "passe", label: `Terminés (${counts.termine})` },
        ].map((f) => (
          <Link key={f.value}
            href={`/admin/evenements${f.value ? `?statut=${f.value}` : ""}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              (statut ?? "") === f.value ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}>
            {f.label}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((e) => {
          const totalBesoins = e.missions.length;
          const totalAffectes = e.missions.length;
          const pct = totalBesoins > 0 ? Math.round((totalAffectes / totalBesoins) * 100) : 0;

          return (
            <Link key={e.id} href={`/admin/evenements/${e.id}`}
              className="flex items-center gap-4 bg-gray-900 rounded-2xl border border-gray-800 px-6 py-5 hover:border-yellow-600/50 transition-all group">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-yellow-400 text-xs font-medium">
                  {new Date(e.dateDebut).toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()}
                </span>
                <span className="text-yellow-400 text-lg font-bold leading-none">{new Date(e.dateDebut).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">{e.nom}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500">{String(e.entrepriseId) ?? "—"}</span>
                  {e.lieu && <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={10} />{e.lieu}</span>}
                  <span className="flex items-center gap-1 text-xs text-gray-500"><Users size={10} />{totalAffectes}/{totalBesoins}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct === 100 ? "bg-green-500" : pct > 50 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{pct}% staffé</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[e.statut] ?? "bg-gray-700 text-gray-400"}`}>
                  {statutLabels[e.statut] ?? e.statut}
                </span>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <CalendarDays size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun événement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
