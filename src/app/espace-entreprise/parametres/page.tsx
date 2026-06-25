import { auth, currentUser } from "@clerk/nextjs/server";
import ParametresEntrepriseClient from "./ParametresEntrepriseClient";

export const metadata = { title: "Paramètres — Espace Entreprise" };

export default async function ParametresEntreprisePage() {
  const user = await currentUser();
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Paramètres & Compte</h1>
        <p className="text-gray-500 mt-1">Gérez vos préférences et informations de connexion</p>
      </div>
      <ParametresEntrepriseClient email={user?.emailAddresses[0]?.emailAddress ?? ""} />
    </div>
  );
}
