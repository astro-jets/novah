// src/components/TopBar.tsx

"use client"
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import React from 'react';

interface TopBarProps {
    onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
    return (
        <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
                {/* Hamburger menu button, only visible on medium screens and smaller */}
                <button
                    aria-label="toggle sidebar"
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
                >
                    <FaBars />
                </button>
                <h2 className="text-xl font-semibold tracking-tight">Control Room</h2>
                <span className="ml-3 text-sm text-gray-400">Live FEED</span>
            </div>

            <div className="hidden md:flex items-center gap-3">
                <div className="text-right mr-3">
                    <div className="text-sm text-gray-300">Operator</div>
                    <div className="text-xs text-gray-400">Novahiwa M.</div>
                </div>
                <button
                    // Add your actual logout logic here
                    // onClick={() => {
                    //     setLoggedIn(false);
                    // }}
                    className="bg-white/6 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                    <FaSignOutAlt /> Sign out
                </button>
            </div>
        </div>
    );
}

export default TopBar;
