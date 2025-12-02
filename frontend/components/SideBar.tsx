// src/components/SideBar.tsx

'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaFlask, FaBell, FaCogs, FaFileDownload, FaTools, FaSyringe, FaTimes } from "react-icons/fa";

const nav = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "sensors", label: "Sensors", icon: <FaFlask /> },
    { id: "alerts", label: "Alerts", icon: <FaBell /> },
    { id: "dosing", label: "Dosing", icon: <FaSyringe /> },
    { id: "maintenances", label: "Maintenances", icon: <FaTools /> },
    { id: "reports", label: "Reports", icon: <FaFileDownload /> },
    { id: "settings", label: "Settings", icon: <FaCogs /> },
] as const;

interface SideBarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const pathname = usePathname();

    return (
        <aside
            className={`backdrop-blur-2xl sidebar h-screen w-full z-50 flex flex-col gap-6 p-4 bg-[#041217]/20 border-r border-gray-800 transition-transform duration-300 md:w-64`}
        >
            {/* Header for mobile view (shows close button) */}
            <div className="flex justify-between items-center md:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-300 font-bold">BWB</div>
                    <div className="text-sm font-semibold">Blantyre Water Board</div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                    <FaTimes className="text-xl" />
                </button>
            </div>

            {/* Header for desktop view (no close button) */}
            <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-300 font-bold">BWB</div>
                <div className="text-sm font-semibold">Blantyre Water Board</div>
            </div>

            <nav className="flex-1 flex flex-col gap-1 z-90 mt-6 md:mt-0">
                {nav.map((n) => {
                    const isActive = pathname === `/${n.id}`;

                    return (
                        <Link
                            key={n.id}
                            href={`/${n.id}`}
                            className={`group flex items-center gap-3 p-2 mb-4 rounded cursor-pointer text-sm transition-all
                                ${isActive
                                    ? "bg-blue-600/20 text-blue-300"
                                    : "text-gray-300 hover:bg-gray-700/30 hover:scale-105"
                                }`}
                            onClick={() => setSidebarOpen(false)} // Close on mobile click
                        >
                            <div className="text-lg">{n.icon}</div>
                            {/* The span for text is always rendered but might be hidden by CSS depending on `sidebarOpen` state. */}
                            <span>{n.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

export default SideBar;
