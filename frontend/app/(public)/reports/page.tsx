"use client";

import React, { useEffect, useState, useMemo } from "react";
import MaintenanceStatusChart from "@/components/MaintenanceStatusChart";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import axios from "axios";

// --- Type Definitions ---

interface Maintenance {
    _id: string;
    timestamp: number;
    details: string;
    requestedBy: string;
    status: "pending" | "approved" | "rejected";
}

interface StatusMetrics {
    totalRequests: number;
    approved: number;
    rejected: number;
    pending: number;
}

interface LineChartDataItem {
    name: string; // Month/Year label (e.g., 'Jul 2024')
    requests: number; // Total requests in that month
    resolved: number; // Total resolved (approved + rejected) in that month
}

// --- Line Chart Component ---

interface LineChartProps {
    data: LineChartDataItem[];
}

/**
 * Renders a responsive line chart showing maintenance requests and resolutions over time.
 */
function MaintenanceLineChart({ data }: LineChartProps) {
    if (data.length === 0) {
        return (
            <div className="text-gray-500 h-full flex items-center justify-center">
                No time-series data available.
            </div>
        );
    }
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #4B5563',
                        borderRadius: '0.5rem',
                        color: '#F9FAFB'
                    }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#10B981" // Emerald
                    activeDot={{ r: 8 }}
                    name="Total Requests"
                    strokeWidth={2}
                />
                <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#3B82F6" // Blue
                    activeDot={{ r: 8 }}
                    name="Resolved Requests"
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

// --- Main Reports Page Component ---

export default function ReportsPage() {
    const [requests, setRequests] = useState<Maintenance[]>([]);
    const [metrics, setMetrics] = useState<StatusMetrics>({
        totalRequests: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
    });
    const [lineChartData, setLineChartData] = useState<LineChartDataItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Processes the raw maintenance array into required metrics and time-series data.
     */
    const processData = (rawRequests: Maintenance[]) => {
        // --- 1. Status Metrics Aggregation ---
        const counts: Record<string, number> = { approved: 0, rejected: 0, pending: 0 };

        rawRequests.forEach(req => {
            if (req.status in counts) {
                counts[req.status]++;
            }
        });

        const newMetrics: StatusMetrics = {
            totalRequests: rawRequests.length,
            approved: counts.approved,
            rejected: counts.rejected,
            pending: counts.pending,
        };
        setMetrics(newMetrics);


        // --- 2. Time Series Data (Monthly Aggregation) ---
        // Use a Map to group and track data by 'YYYY-MM' key for correct chronological sorting
        const monthlyMap = new Map<string, { requests: number, resolved: number, timestamp: number }>();

        rawRequests.forEach(req => {
            const date = new Date(req.timestamp);
            // Key for sorting: YYYY-MM
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            const entry = monthlyMap.get(monthKey) || { requests: 0, resolved: 0, timestamp: req.timestamp };
            entry.requests++;

            // 'Resolved' includes both approved and rejected requests
            if (req.status === "approved" || req.status === "rejected") {
                entry.resolved++;
            }
            monthlyMap.set(monthKey, entry);
        });

        // Format and sort line chart data chronologically
        const formattedLineData: LineChartDataItem[] = Array.from(monthlyMap.entries())
            // Sort by month key (YYYY-MM)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, item]) => ({
                // Readable name for the X-axis
                name: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                requests: item.requests,
                resolved: item.resolved,
            }));

        setLineChartData(formattedLineData);
    };

    /**
     * Fetches maintenance requests from the Express backend.
     */
    const loadRequests = async () => {
        setIsLoading(true);
        try {
            // NOTE: This uses the URL from your prompt: http://localhost:5000/maintenance
            const res = await axios.get<Maintenance[]>("http://localhost:5000/maintenance");
            const rawData = res.data;
            setRequests(rawData);
            processData(rawData); // Process data immediately upon fetch
        } catch (err) {
            console.error("Fetch error:", err);
            // Set default metrics on error
            setMetrics({ totalRequests: 0, approved: 0, rejected: 0, pending: 0 });
            setLineChartData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    // Memoize chart data for performance, based on calculated metrics
    const chartData = useMemo(() => [
        { name: "Approved", value: metrics.approved, color: "hsl(142, 71%, 45%)" }, // Green
        { name: "Rejected", value: metrics.rejected, color: "hsl(0, 72%, 51%)" }, // Red
        { name: "Pending", value: metrics.pending, color: "hsl(215, 80%, 50%)" }, // Blue
    ], [metrics]);


    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center h-screen bg-[#091014]">
                <p className="text-xl text-gray-400">Loading real-time maintenance reports...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-gray-100 bg-[#091014]">
            <h2 className="text-3xl font-bold mb-2">Maintenance Reports</h2>
            <p className="text-gray-400 text-sm mb-6">
                Generate, export, or schedule system maintenance logs reports. Data is loaded from Express endpoint.
            </p>

            {/* --- Action Buttons --- */}
            <div className="flex gap-3 mb-10">
                <button className="px-4 py-2 bg-emerald-600/10 border border-emerald-600/30 rounded-lg text-emerald-300 transition-colors hover:bg-emerald-600/20">
                    Export PDF
                </button>
                <button className="px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-lg text-blue-300 transition-colors hover:bg-blue-600/20">
                    Schedule Weekly
                </button>
            </div>

            {/* --- Key Metrics Cards --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatusCard title="Total Requests" value={metrics.totalRequests} color="text-white" />
                <StatusCard title="Approved" value={metrics.approved} color="text-emerald-400" />
                <StatusCard title="Rejected" value={metrics.rejected} color="text-red-400" />
                <StatusCard title="Pending" value={metrics.pending} color="text-blue-400" />
            </div>

            {/* --- Chart Section --- */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-2 bg-[#121212]/60 p-6 border border-gray-700 rounded-xl rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Request Status Distribution</h3>
                    <div className="h-96 w-full">
                        {/* Status Chart using calculated metrics */}
                        <MaintenanceStatusChart data={chartData} />
                    </div>
                </div>

                {/* Requests Over Time Line Chart */}
                <div className="bg-[#121212]/60 p-6 col-span-3 border border-gray-700 rounded-xl rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Requests Over Time (Monthly)</h3>
                    <div className="h-96 w-full">
                        {/* Line Chart using aggregated time-series data */}
                        <MaintenanceLineChart data={lineChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Helper Components (to keep the main component clean) ---

/**
 * A simple card component to display a key metric.
 */
function StatusCard({ title, value, color }: { title: string, value: number, color: string }) {
    return (
        <div className="bg-[#121212]/60 p-4 border border-gray-700 rounded-xl flex flex-col rounded-2xl">
            <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
            <p className={`text-4xl font-bold ${color}`}>{value}</p>
        </div>
    );
}