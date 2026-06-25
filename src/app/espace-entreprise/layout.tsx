import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const dynamic = "force-dynamic";
export default async function EntrepriseLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/connexion");

  const typeCompte = (sessionClaims?.metadata as { typeCompte?: string })?.typeCompte;
  if (!typeCompte) redirect("/onboarding");
  if (typeCompte !== "entreprise") {
    if (typeCompte === "intervenant") redirect("/espace-intervenant");
    redirect("/onboarding");
  }

  return (
    <DashboardLayout type="entreprise">
      {children}
    </DashboardLayout>
  );
}
