'use client'
import Link from "next/link";
import { useState } from "react";
import { FaTachometerAlt, FaFlask, FaBell, FaCogs, FaFileDownload, FaHistory } from "react-icons/fa";

type Page =
    | "dashboard"
    | "sensors"
    | "alerts"
    | "dosing"
    | "reports"
    | "settings"
    | "login";

// Helpers
const nav = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "sensors", label: "Sensors", icon: <FaFlask /> },
    { id: "alerts", label: "Alerts", icon: <FaBell /> },
    { id: "dosing", label: "Dosing", icon: <FaCogs /> },
    { id: "reports", label: "Reports", icon: <FaFileDownload /> },
    { id: "settings", label: "Settings", icon: <FaHistory /> },
] as const;


const SideBar = () => {
    const sidebarOpen = true;
    const alerts = [];
    const dosingAuto = false;
    const [page, setPage] = useState<Page>("dashboard");
    return (
        <aside
            className={`sidebar h-screen w-[20%] z-90 flex flex-col gap-6 p-4 bg-[#041217]/20  border-r border-gray-800 transition-all ${sidebarOpen ? "w-64" : "w-16"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-300 font-bold">BWB</div>
                {sidebarOpen && <div className="text-sm font-semibold">Blantyre Water Board</div>}
            </div>

            <nav className="flex-1 flex flex-col gap-1 z-90">
                {nav.map((n) => (
                    <Link
                        key={n.id}
                        href={`/${n.id}`}
                        className={`nav-item group flex items-center gap-3 p-2 rounded- cursor-pointer text-sm ${page === (n.id as Page) ? "bg-blue-600/10 text-blue-300" : "text-gray-300"
                            }`}
                    >
                        <div className="text-lg">{n.icon}</div>
                        {sidebarOpen && <span className="flex-1 text-left">{n.label}</span>}
                        {sidebarOpen && n.id === "alerts" && alerts.length > 0 && (
                            <span className="text-xs bg-red-600/90 px-2 py-1 rounded-md">{alerts.length}</span>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="flex flex-col gap-2">
                {sidebarOpen && (
                    <>
                        <div className="text-xs text-gray-400">System</div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm">Dosing</div>
                            <div className={`text-xs ${dosingAuto ? "text-blue-300" : "text-gray-400"}`}>{dosingAuto ? "AUTO" : "MANUAL"}</div>
                        </div>
                    </>
                )}
                <button onClick={() => setPage("settings")} className="text-xs text-gray-400 hover:underline">
                    Settings
                </button>
            </div>
        </aside>
    );
}

export default SideBar;