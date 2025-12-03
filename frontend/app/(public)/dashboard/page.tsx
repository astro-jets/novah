'use client'

import React, { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFlask, FaBell } from "react-icons/fa";
import MetricCard from "@/components/MetricCard";
import { useSensorStore } from "@/store/useSensorStore";
import { getStatus, manualDose } from "@/actions/actions";
import ChartComponent from "@/components/Chart";
import LoadingModal from "@/components/modals/Loader";
import { useAlertStore } from "@/store/useAlertStore"; // Global Alert Store

export default function ControlRoomUI(): JSX.Element {
    // 1. REMOVED: const [alerts, setAlerts] = useState<string[]>([]); // <- Remove local alert state

    const [isDosing, setIsDosing] = useState(false);
    const [laoding, setLoading] = useState(true);
    const [dosingAmount, setDosingAmount] = useState<number>(0);

    // Read the current alerts from the global Zustand store for local display
    const currentGlobalAlerts = useAlertStore((s) => s.alerts);

    // Hardcoded data for demonstration. In a real app, you'd use:
    const { tds, ph, temperature, timestamp } = useSensorStore((s) => s.data);
    // const tds = 0;
    // const ph = 9;
    // const temperature = 40;
    // const timestamp = Date.now();

    // The activeAlerts count is now derived from the global store
    const activeAlerts = currentGlobalAlerts.length;


    // Alert generation logic
    useEffect(() => {
        const newAlerts: string[] = [];

        // 🟢 FIX 1: Activate the TDS alert
        if (tds === 0)
            newAlerts.push("🛑 TDS Meter needs to be fixed! Value is 0.");

        // 🟢 FIX 2: PH alerts were already active, but adding a check for values
        if ((temperature as number) > 30)
            newAlerts.push("⚠️ Temperature is too high! (> 30°C)");

        if ((temperature as number) < 10)
            newAlerts.push("🧊 Temperature is too low! (< 10°C)");

        if ((ph as number) > 8.5)
            newAlerts.push("🚨 PH is too high! (> 8.5)");

        if ((ph as number) < 6.5)
            newAlerts.push("🧪 PH is too low! (< 6.5)");

        // Update the global store state using the functional update pattern
        useAlertStore.setState(prev => {
            const prevAlerts = prev.alerts;

            // Check if the new array is the same as the previous array (order-independent comparison)
            // This prevents unnecessary global store updates and re-renders
            const isSame =
                prevAlerts.length === newAlerts.length &&
                prevAlerts.every(a => newAlerts.includes(a));

            if (!isSame) {
                return { alerts: newAlerts };
            }
            return prev;
        });

    }, [tds, temperature, ph]); // Dependencies remain the sensor values


    // Only set loading to false once the hardcoded (or fetched) data is available
    useEffect(() => {
        if (ph && temperature && timestamp) {
            setLoading(false)
        }
    }, [ph, temperature, timestamp]);

    console.log("Data => ",
        { tds, ph, temperature, timestamp }
    )

    // ml → milliseconds
    const MS_PER_ML = 25000 / 15;

    const handleDose = async () => {
        if (!dosingAmount || dosingAmount <= 0) return;

        const ms = Math.round(dosingAmount * MS_PER_ML);

        console.log("Sending dose time:", ms, "ms");

        setIsDosing(true);
        await manualDose(ms);

        setIsDosing(false);
    };

    return (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-6">
            {ph ?
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#071014]/50 to-[#041217]/30 border border-gray-800 flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-400">pH (avg)</div>
                                    <div className="text-3xl font-bold">{ph}</div>
                                    <div className="text-sm text-gray-500">Last 1hour</div>
                                </div>
                                <div className="text-4xl text-emerald-300">{<FaFlask />}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#071014]/50 to-[#041217]/30 border border-gray-800 flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-400">Active Alerts</div>
                                    {/* Now correctly using the store derived activeAlerts */}
                                    <div className="text-3xl font-bold">{activeAlerts}</div>
                                    <div className="text-sm text-gray-500">Need attention</div>
                                </div>
                                <div className="text-4xl text-red-400">{<FaBell />}</div>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-[#091014]/60 border border-gray-800 min-h-[260px] flex flex-col">
                            <div className="px-4 pt-4 flex items-center justify-between mb-3">
                                <div>
                                    <div className="text-sm text-gray-400">Realtime Chart</div>
                                    <div className="text-xs text-gray-500">pH · Turbidity · temperature</div>
                                </div>
                                <div className="text-xs text-gray-400">Streaming • {new Date().toLocaleTimeString()}</div>
                            </div>

                            <ChartComponent ph={ph} tds={tds as number} temperature={temperature as number} timestamp={timestamp as number} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <MetricCard sensor={
                                { key: 'tds', name: 'TDS', status: 'normal', unit: 'tds', value: tds as number, lastUpdated: timestamp as number }
                            } />

                            <MetricCard sensor={
                                { key: 'temperature', name: 'temperature', status: 'normal', unit: '℃', value: (temperature as number), lastUpdated: timestamp as number }
                            } />

                        </div>
                    </div>

                    <aside className="flex flex-col gap-4">
                        <div className="p-4 rounded-2xl bg-[#091014]/60 border border-gray-800 min-h-[150px]">
                            <div className="text-sm text-gray-400">Quick Controls</div>

                            {/* NEW INPUT BOX */}
                            <div className="mt-3 flex flex-col gap-2">
                                <input
                                    type="number"
                                    value={dosingAmount}
                                    onChange={(e) => setDosingAmount(Number(e.target.value))}
                                    placeholder="Enter ml"
                                    className="px-3 py-2 rounded-xl bg-black/30 border border-gray-700 text-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                                />

                                <button
                                    onClick={handleDose}
                                    disabled={isDosing}
                                    className={`cursor-pointer px-4 py-2 rounded-xl
                                       ${isDosing ? "cursor-not-allowed opacity-50 border-amber-600/30 bg-amber-500 animate-pulse ease-in-out"
                                            : "bg-emerald-600/10 border border-emerald-600/30 text-emerald-300 hover:bg-emerald-600/20 transition-colors"}`}
                                >
                                    {!isDosing ? "Dose Now" : "Dosing"}
                                </button>
                            </div>
                        </div>

                        {/* alerts */}
                        <div className="p-4 rounded-2xl bg-[#071014]/60 border border-gray-800 flex-1 flex flex-col">
                            <div className="text-sm text-gray-400">Alerts</div>
                            <div className="mt-3 overflow-auto flex-1">
                                {/* 🟢 FIX 3: Using currentGlobalAlerts from the store */}
                                {currentGlobalAlerts.length === 0 ? (
                                    <div className="text-sm text-gray-500">No active alerts ✅</div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {currentGlobalAlerts.map((a, i) => (
                                            <div key={i} className="text-sm p-2 rounded-md bg-red-900/10 border border-red-800 text-red-300">
                                                {a}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </section>
                : <LoadingModal isLoading={laoding} message="Loading.." />
            }
        </motion.div>
    );
}