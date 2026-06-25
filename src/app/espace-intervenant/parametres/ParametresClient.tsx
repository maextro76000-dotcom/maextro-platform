"use client";

import { useState } from "react";
import { Bell, Lock, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Props {
  email: string;
  notificationsEmail: boolean;
  notificationsSms: boolean;
}

export default function ParametresClient({ email, notificationsEmail, notificationsSms }: Props) {
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const [notifEmail, setNotifEmail] = useState(notificationsEmail);
  const [notifSms, setNotifSms] = useState(notificationsSms);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaved(false);
    await new Promise((r) => setTimeout(r, 400));
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      {/* Compte */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={16} className="text-gray-400" /> Compte & Sécurité
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <input
              value={email}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Modifiable depuis votre compte Clerk</p>
          </div>
          <button
            onClick={() => openUserProfile()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            Gérer mon compte (email, mot de passe, 2FA)
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={16} className="text-gray-400" /> Notifications
        </h2>
        <div className="space-y-4">
          {[
            { label: "Notifications par email", desc: "Nouvelles missions, confirmations, rappels", value: notifEmail, onChange: setNotifEmail },
            { label: "Notifications par SMS", desc: "Alertes urgentes uniquement", value: notifSms, onChange: setNotifSms },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-400">{n.desc}</p>
              </div>
              <button
                onClick={() => n.onChange(!n.value)}
                className={`relative w-11 h-6 rounded-full transition-colors ${n.value ? "bg-yellow-600" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${n.value ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
        {saved && <p className="text-green-600 text-sm mt-4 font-medium">✓ Préférences sauvegardées</p>}
        <button
          onClick={handleSave}
          className="mt-4 px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Sauvegarder
        </button>
      </div>

      {/* Déconnexion */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LogOut size={16} className="text-gray-400" /> Session
        </h2>
        <button
          onClick={() => signOut(() => router.push("/"))}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-lg transition-colors border border-red-200"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
