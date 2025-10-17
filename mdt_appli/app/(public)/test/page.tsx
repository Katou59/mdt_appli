import React from "react";

export default function DarkBluePreview() {
    return (
        <div className="min-h-screen bg-[#0B1120] text-[#E0E6F0] flex flex-col items-center justify-center gap-8 p-10">
            <div className="bg-[#1A2238] border border-[#2D3954] rounded-2xl p-8 w-full max-w-md shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Interface sombre bleue</h1>
                <p className="text-[#A0AEC0] mb-6">
                    Aperçu d'un thème moderne basé sur un bleu foncé profond.
                </p>

                <div className="flex flex-col gap-3">
                    <button className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-semibold py-2 px-4 rounded-md transition-colors">
                        Bouton principal
                    </button>
                    <button className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-2 px-4 rounded-md transition-colors">
                        Succès
                    </button>
                    <button className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold py-2 px-4 rounded-md transition-colors">
                        Erreur
                    </button>
                    <button className="bg-[#EAB308] hover:bg-[#CA8A04] text-black font-semibold py-2 px-4 rounded-md transition-colors">
                        Avertissement
                    </button>
                </div>
            </div>
        </div>
    );
}
