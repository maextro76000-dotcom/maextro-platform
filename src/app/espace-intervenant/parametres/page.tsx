import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { intervenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import ParametresClient from "./ParametresClient";

export const metadata = { title: "Paramètres — Espace Intervenant" };

export default async function ParametresIntervenantPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const intervenant = await db.query.intervenants.findFirst({
    where: eq(intervenants.clerkUserId, userId!),
  });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Paramètres & Compte</h1>
        <p className="text-gray-500 mt-1">Gérez vos préférences et informations de connexion</p>
      </div>
      <ParametresClient
        email={user?.emailAddresses[0]?.emailAddress ?? ""}
        notificationsEmail={false}
        notificationsSms={false}
      />
    </div>
  );
}
