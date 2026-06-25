import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Résout le département à partir d'un code postal français */
export function getDepartementFromCodePostal(cp: string): string {
  if (!cp || cp.length < 2) return "";
  const prefix = cp.substring(0, 2);
  // Corse
  if (prefix === "20") {
    const num = parseInt(cp);
    return num <= 20190 ? "2A" : "2B";
  }
  // DOM-TOM
  if (cp.startsWith("97")) return cp.substring(0, 3);
  return prefix;
}

/** Formate un montant en euros */
export function formatEuros(amount: number | string | null): string {
  if (amount === null || amount === undefined) return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(num);
}

/** Formate une date en français */
export function formatDate(date: Date | string | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/** Formate une date + heure */
export function formatDateTime(date: Date | string | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** Calcule la durée nette en minutes entre arrivée et départ moins les pauses */
export function calculerDureeNette(
  arrivee: Date,
  depart: Date,
  pauseMinutes: number
): number {
  const diffMs = depart.getTime() - arrivee.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  return Math.max(0, diffMinutes - pauseMinutes);
}

/** Arrondit les heures facturables selon la règle configurée */
export function arrondirHeures(
  minutes: number,
  regle: "quart_heure" | "demi_heure" | "heure"
): number {
  const map = { quart_heure: 15, demi_heure: 30, heure: 60 };
  const bloc = map[regle];
  return Math.ceil(minutes / bloc) * bloc / 60;
}

/** Calcule le chevauchement entre deux créneaux de pointage */
export function calculerChevauchement(
  arrivee1: Date, depart1: Date,
  arrivee2: Date, depart2: Date,
  pause1: number, pause2: number
): number {
  const start = Math.max(arrivee1.getTime(), arrivee2.getTime());
  const end = Math.min(depart1.getTime(), depart2.getTime());
  if (end <= start) return 0;
  const chevauchementMinutes = (end - start) / 60000;
  const pauseMoyenne = (pause1 + pause2) / 2;
  return Math.max(0, chevauchementMinutes - pauseMoyenne) / 60;
}
