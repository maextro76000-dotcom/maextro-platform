"use client";

import { useState } from "react";
import { formatDate, formatDateTime } from "@/lib/utils";
import { pointerArrivee, pointerDepart } from "@/actions/pointage";
import { MapPin, Clock, CheckCircle2, AlertCircle, Briefcase } from "lucide-react";

type Mission = {
  id: number;
  statut: string;
  statutPointage: string;
  dateDebut: Date;
  dateFin: Date;
  lieu: string | null;
  heuresFacturables: string | null;
  ecartMinutes: number | null;
  evenement: { nom: string } | null;
  poste: { libelle: string } | null;
  pointages: Array<{ source: string; heureArrivee: Date; heureDepart: Date; pauseMinutes: number }>;
};

interface Props {
  missions: Mission[];
}

const statutColors: Record<string, string> = {
  a_venir: "bg-blue-100 text-blue-700",
  en_cours: "bg-green-100 text-green-700",
  termine: "bg-gray-100 text-gray-600",
  annule: "bg-red-100 text-red-600",
};

const pointageColors: Record<string, string> = {
  en_attente: "bg-gray-100 text-gray-500",
  partiel: "bg-yellow-100 text-yellow-700",
  concordant: "bg-green-100 text-green-700",
  divergent: "bg-red-100 text-red-600",
  valide: "bg-emerald-100 text-emerald-700",
};

const pointageLabels: Record<string, string> = {
  en_attente: "Pointage en attente",
  partiel: "Pointage partiel",
  concordant: "Concordant ✓",
  divergent: "Divergent — en révision",
  valide: "Validé ✓",
};

export default function MissionsClient({ missions }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [pauseMinutes, setPauseMinutes] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<"a_venir" | "termine" | "tous">("a_venir");

  const filtered = missions.filter((m) => {
    if (activeTab === "tous") return true;
    if (activeTab === "a_venir") return ["a_venir", "en_cours"].includes(m.statut);
    return m.statut === "termine";
  });

  async function handleArrivee(missionId: number) {
    setLoadingId(missionId);
    try {
      await pointerArrivee(missionId, new Date());
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDepart(missionId: number) {
    setLoadingId(missionId);
    try {
      await pointerDepart(missionId, new Date(), pauseMinutes[missionId] ?? 0);
    } finally {
      setLoadingId(null);
    }
  }

  const ptIntervenant = (m: Mission) => m.pointages.find((p) => p.source === "intervenant");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["a_venir", "termine", "tous"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "a_venir" ? "À venir" : tab === "termine" ? "Terminées" : "Toutes"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucune mission dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => {
            const pt = ptIntervenant(m);
            const aPointe = !!pt;
            const aDepartePointe = aPointe && pt.heureDepart.getTime() !== pt.heureArrivee.getTime();
            const isLoading = loadingId === m.id;

            return (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* En-tête mission */}
                <div className="flex items-start justify-between p-6 border-b border-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase size={20} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{m.poste?.libelle ?? "Mission"}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{m.evenement?.nom ?? "—"}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} />
                          {formatDate(m.dateDebut)}
                        </span>
                        {m.lieu && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={12} />
                            {m.lieu}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[m.statut] ?? "bg-gray-100 text-gray-600"}`}>
                      {m.statut === "a_venir" ? "À venir" : m.statut === "en_cours" ? "En cours" : m.statut === "termine" ? "Terminée" : m.statut}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pointageColors[m.statutPointage] ?? "bg-gray-100 text-gray-500"}`}>
                      {pointageLabels[m.statutPointage] ?? m.statutPointage}
                    </span>
                  </div>
                </div>

                {/* Zone pointage */}
                {["a_venir", "en_cours"].includes(m.statut) && (
                  <div className="p-6 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-700 mb-4">Pointage</p>
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Arrivée */}
                      {!aPointe ? (
                        <button
                          onClick={() => handleArrivee(m.id)}
                          disabled={isLoading}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                          {isLoading ? "Pointage..." : "Pointer mon arrivée"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                          <CheckCircle2 size={16} />
                          Arrivée pointée à {formatDateTime(pt.heureArrivee)}
                        </div>
                      )}

                      {/* Départ */}
                      {aPointe && !aDepartePointe && (
                        <div className="flex items-center gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Pause (min)</label>
                            <input
                              type="number"
                              min={0}
                              max={120}
                              value={pauseMinutes[m.id] ?? 0}
                              onChange={(e) =>
                                setPauseMinutes((prev) => ({ ...prev, [m.id]: parseInt(e.target.value) || 0 }))
                              }
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                            />
                          </div>
                          <button
                            onClick={() => handleDepart(m.id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 mt-4"
                          >
                            {isLoading ? "Pointage..." : "Pointer mon départ"}
                          </button>
                        </div>
                      )}

                      {aDepartePointe && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                          Départ pointé à {formatDateTime(pt.heureDepart)}
                          {pt.pauseMinutes > 0 && ` (pause : ${pt.pauseMinutes} min)`}
                        </div>
                      )}
                    </div>

                    {/* Note pointage à l'aveugle */}
                    <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Pointage à l&apos;aveugle : vos heures sont enregistrées indépendamment de l&apos;établissement.
                    </p>
                  </div>
                )}

                {/* Résultat rapprochement */}
                {m.statutPointage === "concordant" && m.heuresFacturables && (
                  <div className="px-6 py-4 bg-green-50 border-t border-green-100 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <p className="text-sm text-green-700 font-medium">
                      Heures validées : {m.heuresFacturables}h facturables
                    </p>
                  </div>
                )}
                {m.statutPointage === "divergent" && (
                  <div className="px-6 py-4 bg-red-50 border-t border-red-100 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <p className="text-sm text-red-700">
                      Écart de {m.ecartMinutes} min détecté — en cours d&apos;arbitrage par notre équipe.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
