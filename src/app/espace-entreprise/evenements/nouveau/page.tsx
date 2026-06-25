import { db } from "@/db";
import { postes } from "@/db/schema";
import NouvelEvenementForm from "./NouvelEvenementForm";

export const metadata = { title: "Nouvel Événement — Espace Entreprise" };

export default async function NouvelEvenementPage() {
  const tousPostes = await db.query.postes.findMany({
    orderBy: (p, { asc }) => [asc(p.ordre)],
  });

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Nouvel Événement</h1>
        <p className="text-gray-500 mt-1">Décrivez votre événement et vos besoins en personnel</p>
      </div>
      <NouvelEvenementForm postes={tousPostes} />
    </div>
  );
}
