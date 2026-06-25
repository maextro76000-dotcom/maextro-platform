"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  pointages,
  missions,
  parametresPlateforme,
  intervenants,
  entreprises,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  calculerDureeNette,
  arrondirHeures,
  calculerChevauchement,
} from "@/lib/utils";
import { revalidatePath } from "next/cache";

type RegleArrondi = "quart_heure" | "demi_heure" | "heure";
type MethodeConcordance = "etablissement" | "moyenne" | "chevauchement";

async function getParametres() {
  const params = await db.select().from(parametresPlateforme);
  const map: Record<string, string> = {};
  for (const p of params) map[p.cle] = p.valeur;
  return {
    tolerance: parseInt(map["TOLERANCE_MINUTES"] ?? "15"),
    regleArrondi: (map["REGLE_ARRONDI"] ?? "quart_heure") as RegleArrondi,
    methode: (map["METHODE_CONCORDANCE"] ?? "etablissement") as MethodeConcordance,
  };
}

export async function pointerArrivee(
  missionId: number,
  heureArrivee: Date,
  options?: { latitude?: number; longitude?: number }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Non authentifié");

  // Vérifier que l'utilisateur est bien l'intervenant de cette mission
  const intervenant = await db.query.intervenants.findFirst({
    where: eq(intervenants.clerkUserId, userId),
  });
  if (!intervenant) throw new Error("Profil intervenant introuvable");

  const mission = await db.query.missions.findFirst({
    where: and(
      eq(missions.id, missionId),
      eq(missions.intervenantId, intervenant.id)
    ),
  });
  if (!mission) throw new Error("Mission introuvable ou non autorisée");

  // Stocker l'arrivée sans départ (on utilisera heureDepart = heureArrivee temporairement)
  await db
    .insert(pointages)
    .values({
      missionId,
      source: "intervenant",
      saisiPar: userId,
      heureArrivee,
      heureDepart: heureArrivee, // sera mis à jour au départ
      pauseMinutes: 0,
      latitude: options?.latitude ? String(options.latitude) : null,
      longitude: options?.longitude ? String(options.longitude) : null,
    })
    .onConflictDoUpdate({
      target: [pointages.missionId, pointages.source],
      set: {
        heureArrivee,
        latitude: options?.latitude ? String(options.latitude) : null,
        longitude: options?.longitude ? String(options.longitude) : null,
      },
    });

  revalidatePath(`/espace-intervenant/missions`);
  return { success: true };
}

export async function pointerDepart(
  missionId: number,
  heureDepart: Date,
  pauseMinutes: number = 0,
  options?: { latitude?: number; longitude?: number }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Non authentifié");

  const intervenant = await db.query.intervenants.findFirst({
    where: eq(intervenants.clerkUserId, userId),
  });
  if (!intervenant) throw new Error("Profil intervenant introuvable");

  // Mettre à jour le pointage existant
  await db
    .update(pointages)
    .set({
      heureDepart,
      pauseMinutes,
      latitude: options?.latitude ? String(options.latitude) : null,
      longitude: options?.longitude ? String(options.longitude) : null,
    })
    .where(
      and(
        eq(pointages.missionId, missionId),
        eq(pointages.source, "intervenant")
      )
    );

  await tenterRapprochement(missionId);
  revalidatePath(`/espace-intervenant/missions`);
  return { success: true };
}

export async function saisirPointageEtablissement(
  missionId: number,
  heureArrivee: Date,
  heureDepart: Date,
  pauseMinutes: number = 0
) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) throw new Error("Non authentifié");

  // Vérifier que l'organisation est bien l'entreprise de cette mission
  const entreprise = await db.query.entreprises.findFirst({
    where: eq(entreprises.clerkOrgId, orgId),
  });
  if (!entreprise) throw new Error("Profil entreprise introuvable");

  const mission = await db.query.missions.findFirst({
    where: and(
      eq(missions.id, missionId),
      eq(missions.entrepriseId, entreprise.id)
    ),
  });
  if (!mission) throw new Error("Mission introuvable ou non autorisée");

  await db
    .insert(pointages)
    .values({
      missionId,
      source: "etablissement",
      saisiPar: userId,
      heureArrivee,
      heureDepart,
      pauseMinutes,
    })
    .onConflictDoUpdate({
      target: [pointages.missionId, pointages.source],
      set: { heureArrivee, heureDepart, pauseMinutes },
    });

  await tenterRapprochement(missionId);
  revalidatePath(`/espace-entreprise/evenements`);
  return { success: true };
}

async function tenterRapprochement(missionId: number) {
  const tousPointages = await db.query.pointages.findMany({
    where: eq(pointages.missionId, missionId),
  });

  const ptIntervenant = tousPointages.find((p) => p.source === "intervenant");
  const ptEtablissement = tousPointages.find((p) => p.source === "etablissement");

  // Les deux pointages doivent avoir un départ valide (différent de l'arrivée)
  if (!ptIntervenant || !ptEtablissement) return;
  if (ptIntervenant.heureArrivee.getTime() === ptIntervenant.heureDepart.getTime()) return;

  const { tolerance, regleArrondi, methode } = await getParametres();

  const dureeIntervenant = calculerDureeNette(
    ptIntervenant.heureArrivee,
    ptIntervenant.heureDepart,
    ptIntervenant.pauseMinutes
  );
  const dureeEtablissement = calculerDureeNette(
    ptEtablissement.heureArrivee,
    ptEtablissement.heureDepart,
    ptEtablissement.pauseMinutes
  );

  const ecart = Math.abs(dureeIntervenant - dureeEtablissement);

  if (ecart <= tolerance) {
    // Concordant : calculer les heures facturables
    let heuresFacturables: number;

    if (methode === "etablissement") {
      heuresFacturables = arrondirHeures(dureeEtablissement, regleArrondi);
    } else if (methode === "moyenne") {
      heuresFacturables = arrondirHeures(
        Math.round((dureeIntervenant + dureeEtablissement) / 2),
        regleArrondi
      );
    } else {
      // chevauchement
      heuresFacturables = calculerChevauchement(
        ptIntervenant.heureArrivee, ptIntervenant.heureDepart,
        ptEtablissement.heureArrivee, ptEtablissement.heureDepart,
        ptIntervenant.pauseMinutes, ptEtablissement.pauseMinutes
      );
      heuresFacturables = arrondirHeures(Math.round(heuresFacturables * 60), regleArrondi);
    }

    await db
      .update(missions)
      .set({
        statutPointage: "concordant",
        heuresFacturables: String(heuresFacturables),
        ecartMinutes: ecart,
        updatedAt: new Date(),
      })
      .where(eq(missions.id, missionId));
  } else {
    // Divergent : alerte admin
    await db
      .update(missions)
      .set({
        statutPointage: "divergent",
        ecartMinutes: ecart,
        updatedAt: new Date(),
      })
      .where(eq(missions.id, missionId));
  }
}

export async function arbitrerMission(
  missionId: number,
  heuresFacturables: number
) {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Non authentifié");
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin") throw new Error("Accès refusé");

  await db
    .update(missions)
    .set({
      statutPointage: "valide",
      heuresFacturables: String(heuresFacturables),
      resoluPar: userId,
      updatedAt: new Date(),
    })
    .where(eq(missions.id, missionId));

  revalidatePath("/admin/rapprochement");
  return { success: true };
}
