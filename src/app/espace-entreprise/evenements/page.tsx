import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { entreprises, evenements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, Calendar, MapPin, Users, ChevronRight } from "lucide-react";

export const metadata = { title: "Mes Événements — Espace Entreprise" };

const statutColors: Record<string, string> = {
  brouillon: "bg-gray-100 text-gray-600",
  publie: "bg-blue-100 text-blue-700",
  en_cours: "bg-green-100 text-green-700",
  termine: "bg-gray-100 text-gray-500",
  annule: "bg-red-100 text-red-600",
};

const statutLabels: Record<string, string> = {
  brouillon: "Brouillon",
  publie: "Publié",
  en_cours: "En cours",
  termine: "Terminé",
  annule: "Annulé",
};

export default async function EvenementsPage() {
  const { orgId } = await auth();
  const entreprise = await db.query.entreprises.findFirst({
    where: eq(entreprises.clerkOrgId, orgId!),
  });

  const mesEvenements = entreprise
    ? await db.query.evenements.findMany({
        where: eq(evenements.entrepriseId, entreprise.id),
        orderBy: [desc(evenements.dateDebut)],
        with: { missions: { with: { poste: true } } },
      })
    : [];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Mes Événements</h1>
          <p className="text-gray-500 mt-1">{mesEvenements.length} événement(s) au total</p>
        </div>
        <Link
          href="/espace-entreprise/evenements/nouveau"
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={16} /> Nouvel événement
        </Link>
      </div>

      {mesEvenements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Aucun événement</h3>
          <p className="text-gray-500 text-sm mb-6">Créez votre premier événement pour commencer à recruter du personnel.</p>
          <Link href="/espace-entreprise/evenements/nouveau"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors text-sm">
            <Plus size={16} /> Créer un événement
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {mesEvenements.map((e) => {
            const totalIntervenants = e.missions.length;
            return (
              <Link
                key={e.id}
                href={`/espace-entreprise/evenements/${e.id}`}
                className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-6 py-5 hover:border-yellow-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors">{e.nom}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={11} />
                        {new Date(e.dateDebut).toLocaleDateString("fr-FR")}
                        {e.dateFin && ` → ${new Date(e.dateFin).toLocaleDateString("fr-FR")}`}
                      </span>
                      {e.lieu && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={11} /> {e.lieu}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Users size={11} /> {totalIntervenants} intervenant(s)
                      </span>
                    </div>
                    {e.missions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {Array.from(new Set(e.missions.map((m) => m.poste?.libelle).filter(Boolean))).map((lib) => (
                          <span key={lib} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {e.missions.filter((m) => m.poste?.libelle === lib).length}× {lib}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[e.statut] ?? "bg-gray-100 text-gray-600"}`}>
                    {statutLabels[e.statut] ?? e.statut}
                  </span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-yellow-500 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
