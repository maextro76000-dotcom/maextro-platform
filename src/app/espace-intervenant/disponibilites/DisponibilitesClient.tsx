"use client";

import { useState } from "react";
import { Calendar, Plus, Trash2 } from "lucide-react";
import type { Disponibilite } from "@/db/schema";

interface Props {
  intervenantId: number | null;
  disponibilites: Disponibilite[];
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const CRENEAUX = ["Matin (8h-13h)", "Après-midi (13h-18h)", "Soir (18h-23h)", "Journée complète"];

export default function DisponibilitesClient({ intervenantId, disponibilites }: Props) {
  const [dispos, setDispos] = useState(disponibilites);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    dateDebut: "",
    dateFin: "",
    recurrent: false,
    joursSemaine: [] as number[],
    creneaux: [] as string[],
    note: "",
  });

  function toggleJour(j: number) {
    setForm((f) => ({
      ...f,
      joursSemaine: f.joursSemaine.includes(j)
        ? f.joursSemaine.filter((x) => x !== j)
        : [...f.joursSemaine, j],
    }));
  }

  async function handleAjouter() {
    if (!intervenantId || !form.dateDebut) return;
    setLoading(true);
    // Server action à brancher
    await new Promise((r) => setTimeout(r, 500));
    setShowForm(false);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Bouton ajouter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{dispos.length} créneau(x) enregistré(s)</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={16} />
          Ajouter une disponibilité
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="font-semibold text-gray-900">Nouvelle disponibilité</h3>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.recurrent}
                onChange={(e) => setForm((f) => ({ ...f, recurrent: e.target.checked }))}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              Disponibilité récurrente (hebdomadaire)
            </label>
          </div>

          {form.recurrent ? (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Jours disponibles</p>
              <div className="flex flex-wrap gap-2">
                {JOURS.map((j, i) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => toggleJour(i)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      form.joursSemaine.includes(i)
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input
                  type="date"
                  value={form.dateDebut}
                  onChange={(e) => setForm((f) => ({ ...f, dateDebut: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <input
                  type="date"
                  value={form.dateFin}
                  onChange={(e) => setForm((f) => ({ ...f, dateFin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Créneaux horaires</p>
            <div className="flex flex-wrap gap-2">
              {CRENEAUX.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      creneaux: f.creneaux.includes(c)
                        ? f.creneaux.filter((x) => x !== c)
                        : [...f.creneaux, c],
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    form.creneaux.includes(c)
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (optionnel)</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Ex : Disponible uniquement en Normandie"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAjouter}
              disabled={loading}
              className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des disponibilités */}
      {dispos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucune disponibilité enregistrée</p>
          <p className="text-gray-400 text-xs mt-1">Ajoutez vos créneaux pour recevoir des missions</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {dispos.map((d) => (
            <div key={d.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(d.date).toLocaleDateString("fr-FR")}
                    {d.date && ` → ${new Date(d.date).toLocaleDateString("fr-FR")}`}
                  </p>
                  {d.creneau && <p className="text-xs text-gray-400">{d.creneau}</p>}
                </div>
              </div>
              <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
