"use client";

import { useEffect, useState } from "react";
import { useSensorStore } from "@/store/useSensorStore";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

type SensorReading = {
    timestamp: number;
    tds: number;
    ph: number;
    temperature: number;
};

export default function SensorsPage() {
    const { tds, ph, temperature, timestamp } = useSensorStore((s) => s.data);

    const [history, setHistory] = useState<SensorReading[]>([]);

    // Push incoming sensor data to history
    useEffect(() => {
        if (
            timestamp === undefined ||
            tds === undefined ||
            ph === undefined ||
            temperature === undefined
        ) {
            return;
        }

        setHistory((prev) => [
            ...prev.slice(-50),
            {
                timestamp,
                tds,
                ph,
                temperature,
            },
        ]);
    }, [timestamp, tds, ph, temperature]);

    return (
        <div className="space-y-8">
            <h2 className="text-lg font-semibold mb-4">Sensors Overview</h2>

            {/* ----- TDS CHART ----- */}
            <div className="p-4 bg-[#121212]/60 border border-gray-700 rounded-xl">
                <h3 className="text-white font-medium mb-2">TDS Over Time</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="tdsColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                                stroke="#aaa"
                            />
                            <YAxis stroke="#aaa" />
                            <Tooltip
                                labelFormatter={(t) => new Date(t).toLocaleTimeString()}
                            />
                            <Area
                                type="monotone"
                                dataKey="tds"
                                stroke="#22d3ee"
                                fill="url(#tdsColor)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ----- PH CHART ----- */}
            <div className="p-4 bg-[#121212]/60 border border-gray-700 rounded-xl">
                <h3 className="text-white font-medium mb-2">pH Over Time</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="phColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                                stroke="#aaa"
                            />
                            <YAxis stroke="#aaa" />
                            <Tooltip
                                labelFormatter={(t) => new Date(t).toLocaleTimeString()}
                            />
                            <Area
                                type="monotone"
                                dataKey="ph"
                                stroke="#4ade80"
                                fill="url(#phColor)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ----- TEMPERATURE CHART ----- */}
            <div className="p-4 bg-[#121212]/60 border border-gray-700 rounded-xl">
                <h3 className="text-white font-medium mb-2">Temperature Over Time</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                                stroke="#aaa"
                            />
                            <YAxis stroke="#aaa" />
                            <Tooltip
                                labelFormatter={(t) => new Date(t).toLocaleTimeString()}
                            />
                            <Area
                                type="monotone"
                                dataKey="temperature"
                                stroke="#f87171"
                                fill="url(#tempColor)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
