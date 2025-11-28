"use client";
export default function AlertsPage() {
    const alerts = [
        "High turbidity detected at Intake A",
        "Chlorine below safe level",
    ]

    return (
        <div className="">
            <h2 className="text-lg font-semibold mb-4">Active Alerts</h2>

            {alerts.length === 0 ? (
                <p className="text-gray-500">No active alerts ✅</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {alerts.map((a, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-xl border border-red-800 bg-red-900/10 flex justify-between items-center"
                        >
                            <p className="text-sm text-gray-300">{a}</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-xs rounded-md bg-emerald-600/10 border border-emerald-600/30">
                                    Resolve
                                </button>
                                <button className="px-3 py-1 text-xs rounded-md bg-red-600/10 border border-red-600/30">
                                    Escalate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
