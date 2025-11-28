
'use client'

import React, { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFlask, FaBell } from "react-icons/fa";
import MetricCard from "@/components/MetricCard";
import { useSensorStore } from "@/store/useSensorStore";
import { getStatus, manualDose } from "@/actions/actions";
import ChartComponent from "@/components/Chart";

export default function ControlRoomUI(): JSX.Element {
    const [alerts, setAlerts] = useState<string[]>([]);
    const [isDosing, setIsDosing] = useState(false);
    const [dosingAmount, setDosingAmount] = useState<number>(0);
    // const [v, sv] = useState<any>(null);

    const { tds, ph, temperature, timestamp } = useSensorStore((s) => s.data);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const data = await getStatus();
    //             sv(data);
    //         } catch (e) {
    //             console.log("Sensor fetch error:", e);
    //         }
    //     };

    //     fetchData();
    // }, []); // ← VERY IMPORTANT

    console.log("Data => ",
        { tds, ph, temperature, timestamp }
    )

    const activeAlerts = alerts.length;

    // ml → milliseconds
    const MS_PER_ML = 25000 / 15;

    const handleDose = async () => {
        if (!dosingAmount || dosingAmount <= 0) return;

        const ms = Math.round(dosingAmount * MS_PER_ML);

        console.log("Sending dose time:", ms, "ms");

        setIsDosing(true);
        await manualDose(ms);

        // Automatically reset dosing state after calculated time
        setTimeout(() => {
            setIsDosing(false);
        }, ms + 1000); // Extra second buffer


    };

    return (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-6">
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
                                <div className="text-3xl font-bold">{activeAlerts}</div>
                                <div className="text-sm text-gray-500">Need attention</div>
                            </div>
                            <div className="text-4xl text-red-400">{<FaBell />}</div>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#091014]/60 border border-gray-800 min-h-[260px] flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="text-sm text-gray-400">Realtime Chart</div>
                                <div className="text-xs text-gray-500">pH · Turbidity · temperature</div>
                            </div>
                            <div className="text-xs text-gray-400">Streaming • {new Date().toLocaleTimeString()}</div>
                        </div>

                        <div className="flex-1 flex items-center justify-center text-gray-600">
                            {/* <ChartComponent ph={10} tds={20} temperature={30} timestamp="" /> */}
                        </div>
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
                                className="px-3 py-2 rounded-xl bg-black/30 border border-gray-700 text-gray-200"
                            />

                            <button
                                onClick={handleDose}
                                disabled={isDosing}
                                className={`cursor-pointer px-4 py-2 rounded-xl  hover:bg-emerald-600/20
                                     ${isDosing ? "cursor-not-allowed opacity-50 border-amber-600/30 bg-amber-500 animate-pulse ease-in-out"
                                        : "bg-emerald-600/10 border border-emerald-600/30 text-emerald-300"}`}
                            >
                                {!isDosing ? "Dose Now" : "Dosing"}
                            </button>
                        </div>
                    </div>

                    {/* alerts */}
                    <div className="p-4 rounded-2xl bg-[#071014]/60 border border-gray-800 flex-1 flex flex-col">
                        <div className="text-sm text-gray-400">Alerts</div>
                        <div className="mt-3 overflow-auto flex-1">
                            {alerts.length === 0 ? (
                                <div className="text-sm text-gray-500">No active alerts ✅</div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {alerts.map((a, i) => (
                                        <div key={i} className="text-sm p-2 rounded-md bg-red-900/10 border border-red-800">
                                            {a}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </section>
        </motion.div>
    );
}

