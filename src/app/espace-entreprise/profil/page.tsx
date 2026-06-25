import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { entreprises } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProfilEntrepriseForm from "./ProfilEntrepriseForm";

export const metadata = { title: "Profil Entreprise — Espace Entreprise" };

export default async function ProfilEntreprisePage() {
  const { orgId } = await auth();
  const entreprise = await db.query.entreprises.findFirst({
    where: eq(entreprises.clerkOrgId, orgId!),
  });

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Profil Entreprise</h1>
        <p className="text-gray-500 mt-1">Informations de votre société utilisées pour la facturation et les contrats</p>
      </div>
      <ProfilEntrepriseForm entreprise={entreprise ?? null} />
    </div>
  );
}
