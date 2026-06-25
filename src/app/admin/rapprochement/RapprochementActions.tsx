"use client";

import { useState } from "react";
import { arbitrerMission } from "@/actions/pointage";
import { useRouter } from "next/navigation";

export default function RapprochementActions({ missionId }: { missionId: number }) {
  const [loading, setLoading] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [heuresCustom, setHeuresCustom] = useState("");
  const router = useRouter();

  async function handleArbitrage(heures: number) {
    setLoading(true);
    try {
      await arbitrerMission(missionId, heures);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 flex-shrink-0 min-w-[160px]">
      <button
        onClick={() => setShowCustom(!showCustom)}
        className="px-3 py-2 bg-yellow-600/10 text-yellow-400 text-xs font-medium rounded-lg hover:bg-yellow-600/20 transition-colors whitespace-nowrap"
      >
        Arbitrer manuellement
      </button>
      {showCustom && (
        <div className="bg-gray-800 rounded-xl p-3 space-y-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Heures facturables</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                step="0.25"
                value={heuresCustom}
                onChange={(e) => setHeuresCustom(e.target.value)}
                placeholder="ex: 7.5"
                className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:ring-1 focus:ring-yellow-500 outline-none"
              />
              <span className="text-gray-400 text-xs">h</span>
            </div>
          </div>
          <button
            onClick={() => handleArbitrage(parseFloat(heuresCustom))}
            disabled={!heuresCustom || isNaN(parseFloat(heuresCustom)) || loading}
            className="w-full px-3 py-1.5 bg-yellow-600 text-white text-xs font-semibold rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Validation..." : "Valider"}
          </button>
        </div>
      )}
    </div>
  );
}
