"use client";

import { useState } from "react";
import { mettreAJourProfilIntervenant } from "@/actions/profil";
import type { Intervenant } from "@/db/schema";

interface Props {
  intervenant: Intervenant | null;
}

export default function ProfilIntervenantForm({ intervenant }: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    const fd = new FormData(e.currentTarget);
    try {
      await mettreAJourProfilIntervenant({
        prenom: fd.get("prenom") as string,
        nom: fd.get("nom") as string,
        telephone: fd.get("telephone") as string,
        adresse: fd.get("adresse") as string,
        siret: fd.get("siret") as string,
        bio: fd.get("bio") as string,
      });
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
      <h2 className="font-semibold text-gray-900">Informations personnelles</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
          <input
            name="prenom"
            defaultValue={intervenant?.prenom ?? ""}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            name="nom"
            defaultValue={intervenant?.nom ?? ""}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
        <input
          name="telephone"
          type="tel"
          defaultValue={intervenant?.telephone ?? ""}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <input
          name="adresse"
          defaultValue={intervenant?.adresse ?? ""}
          placeholder="Rue, code postal, ville"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SIRET (si auto-entrepreneur)</label>
        <input
          name="siret"
          defaultValue={intervenant?.siret ?? ""}
          maxLength={14}
          placeholder="14 chiffres"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Présentation / Bio</label>
        <textarea
          name="bio"
          defaultValue={intervenant?.bio ?? ""}
          rows={4}
          placeholder="Décrivez votre expérience, vos spécialités, vos disponibilités préférées..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {saved && <p className="text-green-600 text-sm font-medium">✓ Profil sauvegardé avec succès</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm"
      >
        {loading ? "Sauvegarde..." : "Sauvegarder les modifications"}
      </button>
    </form>
  );
}
