import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { intervenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProfilIntervenantForm from "./ProfilIntervenantForm";

export const metadata = { title: "Mon Profil — Espace Intervenant" };

export default async function ProfilIntervenantPage() {
  const { userId } = await auth();
  const intervenant = await db.query.intervenants.findFirst({
    where: eq(intervenants.clerkUserId, userId!),
  });

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-500 mt-1">Complétez votre profil pour accéder à plus de missions</p>
      </div>

      {/* Statut validation */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${
        intervenant?.statutValidation === "valide"
          ? "bg-green-50 border-green-200"
          : intervenant?.statutValidation === "refuse"
          ? "bg-red-50 border-red-200"
          : "bg-yellow-50 border-yellow-200"
      }`}>
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
          intervenant?.statutValidation === "valide" ? "bg-green-500" :
          intervenant?.statutValidation === "refuse" ? "bg-red-500" : "bg-yellow-500"
        }`} />
        <div>
          <p className="font-medium text-sm text-gray-900">
            {intervenant?.statutValidation === "valide" ? "Profil validé ✓" :
             intervenant?.statutValidation === "refuse" ? "Profil refusé" : "En attente de validation"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {intervenant?.statutValidation === "valide"
              ? "Votre profil est actif et visible par notre équipe de dispatch."
              : intervenant?.statutValidation === "refuse"
              ? "Votre profil a été refusé. Contactez-nous pour plus d'informations."
              : "Notre équipe examine votre profil. Délai : 48h ouvrées."}
          </p>
        </div>
      </div>

      <ProfilIntervenantForm intervenant={intervenant ?? null} />
    </div>
  );
}
