"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // backend address

export default function TdsLiveCard() {
    const [tds, setTds] = useState<string>("--");

    useEffect(() => {
        socket.on("tdsData", (data: string) => {
            setTds(data);
        });

        return () => {
            socket.off("tdsData");
        };
    }, []);

    return (
        <div className="p-6 bg-white/10 rounded-2xl text-center text-white">
            <h2 className="text-xl font-semibold mb-2">Live TDS Reading</h2>
            <p className="text-4xl font-bold">{tds}</p>
            <p className="text-sm opacity-60 mt-1">ppm</p>
        </div>
    );
}
