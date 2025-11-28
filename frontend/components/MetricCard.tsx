"use client"

import { motion } from "framer-motion";
import { FaFlask, FaWaveSquare, FaThermometerHalf, FaTint } from "react-icons/fa";

type Sensor = {
    // id: string;
    name: string;
    key: string;
    value: number;
    unit: string;
    status: "normal" | "warning" | "critical";
    lastUpdated: number;
};


const MetricCard = ({ sensor }: { sensor: Sensor }) => {
    const glow = sensor.status === "critical" ? "ring-red-500/30" : sensor.status === "warning" ? "ring-yellow-500/20" : "ring-emerald-400/10";
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl bg-[#0e1112]/60 border border-gray-800 shadow-lg ${glow}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-xs text-gray-400 uppercase">{sensor.name}</div>
                    <div className="text-2xl font-bold mt-1 tracking-tight">{sensor.value} <span className="text-sm text-gray-400">{sensor.unit}</span></div>
                    <div className="text-xs text-gray-500 mt-1">Updated {new Date(sensor.lastUpdated).toLocaleTimeString()}</div>
                </div>
                <div className="text-3xl text-emerald-300/90">{sensor.key === "ph" ? <FaFlask /> : sensor.key === "turbidity" ? <FaWaveSquare /> : sensor.key === "temperature" ? <FaThermometerHalf /> : <FaTint />}</div>
            </div>
        </motion.div>
    );
}

export default MetricCard;