
'use client'

import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";


type props = {
    ph: number, tds: number, temperature: number, timestamp: string
}

const ChartComponent = ({ ph, temperature, tds, timestamp }: props) => {

    const [chartData, setChartData] = useState<any[]>([]);

    // push new sensor reading to chart every time store updates
    useEffect(() => {
        if (!timestamp) return;

        setChartData((prev) => {
            const updated = [
                ...prev,
                {
                    time: new Date(timestamp).toLocaleTimeString(),
                    ph,
                    temperature,
                    tds,
                },
            ];

            // keep last 20 readings max
            return updated.slice(-20);
        });
    }, [ph, temperature, tds, timestamp]);

    return (
        <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2a33" />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                        labelStyle={{ color: "#cbd5e1" }}
                        itemStyle={{ color: "#e2e8f0" }}
                    />
                    <Line type="monotone" dataKey="ph" stroke="#22d3ee" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="temperature" stroke="#f97316" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="tds" stroke="#10b981" dot={false} strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>

    );
}

export default ChartComponent;