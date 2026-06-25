"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { intervenants, entreprises, contactsEntreprise } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function completerOnboardingIntervenant(data: {
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Non authentifié");

  await db
    .insert(intervenants)
    .values({
      clerkUserId: userId,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      adresse: data.adresse,
      statutValidation: "en_attente",
    })
    .onConflictDoUpdate({
      target: [intervenants.clerkUserId],
      set: {
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        adresse: data.adresse,
        updatedAt: new Date(),
      },
    });

  // Mettre à jour les métadonnées Clerk
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { typeCompte: "intervenant" },
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function completerOnboardingEntreprise(data: {
  raisonSociale: string;
  siret?: string;
  nom: string;
  fonction?: string;
  email?: string;
  telephone?: string;
}) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Non authentifié");

  // Créer ou récupérer l'organisation Clerk
  let clerkOrgId = orgId;
  if (!clerkOrgId) {
    const client = await clerkClient();
    const org = await client.organizations.createOrganization({
      name: data.raisonSociale,
      createdBy: userId,
    });
    clerkOrgId = org.id;
  }

  // Créer le profil entreprise
  const [entreprise] = await db
    .insert(entreprises)
    .values({
      clerkOrgId: clerkOrgId!,
      raisonSociale: data.raisonSociale,
      siret: data.siret,
    })
    .onConflictDoUpdate({
      target: [entreprises.clerkOrgId],
      set: {
        raisonSociale: data.raisonSociale,
        siret: data.siret,
        updatedAt: new Date(),
      },
    })
    .returning();

  // Créer le contact principal
  if (entreprise) {
    await db
      .insert(contactsEntreprise)
      .values({
        entrepriseId: entreprise.id,
        clerkUserId: userId,
        nom: data.nom,
        fonction: data.fonction,
        email: data.email,
        telephone: data.telephone,
      })
      .onConflictDoNothing();
  }

  // Mettre à jour les métadonnées Clerk
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { typeCompte: "entreprise" },
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function mettreAJourProfilIntervenant(data: {
  nom?: string;
  prenom?: string;
  telephone?: string;
  adresse?: string;
  siret?: string;
  bio?: string;
  competences?: string[];
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Non authentifié");

  await db
    .update(intervenants)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(intervenants.clerkUserId, userId));

  revalidatePath("/espace-intervenant/profil");
  return { success: true };
}

export async function mettreAJourProfilEntreprise(data: {
  raisonSociale?: string;
  siret?: string;
  adresseFacturation?: string;
  tvaIntra?: string;
}) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Non authentifié");

  await db
    .update(entreprises)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(entreprises.clerkOrgId, orgId));

  revalidatePath("/espace-entreprise/profil");
  return { success: true };
}
