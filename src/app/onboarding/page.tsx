import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OnboardingClient from "./OnboardingClient";

export const metadata = { title: "Bienvenue sur Maextro" };

export default async function OnboardingPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/connexion");

  const typeCompte = (sessionClaims?.metadata as { typeCompte?: string })?.typeCompte;
  if (typeCompte === "intervenant") redirect("/espace-intervenant");
  if (typeCompte === "entreprise") redirect("/espace-entreprise");
  if ((sessionClaims?.metadata as { role?: string })?.role === "admin") redirect("/admin");

  return <OnboardingClient />;
}
