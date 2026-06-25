"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  evenements,
  missions,
  entreprises,
  zones,
  zoneDepartements,
  tarifs,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getDepartementFromCodePostal } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BesoinsSchema = z.array(
  z.object({
    posteId: z.number(),
    quantite: z.number().min(1),
    dateDebut: z.date(),
    dateFin: z.date(),
  })
);

export async function creerEvenement(data: {
  nom: string;
  description?: string;
  dateDebut: Date;
  dateFin: Date;
  lieu: string;
  codePostal: string;
}) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) throw new Error("Non authentifié");

  const entreprise = await db.query.entreprises.findFirst({
    where: eq(entreprises.clerkOrgId, orgId),
  });
  if (!entreprise) throw new Error("Profil entreprise introuvable");

  const departement = getDepartementFromCodePostal(data.codePostal);
  const zone = await resoudreZone(departement);

  const [evenement] = await db
    .insert(evenements)
    .values({
      entrepriseId: entreprise.id,
      nom: data.nom,
      description: data.description,
      dateDebut: data.dateDebut,
      dateFin: data.dateFin,
      lieu: data.lieu,
      codePostal: data.codePostal,
      departement,
      zoneId: zone?.id ?? null,
      statut: "brouillon",
    })
    .returning();

  revalidatePath("/espace-entreprise/evenements");
  return evenement;
}

export async function ajouterBesoins(
  evenementId: number,
  besoins: z.infer<typeof BesoinsSchema>
) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Non authentifié");

  const entreprise = await db.query.entreprises.findFirst({
    where: eq(entreprises.clerkOrgId, orgId),
  });
  if (!entreprise) throw new Error("Profil entreprise introuvable");

  const evenement = await db.query.evenements.findFirst({
    where: and(
      eq(evenements.id, evenementId),
      eq(evenements.entrepriseId, entreprise.id)
    ),
  });
  if (!evenement) throw new Error("Événement introuvable ou non autorisé");

  const departement = evenement.departement ?? "";
  const zone = await resoudreZone(departement);

  const missionsACreer = [];
  for (const besoin of besoins) {
    for (let i = 0; i < besoin.quantite; i++) {
      missionsACreer.push({
        evenementId,
        entrepriseId: entreprise.id,
        posteId: besoin.posteId,
        dateDebut: besoin.dateDebut,
        dateFin: besoin.dateFin,
        lieu: evenement.lieu,
        codePostal: evenement.codePostal,
        departement,
        zoneId: zone?.id ?? null,
        statut: "a_venir" as const,
        statutPointage: "en_attente" as const,
      });
    }
  }

  if (missionsACreer.length > 0) {
    await db.insert(missions).values(missionsACreer);
  }

  // Passer l'événement en "confirme"
  await db
    .update(evenements)
    .set({ statut: "confirme", updatedAt: new Date() })
    .where(eq(evenements.id, evenementId));

  revalidatePath("/espace-entreprise/evenements");
  return { missionsCreees: missionsACreer.length };
}

async function resoudreZone(departement: string) {
  if (!departement) return null;
  const zoneDept = await db.query.zoneDepartements.findFirst({
    where: eq(zoneDepartements.departement, departement),
    with: { zone: true },
  });
  return zoneDept?.zone ?? null;
}

export async function resoudreTarif(posteId: number, codePostal: string) {
  const departement = getDepartementFromCodePostal(codePostal);
  const zone = await resoudreZone(departement);
  if (!zone) return { tarif: null, alerte: "zone_introuvable" };

  const tarif = await db.query.tarifs.findFirst({
    where: and(
      eq(tarifs.posteId, posteId),
      eq(tarifs.zoneId, zone.id),
      eq(tarifs.actif, true)
    ),
  });

  if (!tarif) return { tarif: null, zone, alerte: "tarif_non_defini" };
  return { tarif, zone, alerte: null };
}

export async function emettreFacture(evenementId: number) {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Non authentifié");
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin") throw new Error("Accès refusé");

  const evenement = await db.query.evenements.findFirst({
    where: eq(evenements.id, evenementId),
    with: { missions: { with: { poste: true } }, entreprise: true },
  });
  if (!evenement) throw new Error("Événement introuvable");

  // Créer une facture par mission validée
  const missionsValidees = evenement.missions.filter(
    (m) => m.statutPointage === "concordant" || m.statutPointage === "valide"
  );

  const { factures } = await import("@/db/schema");
  let facturees = 0;

  for (const m of missionsValidees) {
    const heures = parseFloat(m.heuresFacturables ?? "0");
    const tarifResult = m.codePostal && m.posteId
      ? await resoudreTarif(m.posteId, m.codePostal)
      : { tarif: null };
    const taux = tarifResult.tarif
      ? parseFloat(tarifResult.tarif.tarifEtablissementHoraire)
      : 0;
    const montantHt = (heures * taux).toFixed(2);
    const tvaRate = "20.00";
    const montantTtc = (heures * taux * 1.2).toFixed(2);

    await db.insert(factures).values({
      missionId: m.id,
      emetteur: "Maextro",
      destinataire: evenement.entreprise?.raisonSociale ?? "Client",
      montantHt,
      tva: tvaRate,
      montantTtc,
      statutPaiement: "en_attente",
    });
    facturees++;
  }

  revalidatePath("/admin/facturation");
  return { success: true, facturees };
}

export async function affecterIntervenant(
  missionId: number,
  intervenantId: number
) {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Non authentifié");
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin") throw new Error("Accès refusé");

  await db
    .update(missions)
    .set({ intervenantId, updatedAt: new Date() })
    .where(eq(missions.id, missionId));

  revalidatePath("/admin/evenements");
  return { success: true };
}
