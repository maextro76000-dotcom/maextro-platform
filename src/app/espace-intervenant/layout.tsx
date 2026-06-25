import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const dynamic = "force-dynamic";
export default async function IntervenantLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/connexion");

  const typeCompte = (sessionClaims?.metadata as { typeCompte?: string })?.typeCompte;
  if (!typeCompte) redirect("/onboarding");
  if (typeCompte !== "intervenant") {
    if (typeCompte === "entreprise") redirect("/espace-entreprise");
    redirect("/onboarding");
  }

  return (
    <DashboardLayout type="intervenant">
      {children}
    </DashboardLayout>
  );
}
