import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { entreprises, contactsEntreprise } from "@/db/schema";
import { eq } from "drizzle-orm";
import EquipeClient from "./EquipeClient";

export const metadata = { title: "Équipe & Contacts — Espace Entreprise" };

export default async function EquipePage() {
  const { orgId } = await auth();
  const entreprise = orgId
    ? await db.query.entreprises.findFirst({
        where: eq(entreprises.clerkOrgId, orgId),
      })
    : null;

  const mesContacts = entreprise
    ? await db.query.contactsEntreprise.findMany({
        where: eq(contactsEntreprise.entrepriseId, entreprise.id),
        orderBy: (c, { asc }) => [asc(c.nom)],
      })
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Équipe & Contacts</h1>
        <p className="text-gray-500 mt-1">Gérez les contacts autorisés à créer des événements</p>
      </div>
      <EquipeClient entrepriseId={entreprise?.id ?? null} contacts={mesContacts} />
    </div>
  );
}
