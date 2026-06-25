import { db } from "@/db";
import { postes, zones, tarifs } from "@/db/schema";
import ParametresPlatformeClient from "./ParametresPlatformeClient";

export const metadata = { title: "Paramètres plateforme — Admin Maextro" };

export const dynamic = "force-dynamic";
export default async function AdminParametresPage() {
  const [tousPostes, toutesZones, grille] = await Promise.all([
    db.query.postes.findMany({ orderBy: (p, { asc }) => [asc(p.ordre)] }),
    db.query.zones.findMany({ orderBy: (z, { asc }) => [asc(z.nom)] }),
    db.query.tarifs.findMany({
      with: { poste: true, zone: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Paramètres plateforme</h1>
        <p className="text-gray-400 mt-1">Gérez les postes, les zones géographiques et la grille tarifaire</p>
      </div>
      <ParametresPlatformeClient postes={tousPostes} zones={toutesZones} grille={grille} />
    </div>
  );
}
