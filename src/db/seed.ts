/**
 * Seed obligatoire : 8 postes dans l'ordre exact spécifié
 * Exécuter avec : npx tsx src/db/seed.ts
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { postes, parametresPlateforme } from "./schema";
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const POSTES_SEED = [
  "Directeur de réception",
  "Maître d'hôtel / Chef",
  "MDH / Second",
  "Chef de rang / Partie",
  "Serveur(se) / Cuisinier",
  "Commis (Salle / Cuisine)",
  "Pâtissier(ère)",
  "Hôte(sse)",
];

const PARAMETRES_SEED = [
  {
    cle: "TOLERANCE_MINUTES",
    valeur: "15",
    description: "Tolérance en minutes pour le rapprochement des pointages",
  },
  {
    cle: "REGLE_ARRONDI",
    valeur: "quart_heure",
    description: "Règle d'arrondi des heures facturables (quart_heure | demi_heure | heure)",
  },
  {
    cle: "METHODE_CONCORDANCE",
    valeur: "etablissement",
    description:
      "Méthode en cas de concordance : etablissement | moyenne | chevauchement",
  },
];

async function seed() {
  console.log("🌱 Démarrage du seed...");

  // Seed postes
  console.log("📋 Insertion des postes...");
  for (let i = 0; i < POSTES_SEED.length; i++) {
    await db
      .insert(postes)
      .values({ libelle: POSTES_SEED[i], ordre: i + 1, actif: true })
      .onConflictDoNothing();
  }
  console.log(`✅ ${POSTES_SEED.length} postes insérés`);

  // Seed paramètres plateforme
  console.log("⚙️  Insertion des paramètres plateforme...");
  for (const param of PARAMETRES_SEED) {
    await db
      .insert(parametresPlateforme)
      .values(param)
      .onConflictDoNothing();
  }
  console.log(`✅ ${PARAMETRES_SEED.length} paramètres insérés`);

  console.log("🎉 Seed terminé avec succès !");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur lors du seed :", err);
  process.exit(1);
});
