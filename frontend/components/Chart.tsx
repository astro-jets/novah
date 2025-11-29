'use client'

import { useState, useEffect } from "react";
import {
    BarChart, // Changed from LineChart
    Bar,       // Changed from Line
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend, // Added Legend for better clarity in a bar chart
} from "recharts";


type props = {
    ph: number, tds: number, temperature: number, timestamp: number
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
                    // For a bar chart, showing the latest values at a specific time is more common.
                    // Instead of time on the X-axis for all three, let's keep one entry per update
                    // but since you want to plot all three (temp, tds, ph) on bars for the latest reading,
                    // a line chart over time is generally better for time series. 
                    // To show them as *bars* for the latest reading, we need a different data structure 
                    // but based on your original logic (pushing to an array), we'll keep the time series structure
                    // and use the data for a Grouped Bar Chart over time.
                    time: new Date(timestamp).toLocaleTimeString(),
                    ph,
                    temperature,
                    tds,
                },
            ];

            // keep last 5 readings max
            return updated.slice(-6);
        });
    }, [ph, temperature, tds, timestamp]);

    return (
        <div className="flex-1 w-full">
            <ResponsiveContainer className={'w-full'} width="100%" height="100%">
                {/* Changed from LineChart */}
                <BarChart data={chartData} className={'w-full p-0'}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2a33" />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                        labelStyle={{ color: "#cbd5e1" }}
                        itemStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend wrapperStyle={{ color: "#e2e8f0" }} />
                    {/* Changed from Line to Bar */}
                    <Bar dataKey="ph" fill="#22d3ee" name="pH" />
                    <Bar dataKey="temperature" fill="#f97316" name="Temperature" />
                    <Bar dataKey="tds" fill="#10b981" name="TDS" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ChartComponent;