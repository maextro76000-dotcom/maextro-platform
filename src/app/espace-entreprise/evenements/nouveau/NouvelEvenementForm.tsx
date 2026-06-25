"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { creerEvenement, ajouterBesoins } from "@/actions/evenements";
import type { Poste } from "@/db/schema";

interface Besoin { posteId: number; quantite: number; heureDebut: string; heureFin: string; note: string; }

interface Props { postes: Poste[]; }

export default function NouvelEvenementForm({ postes }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [besoins, setBesoins] = useState<Besoin[]>([{ posteId: postes[0]?.id ?? 0, quantite: 1, heureDebut: "18:00", heureFin: "23:00", note: "" }]);

  function ajouterBesoin() {
    setBesoins((b) => [...b, { posteId: postes[0]?.id ?? 0, quantite: 1, heureDebut: "18:00", heureFin: "23:00", note: "" }]);
  }

  function supprimerBesoin(i: number) {
    setBesoins((b) => b.filter((_, idx) => idx !== i));
  }

  function updateBesoin(i: number, field: keyof Besoin, value: string | number) {
    setBesoins((b) => b.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const evenementCree = await creerEvenement({
        nom: fd.get("nom") as string,
        description: fd.get("description") as string,
        dateDebut: new Date(fd.get("dateDebut") as string),
        dateFin: fd.get("dateFin") ? new Date(fd.get("dateFin") as string) : new Date(fd.get("dateDebut") as string),
        lieu: fd.get("lieu") as string,
        codePostal: fd.get("codePostal") as string,
      });
      if (besoins.length > 0) {
        const b = besoins.map((b) => ({ posteId: b.posteId, quantite: b.quantite, dateDebut: new Date(fd.get("dateDebut") as string), dateFin: new Date(fd.get("dateFin") as string) || new Date(fd.get("dateDebut") as string) }));
        await ajouterBesoins(evenementCree.id, b);
      }
      router.push(`/espace-entreprise/evenements/${evenementCree.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations générales */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Informations générales</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&apos;événement *</label>
          <input name="nom" required placeholder="Ex : Gala annuel Porsche Normandie"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows={3} placeholder="Décrivez l'événement, le dress code, les consignes particulières..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm resize-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
            <input name="dateDebut" type="datetime-local" required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <input name="dateFin" type="datetime-local"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lieu / Établissement</label>
          <input name="lieu" placeholder="Ex : Château de Villers"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
          <input name="adresse" placeholder="Rue, code postal, ville"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" />
        </div>
      </div>

      {/* Besoins en personnel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Besoins en personnel</h2>
          <button type="button" onClick={ajouterBesoin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-yellow-600 border border-yellow-300 hover:bg-yellow-50 rounded-lg transition-colors font-medium">
            <Plus size={14} /> Ajouter un poste
          </button>
        </div>

        <div className="space-y-4">
          {besoins.map((b, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Poste {i + 1}</p>
                {besoins.length > 1 && (
                  <button type="button" onClick={() => supprimerBesoin(i)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Poste *</label>
                  <select value={b.posteId} onChange={(e) => updateBesoin(i, "posteId", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none bg-white">
                    {postes.map((p) => <option key={p.id} value={p.id}>{p.libelle}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quantité *</label>
                  <input type="number" min={1} max={50} value={b.quantite}
                    onChange={(e) => updateBesoin(i, "quantite", parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Début</label>
                    <input type="time" value={b.heureDebut}
                      onChange={(e) => updateBesoin(i, "heureDebut", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Fin</label>
                    <input type="time" value={b.heureFin}
                      onChange={(e) => updateBesoin(i, "heureFin", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Note spécifique</label>
                <input type="text" value={b.note} onChange={(e) => updateBesoin(i, "note", e.target.value)}
                  placeholder="Ex : Tenue sombre exigée, expérience gastronomique requise"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm">
          {loading ? "Création en cours..." : "Créer l'événement"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-sm">
          Annuler
        </button>
      </div>
    </form>
  );
}
