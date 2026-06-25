import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { entreprises, evenements } from "@/db/schema";
import { eq, gte } from "drizzle-orm";
import PlanningClient from "./PlanningClient";

export const metadata = { title: "Planning — Espace Entreprise" };

export default async function PlanningEntreprisePage() {
  const { orgId } = await auth();
  const entreprise = await db.query.entreprises.findFirst({
    where: eq(entreprises.clerkOrgId, orgId!),
  });

  const evenementsAVenir = entreprise
    ? await db.query.evenements.findMany({
        where: eq(evenements.entrepriseId, entreprise.id),
        orderBy: (e, { asc }) => [asc(e.dateDebut)],
        with: { missions: { with: { poste: true, intervenant: true } } },
      })
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Planning</h1>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble de vos événements et équipes</p>
      </div>
      <PlanningClient evenements={evenementsAVenir} />
    </div>
  );
}
