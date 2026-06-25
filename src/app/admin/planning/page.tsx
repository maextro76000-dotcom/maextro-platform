import { db } from "@/db";
import { evenements } from "@/db/schema";
import Link from "next/link";
import { Calendar, MapPin, Users, Building2 } from "lucide-react";

export const metadata = { title: "Planning global — Admin Maextro" };

export const dynamic = "force-dynamic";
export default async function AdminPlanningPage() {
  const tous = await db.query.evenements.findMany({
    orderBy: (e, { asc }) => [asc(e.dateDebut)],
    with: {

      
      missions: { with: { intervenant: true, poste: true } },
    },
  });

  // Grouper par semaine
  const semaines: Record<string, typeof tous> = {};
  tous.forEach((e) => {
    const d = new Date(e.dateDebut);
    const lundi = new Date(d);
    lundi.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = lundi.toISOString().split("T")[0];
    if (!semaines[key]) semaines[key] = [];
    semaines[key].push(e);
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Planning global</h1>
        <p className="text-gray-400 mt-1">Vue d&apos;ensemble de tous les événements par semaine</p>
      </div>

      {Object.keys(semaines).length === 0 ? (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-16 text-center">
          <Calendar size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Aucun événement planifié</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(semaines).map(([semaine, evts]) => {
            const lundi = new Date(semaine);
            const dimanche = new Date(semaine);
            dimanche.setDate(lundi.getDate() + 6);
            return (
              <div key={semaine}>
                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <Calendar size={14} className="text-yellow-500" />
                  Semaine du {lundi.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au{" "}
                  {dimanche.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {evts.map((e) => {
                    const totalBesoins = e.missions.length;
                    const totalAffectes = e.missions.length;
                    const pct = totalBesoins > 0 ? Math.round((totalAffectes / totalBesoins) * 100) : 0;
                    return (
                      <Link key={e.id} href={`/admin/evenements/${e.id}`}
                        className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-yellow-600/50 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-white group-hover:text-yellow-400 transition-colors">{e.nom}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Building2 size={10} /> {e.entrepriseId ?? "—"}
                              </span>
                              {e.lieu && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin size={10} /> {e.lieu}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="text-yellow-400 font-bold text-sm">
                              {new Date(e.dateDebut).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(e.dateDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>

                        {/* Postes demandés */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {e.missions.map((b) => (
                            <span key={b.id} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full">
                              {1}× {b.poste?.libelle}
                            </span>
                          ))}
                        </div>

                        {/* Barre staffing */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${
                              pct === 100 ? "bg-green-500" : pct > 50 ? "bg-yellow-500" : "bg-red-500"
                            }`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {totalAffectes}/{totalBesoins} <Users size={10} className="inline" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
