import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maextro — Agence de Staffing Événementiel",
    template: "%s | Maextro",
  },
  description:
    "Maextro est l'agence de staffing événementiel de référence à Rouen. Nous mettons en relation les meilleurs talents avec les plus beaux événements : service, traiteur, restauration.",
  keywords: [
    "staffing événementiel",
    "agence staffing Rouen",
    "personnel événementiel",
    "traiteur",
    "restauration",
    "hôtes hôtesses",
    "serveurs",
    "maextro",
  ],
  authors: [{ name: "Maextro" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Maextro",
    title: "Maextro — Agence de Staffing Événementiel",
    description:
      "Talents d'exception pour vos événements. Maextro, votre agence de staffing dédiée aux métiers de l'événementiel, du traiteur et de la restauration.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
