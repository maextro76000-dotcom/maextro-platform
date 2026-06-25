import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const statutValidationEnum = pgEnum("statut_validation", [
  "en_attente",
  "valide",
  "refuse",
]);

export const statutEvenementEnum = pgEnum("statut_evenement", [
  "brouillon",
  "confirme",
  "en_cours",
  "passe",
  "annule",
]);

export const statutMissionEnum = pgEnum("statut_mission", [
  "a_venir",
  "en_cours",
  "passee",
  "annulee",
]);

export const statutPointageEnum = pgEnum("statut_pointage", [
  "en_attente",
  "concordant",
  "divergent",
  "valide",
]);

export const sourcePointageEnum = pgEnum("source_pointage", [
  "intervenant",
  "etablissement",
]);

export const statutPaiementEnum = pgEnum("statut_paiement", [
  "en_attente",
  "paye",
  "en_retard",
  "annule",
]);

export const creneauDispoEnum = pgEnum("creneau_dispo", [
  "matin",
  "apres_midi",
  "soir",
  "journee",
  "nuit",
]);

export const statutDispoEnum = pgEnum("statut_dispo", [
  "disponible",
  "indisponible",
  "en_mission",
]);

export const typeCompteEnum = pgEnum("type_compte", [
  "intervenant",
  "entreprise",
  "admin",
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const postes = pgTable("postes", {
  id: serial("id").primaryKey(),
  libelle: varchar("libelle", { length: 255 }).notNull(),
  ordre: integer("ordre").notNull().default(0),
  actif: boolean("actif").notNull().default(true),
});

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 255 }).notNull(),
  actif: boolean("actif").notNull().default(true),
});

export const zoneDepartements = pgTable(
  "zone_departements",
  {
    id: serial("id").primaryKey(),
    zoneId: integer("zone_id")
      .notNull()
      .references(() => zones.id, { onDelete: "cascade" }),
    departement: varchar("departement", { length: 3 }).notNull(),
  },
  (t) => [unique().on(t.departement)]
);

export const tarifs = pgTable(
  "tarifs",
  {
    id: serial("id").primaryKey(),
    posteId: integer("poste_id")
      .notNull()
      .references(() => postes.id, { onDelete: "cascade" }),
    zoneId: integer("zone_id")
      .notNull()
      .references(() => zones.id, { onDelete: "cascade" }),
    tarifEtablissementHoraire: numeric("tarif_etablissement_horaire", {
      precision: 10,
      scale: 2,
    }).notNull(),
    remunerationIntervenantHoraire: numeric(
      "remuneration_intervenant_horaire",
      { precision: 10, scale: 2 }
    ).notNull(),
    actif: boolean("actif").notNull().default(true),
  },
  (t) => [unique().on(t.posteId, t.zoneId)]
);

