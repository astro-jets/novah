"use client";
import { useAlertStore } from '@/store/useAlertStore'; // Assuming this is the path to your Zustand store

export default function AlertsPage() {
    // 1. Get the alerts array from the Zustand store
    const alerts = useAlertStore((s) => s.alerts);

    // 2. Define a function to remove an alert when "Resolve" is clicked.
    // This demonstrates an action that modifies the store's state.
    const handleResolve = (alertToRemove: string) => {
        // Use the Zustand set function (setState) to update the alerts array.
        useAlertStore.setState((state) => ({
            // Filter out the alert that was clicked
            alerts: state.alerts.filter((alert) => alert !== alertToRemove),
        }));
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">
                🚨 Active System Alerts ({alerts.length})
            </h2>

            {alerts.length === 0 ? (
                <div className="bg-emerald-900/10 p-5 rounded-xl border border-emerald-800/50">
                    <p className="text-emerald-400 text-lg">
                        No active alerts. System status is **Normal** ✅
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {alerts.map((a, i) => (
                        <div
                            key={a} // Using the alert string itself as the key (assuming unique messages)
                            className="p-4 rounded-xl border border-red-800 bg-red-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-shadow hover:shadow-lg hover:shadow-red-900/20"
                        >
                            <p className="text-base font-medium text-gray-300 mb-3 sm:mb-0">
                                {a}
                            </p>
                            <div className="flex gap-2">
                                {/* Resolve Button */}
                                <button
                                    onClick={() => handleResolve(a)}
                                    className="px-4 py-2 text-xs rounded-md bg-emerald-600/10 border border-emerald-600/30 text-emerald-300 transition-colors hover:bg-emerald-600/20"
                                >
                                    Resolve
                                </button>
                                {/* Escalate Button (placeholder for functionality) */}
                                <button
                                    className="px-4 py-2 text-xs rounded-md bg-red-600/10 border border-red-600/30 text-red-300 transition-colors hover:bg-red-600/20"
                                >
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