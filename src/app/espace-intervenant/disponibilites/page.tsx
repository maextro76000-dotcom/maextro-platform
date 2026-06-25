import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { intervenants, disponibilites } from "@/db/schema";
import { eq } from "drizzle-orm";
import DisponibilitesClient from "./DisponibilitesClient";

export const metadata = { title: "Disponibilités & Planning — Espace Intervenant" };

export const dynamic = "force-dynamic";
export default async function DisponibilitesPage() {
  const { userId } = await auth();
  const intervenant = await db.query.intervenants.findFirst({
    where: eq(intervenants.clerkUserId, userId!),
  });

  const mesDispos = intervenant
    ? await db.query.disponibilites.findMany({
        where: eq(disponibilites.intervenantId, intervenant.id),
        orderBy: (d, { asc }) => [asc(d.date)],
      })
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Disponibilités & Planning</h1>
        <p className="text-gray-500 mt-1">Indiquez vos créneaux disponibles pour recevoir des missions</p>
      </div>
      <DisponibilitesClient intervenantId={intervenant?.id ?? null} disponibilites={mesDispos} />
    </div>
  );
}
