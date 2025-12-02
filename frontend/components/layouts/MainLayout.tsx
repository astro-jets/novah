'use client'

import { useState } from 'react';
import ThemeProvider from "@/theme/theme-provider";
import TopBar from "@/components/TopBar";
import SideBar from "@/components/SideBar";
import SensorProvider from "@/components/SensorProvider";

export default function MainLayout({ children, }: { children: React.ReactNode; }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex w-full">
                {/* Sidebar is hidden on smaller screens, shown on medium screens */}
                <div className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:w-[20%] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </div>

                {/* Main Content Area */}
                <div className={`flex flex-col flex-1 gap-6 w-full transition-all duration-300 ease-in-out md:w-[80%] ${sidebarOpen ? 'md:ml-[20%]' : 'md:ml-0'}`}>
                    <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="px-4 py-2">
                        <SensorProvider>
                            {children}
                        </SensorProvider>
                    </div>
                </div>

                {/* Overlay for mobile view when sidebar is open */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}
            </div>
        </ThemeProvider>
    );
}