export const intervenants = pgTable("intervenants", {
  id: serial("id").primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
  nom: varchar("nom", { length: 255 }),
  prenom: varchar("prenom", { length: 255 }),
  adresse: text("adresse"),
  telephone: varchar("telephone", { length: 20 }),
  siret: varchar("siret", { length: 14 }),
  kbisBlobUrl: text("kbis_blob_url"),
  competences: text("competences").array(),
  experiences: jsonb("experiences"),
  bio: text("bio"),
  statutValidation: statutValidationEnum("statut_validation")
    .notNull()
    .default("en_attente"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const entreprises = pgTable("entreprises", {
  id: serial("id").primaryKey(),
  clerkOrgId: varchar("clerk_org_id", { length: 255 }).notNull().unique(),
  raisonSociale: varchar("raison_sociale", { length: 255 }),
  siret: varchar("siret", { length: 14 }),
  adresseFacturation: text("adresse_facturation"),
  tvaIntra: varchar("tva_intra", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactsEntreprise = pgTable("contacts_entreprise", {
  id: serial("id").primaryKey(),
  entrepriseId: integer("entreprise_id")
    .notNull()
    .references(() => entreprises.id, { onDelete: "cascade" }),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
  nom: varchar("nom", { length: 255 }),
  fonction: varchar("fonction", { length: 255 }),
  email: varchar("email", { length: 320 }),
  telephone: varchar("telephone", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const evenements = pgTable("evenements", {
  id: serial("id").primaryKey(),
  entrepriseId: integer("entreprise_id")
    .notNull()
    .references(() => entreprises.id, { onDelete: "cascade" }),
  nom: varchar("nom", { length: 255 }).notNull(),
  description: text("description"),
  dateDebut: timestamp("date_debut").notNull(),
  dateFin: timestamp("date_fin").notNull(),
  lieu: text("lieu"),
  codePostal: varchar("code_postal", { length: 10 }),
  departement: varchar("departement", { length: 3 }),
  zoneId: integer("zone_id").references(() => zones.id),
  statut: statutEvenementEnum("statut").notNull().default("brouillon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  evenementId: integer("evenement_id")
    .notNull()
    .references(() => evenements.id, { onDelete: "cascade" }),
  entrepriseId: integer("entreprise_id")
    .notNull()
    .references(() => entreprises.id),
  intervenantId: integer("intervenant_id").references(() => intervenants.id),
  posteId: integer("poste_id")
    .notNull()
    .references(() => postes.id),
  dateDebut: timestamp("date_debut").notNull(),
  dateFin: timestamp("date_fin").notNull(),
  lieu: text("lieu"),
  codePostal: varchar("code_postal", { length: 10 }),
  departement: varchar("departement", { length: 3 }),
  zoneId: integer("zone_id").references(() => zones.id),
  statut: statutMissionEnum("statut").notNull().default("a_venir"),
  statutPointage: statutPointageEnum("statut_pointage")
    .notNull()
    .default("en_attente"),
  heuresFacturables: numeric("heures_facturables", {
    precision: 8,
    scale: 2,
  }),
  ecartMinutes: integer("ecart_minutes"),
  resoluPar: varchar("resolu_par", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const pointages = pgTable(
  "pointages",
  {
    id: serial("id").primaryKey(),
    missionId: integer("mission_id")
      .notNull()
      .references(() => missions.id, { onDelete: "cascade" }),
    source: sourcePointageEnum("source").notNull(),
    saisiPar: varchar("saisi_par", { length: 255 }).notNull(),
    heureArrivee: timestamp("heure_arrivee", { withTimezone: true }).notNull(),
    heureDepart: timestamp("heure_depart", { withTimezone: true }).notNull(),
    pauseMinutes: integer("pause_minutes").notNull().default(0),
    commentaire: text("commentaire"),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [unique().on(t.missionId, t.source)]
);

export const disponibilites = pgTable("disponibilites", {
  id: serial("id").primaryKey(),
  intervenantId: integer("intervenant_id")
    .notNull()
    .references(() => intervenants.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  creneau: creneauDispoEnum("creneau").notNull(),
  statut: statutDispoEnum("statut").notNull().default("disponible"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const factures = pgTable("factures", {
  id: serial("id").primaryKey(),
  missionId: integer("mission_id").references(() => missions.id),
  emetteur: text("emetteur").notNull(),
  destinataire: text("destinataire").notNull(),
  montantHt: numeric("montant_ht", { precision: 10, scale: 2 }).notNull(),
  tva: numeric("tva", { precision: 5, scale: 2 }).notNull().default("20"),
  montantTtc: numeric("montant_ttc", { precision: 10, scale: 2 }).notNull(),
  statutPaiement: statutPaiementEnum("statut_paiement")
    .notNull()
    .default("en_attente"),
  pdfBlobUrl: text("pdf_blob_url"),
  dateEmission: timestamp("date_emission").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Paramètres plateforme (clé/valeur pour TOLERANCE, RÈGLE_ARRONDI, MÉTHODE)
export const parametresPlateforme = pgTable("parametres_plateforme", {
  id: serial("id").primaryKey(),
  cle: varchar("cle", { length: 100 }).notNull().unique(),
  valeur: text("valeur").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const postesRelations = relations(postes, ({ many }) => ({
  tarifs: many(tarifs),
  missions: many(missions),
}));

export const zonesRelations = relations(zones, ({ many }) => ({
  tarifs: many(tarifs),
  departements: many(zoneDepartements),
  evenements: many(evenements),
  missions: many(missions),
}));

export const zoneDepartementsRelations = relations(
  zoneDepartements,
  ({ one }) => ({
    zone: one(zones, { fields: [zoneDepartements.zoneId], references: [zones.id] }),
  })
);

export const tarifsRelations = relations(tarifs, ({ one }) => ({
  poste: one(postes, { fields: [tarifs.posteId], references: [postes.id] }),
  zone: one(zones, { fields: [tarifs.zoneId], references: [zones.id] }),
}));

export const intervenantsRelations = relations(intervenants, ({ many }) => ({
  missions: many(missions),
  disponibilites: many(disponibilites),
}));

export const entreprisesRelations = relations(entreprises, ({ many }) => ({
  contacts: many(contactsEntreprise),
  evenements: many(evenements),
  missions: many(missions),
}));

export const evenementsRelations = relations(evenements, ({ one, many }) => ({
  entreprise: one(entreprises, {
    fields: [evenements.entrepriseId],
    references: [entreprises.id],
  }),
  zone: one(zones, { fields: [evenements.zoneId], references: [zones.id] }),
  missions: many(missions),
}));

export const missionsRelations = relations(missions, ({ one, many }) => ({
  evenement: one(evenements, {
    fields: [missions.evenementId],
    references: [evenements.id],
  }),
  entreprise: one(entreprises, {
    fields: [missions.entrepriseId],
    references: [entreprises.id],
  }),
  intervenant: one(intervenants, {
    fields: [missions.intervenantId],
    references: [intervenants.id],
  }),
  poste: one(postes, { fields: [missions.posteId], references: [postes.id] }),
  zone: one(zones, { fields: [missions.zoneId], references: [zones.id] }),
  pointages: many(pointages),
  factures: many(factures),
}));

export const pointagesRelations = relations(pointages, ({ one }) => ({
  mission: one(missions, {
    fields: [pointages.missionId],
    references: [missions.id],
  }),
}));

export const facturesRelations = relations(factures, ({ one }) => ({
  mission: one(missions, {
    fields: [factures.missionId],
    references: [missions.id],
  }),
}));

// ─── Types inférés ────────────────────────────────────────────────────────────

export type Poste = typeof postes.$inferSelect;
export type Zone = typeof zones.$inferSelect;
export type Tarif = typeof tarifs.$inferSelect;
export type Intervenant = typeof intervenants.$inferSelect;
export type Entreprise = typeof entreprises.$inferSelect;
export type ContactEntreprise = typeof contactsEntreprise.$inferSelect;
export type Evenement = typeof evenements.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type Pointage = typeof pointages.$inferSelect;
export type Disponibilite = typeof disponibilites.$inferSelect;
export type Facture = typeof factures.$inferSelect;
export type ParametrePlateforme = typeof parametresPlateforme.$inferSelect;
