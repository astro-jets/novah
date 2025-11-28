"use client";
import { useState } from "react";

export default function DosingPage() {
    const [auto, setAuto] = useState(false);
    const [manualDose, setManualDose] = useState(0.5);

    return (
        <div className="p-6 bg-[#0e0e0e]/70 border border-gray-800 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Dosing Control</h2>

            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setAuto(true)}
                    className={`px-4 py-2 rounded-lg border ${auto
                        ? "bg-emerald-600/20 border-emerald-600/40 text-emerald-300"
                        : "bg-transparent border-gray-700"
                        }`}
                >
                    Auto Mode
                </button>
                <button
                    onClick={() => setAuto(false)}
                    className={`px-4 py-2 rounded-lg border ${!auto
                        ? "bg-red-600/20 border-red-600/40 text-red-300"
                        : "bg-transparent border-gray-700"
                        }`}
                >
                    Manual Mode
                </button>
            </div>

            {!auto && (
                <div className="flex items-center gap-3 mb-6">
                    <input
                        type="number"
                        value={manualDose}
                        onChange={(e) => setManualDose(parseFloat(e.target.value))}
                        className="bg-transparent border border-gray-700 px-3 py-2 rounded-lg w-28 text-sm"
                    />
                    <button className="px-3 py-2 bg-emerald-600/10 border border-emerald-600/30 rounded-lg text-emerald-300">
                        Trigger Manual Dose
                    </button>
                </div>
            )}

            <p className="text-xs text-gray-400">Pump status: Running</p>
        </div>
    );
}
