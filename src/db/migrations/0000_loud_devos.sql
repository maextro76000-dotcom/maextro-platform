CREATE TYPE "public"."creneau_dispo" AS ENUM('matin', 'apres_midi', 'soir', 'journee', 'nuit');--> statement-breakpoint
CREATE TYPE "public"."source_pointage" AS ENUM('intervenant', 'etablissement');--> statement-breakpoint
CREATE TYPE "public"."statut_dispo" AS ENUM('disponible', 'indisponible', 'en_mission');--> statement-breakpoint
CREATE TYPE "public"."statut_evenement" AS ENUM('brouillon', 'confirme', 'en_cours', 'passe', 'annule');--> statement-breakpoint
CREATE TYPE "public"."statut_mission" AS ENUM('a_venir', 'en_cours', 'passee', 'annulee');--> statement-breakpoint
CREATE TYPE "public"."statut_paiement" AS ENUM('en_attente', 'paye', 'en_retard', 'annule');--> statement-breakpoint
CREATE TYPE "public"."statut_pointage" AS ENUM('en_attente', 'concordant', 'divergent', 'valide');--> statement-breakpoint
CREATE TYPE "public"."statut_validation" AS ENUM('en_attente', 'valide', 'refuse');--> statement-breakpoint
CREATE TYPE "public"."type_compte" AS ENUM('intervenant', 'entreprise', 'admin');--> statement-breakpoint
CREATE TABLE "contacts_entreprise" (
	"id" serial PRIMARY KEY NOT NULL,
	"entreprise_id" integer NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"nom" varchar(255),
	"fonction" varchar(255),
	"email" varchar(320),
	"telephone" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disponibilites" (
	"id" serial PRIMARY KEY NOT NULL,
	"intervenant_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"creneau" "creneau_dispo" NOT NULL,
	"statut" "statut_dispo" DEFAULT 'disponible' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entreprises" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_org_id" varchar(255) NOT NULL,
	"raison_sociale" varchar(255),
	"siret" varchar(14),
	"adresse_facturation" text,
	"tva_intra" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "entreprises_clerk_org_id_unique" UNIQUE("clerk_org_id")
);
--> statement-breakpoint
CREATE TABLE "evenements" (
	"id" serial PRIMARY KEY NOT NULL,
	"entreprise_id" integer NOT NULL,
	"nom" varchar(255) NOT NULL,
	"description" text,
	"date_debut" timestamp NOT NULL,
	"date_fin" timestamp NOT NULL,
	"lieu" text,
	"code_postal" varchar(10),
	"departement" varchar(3),
	"zone_id" integer,
	"statut" "statut_evenement" DEFAULT 'brouillon' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "factures" (
	"id" serial PRIMARY KEY NOT NULL,
	"mission_id" integer,
	"emetteur" text NOT NULL,
	"destinataire" text NOT NULL,
	"montant_ht" numeric(10, 2) NOT NULL,
	"tva" numeric(5, 2) DEFAULT '20' NOT NULL,
	"montant_ttc" numeric(10, 2) NOT NULL,
	"statut_paiement" "statut_paiement" DEFAULT 'en_attente' NOT NULL,
	"pdf_blob_url" text,
	"date_emission" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intervenants" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"nom" varchar(255),
	"prenom" varchar(255),
	"adresse" text,
	"telephone" varchar(20),
	"siret" varchar(14),
	"kbis_blob_url" text,
	"competences" text[],
	"experiences" jsonb,
	"bio" text,
	"statut_validation" "statut_validation" DEFAULT 'en_attente' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "intervenants_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "missions" (
	"id" serial PRIMARY KEY NOT NULL,
	"evenement_id" integer NOT NULL,
	"entreprise_id" integer NOT NULL,
	"intervenant_id" integer,
	"poste_id" integer NOT NULL,
	"date_debut" timestamp NOT NULL,
	"date_fin" timestamp NOT NULL,
	"lieu" text,
	"code_postal" varchar(10),
	"departement" varchar(3),
	"zone_id" integer,
	"statut" "statut_mission" DEFAULT 'a_venir' NOT NULL,
	"statut_pointage" "statut_pointage" DEFAULT 'en_attente' NOT NULL,
	"heures_facturables" numeric(8, 2),
	"ecart_minutes" integer,
	"resolu_par" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parametres_plateforme" (
	"id" serial PRIMARY KEY NOT NULL,
	"cle" varchar(100) NOT NULL,
	"valeur" text NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "parametres_plateforme_cle_unique" UNIQUE("cle")
);
--> statement-breakpoint
CREATE TABLE "pointages" (
	"id" serial PRIMARY KEY NOT NULL,
	"mission_id" integer NOT NULL,
	"source" "source_pointage" NOT NULL,
	"saisi_par" varchar(255) NOT NULL,
	"heure_arrivee" timestamp with time zone NOT NULL,
	"heure_depart" timestamp with time zone NOT NULL,
	"pause_minutes" integer DEFAULT 0 NOT NULL,
	"commentaire" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pointages_mission_id_source_unique" UNIQUE("mission_id","source")
);
--> statement-breakpoint
CREATE TABLE "postes" (
	"id" serial PRIMARY KEY NOT NULL,
	"libelle" varchar(255) NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	"actif" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tarifs" (
	"id" serial PRIMARY KEY NOT NULL,
	"poste_id" integer NOT NULL,
	"zone_id" integer NOT NULL,
	"tarif_etablissement_horaire" numeric(10, 2) NOT NULL,
	"remuneration_intervenant_horaire" numeric(10, 2) NOT NULL,
	"actif" boolean DEFAULT true NOT NULL,
	CONSTRAINT "tarifs_poste_id_zone_id_unique" UNIQUE("poste_id","zone_id")
);
--> statement-breakpoint
CREATE TABLE "zone_departements" (
	"id" serial PRIMARY KEY NOT NULL,
	"zone_id" integer NOT NULL,
	"departement" varchar(3) NOT NULL,
	CONSTRAINT "zone_departements_departement_unique" UNIQUE("departement")
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(255) NOT NULL,
	"actif" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contacts_entreprise" ADD CONSTRAINT "contacts_entreprise_entreprise_id_entreprises_id_fk" FOREIGN KEY ("entreprise_id") REFERENCES "public"."entreprises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disponibilites" ADD CONSTRAINT "disponibilites_intervenant_id_intervenants_id_fk" FOREIGN KEY ("intervenant_id") REFERENCES "public"."intervenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evenements" ADD CONSTRAINT "evenements_entreprise_id_entreprises_id_fk" FOREIGN KEY ("entreprise_id") REFERENCES "public"."entreprises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evenements" ADD CONSTRAINT "evenements_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factures" ADD CONSTRAINT "factures_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missions" ADD CONSTRAINT "missions_evenement_id_evenements_id_fk" FOREIGN KEY ("evenement_id") REFERENCES "public"."evenements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missions" ADD CONSTRAINT "missions_entreprise_id_entreprises_id_fk" FOREIGN KEY ("entreprise_id") REFERENCES "public"."entreprises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missions" ADD CONSTRAINT "missions_intervenant_id_intervenants_id_fk" FOREIGN KEY ("intervenant_id") REFERENCES "public"."intervenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missions" ADD CONSTRAINT "missions_poste_id_postes_id_fk" FOREIGN KEY ("poste_id") REFERENCES "public"."postes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missions" ADD CONSTRAINT "missions_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pointages" ADD CONSTRAINT "pointages_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarifs" ADD CONSTRAINT "tarifs_poste_id_postes_id_fk" FOREIGN KEY ("poste_id") REFERENCES "public"."postes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarifs" ADD CONSTRAINT "tarifs_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zone_departements" ADD CONSTRAINT "zone_departements_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE cascade ON UPDATE no action;