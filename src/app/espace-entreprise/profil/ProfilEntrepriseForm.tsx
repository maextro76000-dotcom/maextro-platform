"use client";

import { useState } from "react";
import { mettreAJourProfilEntreprise } from "@/actions/profil";
import type { Entreprise } from "@/db/schema";

interface Props { entreprise: Entreprise | null; }

export default function ProfilEntrepriseForm({ entreprise }: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null); setSaved(false);
    const fd = new FormData(e.currentTarget);
    try {
      await mettreAJourProfilEntreprise({
        raisonSociale: fd.get("raisonSociale") as string,
        siret: fd.get("siret") as string,
        adresseFacturation: fd.get("adresseFacturation") as string,
        tvaIntra: fd.get("tvaIntra") as string,
      });
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
      <h2 className="font-semibold text-gray-900">Informations légales</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Raison sociale *</label>
        <input name="raisonSociale" defaultValue={entreprise?.raisonSociale ?? ""} required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
          <input name="siret" defaultValue={entreprise?.siret ?? ""} maxLength={14} placeholder="14 chiffres"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">N° TVA intracommunautaire</label>
          <input name="tvaIntra" defaultValue={entreprise?.tvaIntra ?? ""} placeholder="FR00000000000"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de facturation</label>
        <textarea name="adresseFacturation" defaultValue={entreprise?.adresseFacturation ?? ""} rows={3}
          placeholder="Adresse complète (rue, code postal, ville)"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm resize-none" />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {saved && <p className="text-green-600 text-sm font-medium">✓ Profil sauvegardé</p>}
      <button type="submit" disabled={loading}
        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm">
        {loading ? "Sauvegarde..." : "Sauvegarder"}
      </button>
    </form>
  );
}
