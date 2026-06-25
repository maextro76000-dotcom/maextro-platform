import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { intervenants, missions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import MissionsClient from "./MissionsClient";

export const metadata = { title: "Mes Missions — Espace Intervenant" };

export const dynamic = "force-dynamic";
export default async function MissionsPage() {
  const { userId } = await auth();
  const intervenant = await db.query.intervenants.findFirst({
    where: eq(intervenants.clerkUserId, userId!),
  });

  const mesMissions = intervenant
    ? await db.query.missions.findMany({
        where: eq(missions.intervenantId, intervenant.id),
        orderBy: [desc(missions.dateDebut)],
        with: {
          evenement: true,
          poste: true,
          pointages: true,
        },
      })
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Mes Missions</h1>
        <p className="text-gray-500 mt-1">Consultez vos missions et effectuez vos pointages</p>
      </div>
      <MissionsClient missions={mesMissions} />
    </div>
  );
}
