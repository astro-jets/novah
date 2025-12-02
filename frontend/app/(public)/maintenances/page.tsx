"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaCheck, FaTimes, FaPlus, FaRegFilePdf } from "react-icons/fa";

interface Maintenance {
    id: string;
    timestamp: number;
    details: string;
    requestedBy: string;
    status: "pending" | "approved" | "rejected";
}

export default function MaintenancePage() {
    const [requests, setRequests] = useState<Maintenance[]>([]);
    const [details, setDetails] = useState("");
    const [requestedBy, setRequestedBy] = useState("");
    const [showForm, setShowForm] = useState(false); // New state for form visibility

    const submitRequest = () => {
        if (!details || !requestedBy) return;

        const newRequest: Maintenance = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            details,
            requestedBy,
            status: "pending",
        };

        setRequests([newRequest, ...requests]);
        setDetails("");
        setRequestedBy("");
        setShowForm(false); // Close the form after submission
    };

    const updateStatus = (id: string, status: "approved" | "rejected") => {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    };

    const downloadTable = () => {
        const csvRows = [
            ["Timestamp", "Details", "Requested By", "Status"],
            ...requests.map((r) => [
                new Date(r.timestamp).toLocaleString(),
                r.details,
                r.requestedBy,
                r.status,
            ]),
        ];

        const csvContent = csvRows.map((row) => row.join(",")).join("");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "maintenance_requests.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen text-white space-y-10">
            <div className="flex justify-between items-center">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-white"
                >
                    Maintenance Requests
                </motion.h1>
                {/* DOWNLOAD BUTTON */}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                        <FaPlus /> New Request
                    </button>
                    <button
                        onClick={downloadTable}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-[#0b1116]/70 border border-gray-800 hover:bg-[#131b22] transition-colors"
                    >
                        <FaRegFilePdf /> Download PDF
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#091014]/60 border border-gray-800 p-6 rounded-2xl space-y-4"
                    >
                        <div className="flex justify-between items-center text-lg font-semibold text-gray-300">
                            <span>Request Maintenance</span>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                                <FaTimes />
                            </button>
                        </div>

                        <input
                            placeholder="Requested By"
                            value={requestedBy}
                            onChange={(e) => setRequestedBy(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/30 border border-gray-700 text-gray-200"
                        />

                        <textarea
                            placeholder="Maintenance Details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/30 border border-gray-700 text-gray-200 min-h-[100px]"
                        />

                        <button
                            onClick={submitRequest}
                            className="px-4 py-2 rounded-xl cursor-pointer bg-green-600 hover:bg-green-700 text-white transition-colors"
                        >
                            Submit Request
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>



            {/* TABLE */}
            <div className="bg-[#091014]/60 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#0d171c] text-gray-300">
                        <tr>
                            <th className="p-3 text-left">Timestamp</th>
                            <th className="p-3 text-left">Details</th>
                            <th className="p-3 text-left">Requested By</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id} className="border-t border-gray-800">
                                <td className="p-3 text-gray-300">{new Date(req.timestamp).toLocaleString()}</td>
                                <td className="p-3 text-gray-200">{req.details}</td>
                                <td className="p-3 text-gray-300">{req.requestedBy}</td>
                                <td className="p-3 capitalize text-red-400">{req.status}</td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => updateStatus(req.id, "approved")}
                                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(req.id, "rejected")}
                                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        <FaTimes />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
