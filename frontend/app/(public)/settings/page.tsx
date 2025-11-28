"use client";

export default function SettingsPage() {
    return (
        <div className="p-6 bg-[#0e0e0e]/70 border border-gray-800 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">System Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#121212]/60 border border-gray-700 rounded-xl">
                    <p className="text-gray-300 text-sm mb-2">Sensor Thresholds</p>
                    <p className="text-xs text-gray-500">[Edit pH safe range, turbidity limits, etc.]</p>
                </div>
                <div className="p-4 bg-[#121212]/60 border border-gray-700 rounded-xl">
                    <p className="text-gray-300 text-sm mb-2">User Management</p>
                    <p className="text-xs text-gray-500">Add, remove, or assign operator roles.</p>
                </div>
            </div>
        </div>
    );
}
