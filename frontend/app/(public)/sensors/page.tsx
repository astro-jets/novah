"use client";
// import useSensorFeed from "@/hooks/useSensorFeed";

type Sensor = {
    id: string;
    name: string;
    key: string;
    value: number;
    unit: string;
    status: "normal" | "warning" | "critical";
    lastUpdated: string;
};


const initialSensors: Sensor[] = [
    { id: "ph", name: "pH Level", key: "ph", value: 7.12, unit: "", status: "normal", lastUpdated: new Date().toISOString() },
    { id: "turb", name: "Turbidity", key: "turbidity", value: 3.8, unit: "NTU", status: "normal", lastUpdated: new Date().toISOString() },
    { id: "temp", name: "Temperature", key: "temperature", value: 24.6, unit: "°C", status: "normal", lastUpdated: new Date().toISOString() },
    { id: "chlor", name: "Residual Chlorine", key: "chlorine", value: 1.18, unit: "mg/L", status: "normal", lastUpdated: new Date().toISOString() },
];

export default function SensorsPage() {
    const sensors = initialSensors;

    return (
        <div className="">
            <h2 className="text-lg font-semibold mb-4">Sensors Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sensors.map((s) => (
                    <div key={s.key} className="p-4 bg-[#121212]/60 border border-gray-700 rounded-xl">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-300 text-sm">{s.name}</p>
                                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-semibold">{s.value.toFixed(2)} <span className="text-gray-500 text-sm">{s.unit}</span></p>
                                <p className="text-xs text-gray-400">{s.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
