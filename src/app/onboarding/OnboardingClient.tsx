"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completerOnboardingIntervenant, completerOnboardingEntreprise } from "@/actions/profil";

type Step = "choix" | "intervenant" | "entreprise";

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleIntervenant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await completerOnboardingIntervenant({
        nom: fd.get("nom") as string,
        prenom: fd.get("prenom") as string,
        telephone: fd.get("telephone") as string,
      });
      router.push("/espace-intervenant");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function handleEntreprise(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await completerOnboardingEntreprise({
        raisonSociale: fd.get("raisonSociale") as string,
        siret: fd.get("siret") as string,
        nom: fd.get("nom") as string,
        fonction: fd.get("fonction") as string,
        email: fd.get("email") as string,
        telephone: fd.get("telephone") as string,
      });
      router.push("/espace-entreprise");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Maextro</h1>
          <p className="text-gray-500 mt-2">Agence de Staffing Événementiel</p>
        </div>

        {step === "choix" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2 text-center">
              Bienvenue !
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Quel type de compte souhaitez-vous créer ?
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={() => setStep("intervenant")}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-200 text-left"
              >
                <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center text-2xl group-hover:bg-yellow-200 transition-colors">
                  👤
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Intervenant</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Je cherche des missions dans l&apos;événementiel
                  </p>
                </div>
              </button>
              <button
                onClick={() => setStep("entreprise")}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-200 text-left"
              >
                <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center text-2xl group-hover:bg-yellow-200 transition-colors">
                  🏢
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Entreprise</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Je recrute du personnel pour mes événements
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === "intervenant" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <button
              onClick={() => setStep("choix")}
              className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
            >
              ← Retour
            </button>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
              Mon profil intervenant
            </h2>
            <form onSubmit={handleIntervenant} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input name="prenom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input name="nom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input name="telephone" type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Création en cours..." : "Créer mon profil intervenant"}
              </button>
            </form>
          </div>
        )}

        {step === "entreprise" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <button
              onClick={() => setStep("choix")}
              className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
            >
              ← Retour
            </button>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
              Mon profil entreprise
            </h2>
            <form onSubmit={handleEntreprise} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raison sociale *</label>
                <input name="raisonSociale" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
                <input name="siret" maxLength={14} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" placeholder="14 chiffres" />
              </div>
              <hr className="my-2" />
              <p className="text-sm font-medium text-gray-700">Votre contact</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input name="nom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fonction</label>
                  <input name="fonction" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email professionnel</label>
                <input name="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input name="telephone" type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Création en cours..." : "Créer mon espace entreprise"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
