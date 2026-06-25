import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";

export default async function EspaceAdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/connexion");

  // Le rôle admin est stocké dans les publicMetadata de Clerk
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin") {
    redirect("/");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
