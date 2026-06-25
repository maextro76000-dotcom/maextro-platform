"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronRight, Users, MapPin } from "lucide-react";

type Evenement = {
  id: number;
  nom: string;
  dateDebut: Date;
  dateFin: Date | null;
  lieu: string | null;
  statut: string;
  missions: Array<{ id: number; poste: { libelle: string } | null; intervenant: { prenom: string | null; nom: string | null } | null }>;
};

interface Props { evenements: Evenement[]; }

export default function PlanningClient({ evenements }: Props) {
  const [vue, setVue] = useState<"liste" | "mois">("liste");

  const moisGroupes = evenements.reduce<Record<string, Evenement[]>>((acc, e) => {
    const mois = new Date(e.dateDebut).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    if (!acc[mois]) acc[mois] = [];
    acc[mois].push(e);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Toggle vue */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["liste", "mois"] as const).map((v) => (
          <button key={v} onClick={() => setVue(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${vue === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {v === "liste" ? "Liste" : "Par mois"}
          </button>
        ))}
      </div>

      {evenements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Aucun événement planifié</p>
        </div>
      ) : vue === "liste" ? (
        <div className="space-y-3">
          {evenements.map((e) => {
            const totalAffectes = e.missions.length;
            const totalBesoins = totalAffectes;
            const pct = 100;
            return (
              <Link key={e.id} href={`/espace-entreprise/evenements/${e.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-6 py-5 hover:border-yellow-200 hover:shadow-sm transition-all group">
                {/* Date badge */}
                <div className="w-14 h-14 bg-yellow-600 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white">
                  <span className="text-xs font-medium opacity-80">
                    {new Date(e.dateDebut).toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()}
                  </span>
                  <span className="text-xl font-bold leading-none">
                    {new Date(e.dateDebut).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors truncate">{e.nom}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {e.lieu && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={11} /> {e.lieu}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Users size={11} /> {totalAffectes} intervenant(s)
                    </span>
                  </div>
                  {/* Barre de progression staffing */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct === 100 ? "bg-green-500" : pct > 50 ? "bg-yellow-500" : "bg-red-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{pct}% staffé</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-yellow-500 flex-shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(moisGroupes).map(([mois, evts]) => (
            <div key={mois}>
              <h3 className="font-semibold text-gray-900 capitalize mb-3 text-sm">{mois}</h3>
              <div className="space-y-2">
                {evts.map((e) => (
                  <Link key={e.id} href={`/espace-entreprise/evenements/${e.id}`}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-yellow-200 transition-all group">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-700 text-xs font-bold">{new Date(e.dateDebut).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-yellow-700 transition-colors">{e.nom}</p>
                      {e.lieu && <p className="text-xs text-gray-400 truncate">{e.lieu}</p>}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                      e.statut === "en_cours" ? "bg-green-100 text-green-700" :
                      e.statut === "publie" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {e.statut === "en_cours" ? "En cours" : e.statut === "publie" ? "Publié" : e.statut}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
