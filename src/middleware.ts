import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/entreprises",
  "/candidats",
  "/a-propos",
  "/actualites",
  "/contact",
  "/connexion(.*)",
  "/inscription(.*)",
  "/api/webhooks(.*)",
]);

const isIntervenantRoute = createRouteMatcher(["/espace-intervenant(.*)"]);
const isEntrepriseRoute = createRouteMatcher(["/espace-entreprise(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Routes publiques : toujours accessibles
  if (isPublicRoute(req)) return NextResponse.next();

  // Non authentifié : rediriger vers la connexion
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const typeCompte = (sessionClaims?.metadata as { typeCompte?: string })?.typeCompte;

  // Onboarding : accessible à tous les utilisateurs connectés sans profil
  if (isOnboardingRoute(req)) return NextResponse.next();

  // Si pas encore de type de compte défini → onboarding obligatoire
  if (!typeCompte && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Protection espace intervenant
  if (isIntervenantRoute(req) && typeCompte !== "intervenant") {
    if (typeCompte === "entreprise")
      return NextResponse.redirect(new URL("/espace-entreprise", req.url));
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Protection espace entreprise
  if (isEntrepriseRoute(req) && typeCompte !== "entreprise") {
    if (typeCompte === "intervenant")
      return NextResponse.redirect(new URL("/espace-intervenant", req.url));
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Protection espace admin
  if (isAdminRoute(req) && role !== "admin") {
    if (typeCompte === "intervenant")
      return NextResponse.redirect(new URL("/espace-intervenant", req.url));
    if (typeCompte === "entreprise")
      return NextResponse.redirect(new URL("/espace-entreprise", req.url));
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
