"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Settings, MapPin, Briefcase, DollarSign } from "lucide-react";
import type { Poste, Zone, Tarif } from "@/db/schema";

interface Props {
  postes: Poste[];
  zones: Zone[];
  grille: (Tarif & { poste: Poste | null; zone: Zone | null })[];
}

export default function ParametresPlatformeClient({ postes: initialPostes, zones: initialZones, grille }: Props) {
  const [activeTab, setActiveTab] = useState<"postes" | "zones" | "grille">("grille");

  const tabs = [
    { id: "grille" as const, label: "Grille tarifaire", icon: DollarSign },
    { id: "postes" as const, label: "Postes", icon: Briefcase },
    { id: "zones" as const, label: "Zones", icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-yellow-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grille tarifaire */}
      {activeTab === "grille" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Grille tarifaire</h3>
              <p className="text-gray-400 text-sm mt-0.5">Tarifs établissement et rémunération intervenant par poste × zone</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Poste</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Zone</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tarif établissement (€/h)</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rémunération intervenant (€/h)</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {grille.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{t.poste?.libelle ?? "—"}</td>
                      <td className="px-6 py-4 text-gray-300">{t.zone?.nom ?? "—"}</td>
                      <td className="px-6 py-4 text-right text-yellow-400 font-semibold">{parseFloat(t.tarifEtablissementHoraire).toFixed(2)} €</td>
                      <td className="px-6 py-4 text-right text-green-400 font-semibold">{parseFloat(t.remunerationIntervenantHoraire).toFixed(2)} €</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.actif ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-500"}`}>
                          {t.actif ? "Actif" : "Inactif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {grille.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                        Aucun tarif configuré. Ajoutez des postes et des zones pour commencer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Postes */}
      {activeTab === "postes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Postes</h3>
              <p className="text-gray-400 text-sm mt-0.5">{initialPostes.length} poste(s) configuré(s)</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">
              <Plus size={14} /> Ajouter un poste
            </button>
          </div>
          <div className="space-y-2">
            {initialPostes.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-gray-900 rounded-xl border border-gray-800 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-600/10 rounded-lg flex items-center justify-center">
                    <Briefcase size={14} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{p.libelle}</p>
                    <p className="text-xs text-gray-500">Ordre : {p.ordre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.actif ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-500"}`}>
                    {p.actif ? "Actif" : "Inactif"}
                  </span>
                  <button className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {initialPostes.length === 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
                <Briefcase size={32} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucun poste configuré</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Zones */}
      {activeTab === "zones" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Zones géographiques</h3>
              <p className="text-gray-400 text-sm mt-0.5">{initialZones.length} zone(s) configurée(s)</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">
              <Plus size={14} /> Ajouter une zone
            </button>
          </div>
          <div className="space-y-2">
            {initialZones.map((z) => (
              <div key={z.id} className="flex items-center justify-between bg-gray-900 rounded-xl border border-gray-800 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <MapPin size={14} className="text-blue-400" />
                  </div>
                  <p className="font-medium text-white">{z.nom}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${z.actif ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-500"}`}>
                    {z.actif ? "Active" : "Inactive"}
                  </span>
                  <button className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {initialZones.length === 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
                <MapPin size={32} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucune zone configurée</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
