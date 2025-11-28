"use client";

export default function ReportsPage() {
    return (
        <div className="">
            <h2 className="text-lg font-semibold mb-4">Reports</h2>
            <p className="text-gray-400 text-sm mb-6">
                Generate, export or schedule system performance reports.
            </p>

            <div className="flex gap-3">
                <button className="px-4 py-2 bg-emerald-600/10 border border-emerald-600/30 rounded-lg text-emerald-300">
                    Export PDF
                </button>
                <button className="px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-lg text-blue-300">
                    Schedule Weekly
                </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#121212]/60 p-4 border border-gray-700 rounded-xl">
                    <h3 className="text-gray-300 text-sm">Daily Summary</h3>
                    <p className="text-xs text-gray-500 mt-2">[Data summary placeholder]</p>
                </div>
                <div className="bg-[#121212]/60 p-4 border border-gray-700 rounded-xl">
                    <h3 className="text-gray-300 text-sm">Weekly Trends</h3>
                    <p className="text-xs text-gray-500 mt-2">[Chart placeholder]</p>
                </div>
            </div>
        </div>
    );
}
