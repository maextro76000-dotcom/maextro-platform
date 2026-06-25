"use client";

import { useState } from "react";
import { Users, Plus, Trash2, Mail, Phone } from "lucide-react";
import type { ContactEntreprise } from "@/db/schema";

interface Props {
  entrepriseId: number | null;
  contacts: ContactEntreprise[];
}

export default function EquipeClient({ entrepriseId, contacts: initialContacts }: Props) {
  const [contacts, setContacts] = useState(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", role: "contact" });

  async function handleAjouter(e: React.FormEvent) {
    e.preventDefault();
    if (!entrepriseId) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setShowForm(false);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{contacts.length} contact(s) enregistré(s)</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={16} /> Ajouter un contact
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAjouter} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Nouveau contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input value={form.prenom} onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input type="tel" value={form.telephone} onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none bg-white">
              <option value="contact">Contact principal</option>
              <option value="responsable">Responsable événements</option>
              <option value="comptable">Comptabilité</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              {loading ? "Enregistrement..." : "Ajouter"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
              Annuler
            </button>
          </div>
        </form>
      )}

      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucun contact enregistré</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-yellow-700 font-bold text-sm">
                    {}{c.nom?.[0]}
                  </span>
                </div>
                <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{c.nom}</p>
              <p className="text-xs text-yellow-600 font-medium mt-0.5 mb-3">{c.fonction ?? "Contact"}</p>
              {c.email && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={12} /> {c.email}
                </div>
              )}
              {c.telephone && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Phone size={12} /> {c.telephone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
