"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaCheck, FaTimes, FaPlus, FaRegFilePdf, FaFileExcel } from "react-icons/fa";
import axios from "axios";

interface Maintenance {
    _id: string;
    timestamp: number;
    details: string;
    requestedBy: string;
    status: "pending" | "approved" | "rejected";
}

export default function MaintenancePage() {
    const [requests, setRequests] = useState<Maintenance[]>([]);
    const [details, setDetails] = useState("");
    const [requestedBy, setRequestedBy] = useState("");
    const [showForm, setShowForm] = useState(false);

    // Load existing maintenance requests from Express backend
    const loadRequests = async () => {
        try {
            const res = await axios.get("http://localhost:5000/maintenance");
            setRequests(res.data);
        } catch (err) {
            console.log("Fetch error =>", err);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    // Submit maintenance to Express/MongoDB
    const submitRequest = async () => {
        if (!details || !requestedBy) return;

        const payload = {
            details,
            requestedBy,
        };

        try {
            const res = await axios.post("http://localhost:5000/maintenance", payload);

            setRequests([res.data, ...requests]); // Insert newly created DB record

            setDetails("");
            setRequestedBy("");
            setShowForm(false);
        } catch (err) {
            console.log("Submit error =>", err);
        }
    };

    const updateStatus = async (id: string, status: "approved" | "rejected") => {
        try {
            const res = await axios.put(`http://localhost:5000/maintenance/${id}`, { status });

            setRequests((prev) => prev.map((r) => (r._id === id ? res.data : r)));
        } catch (err) {
            console.log("Update error =>", err);
        }
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

        const csvContent = csvRows.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "maintenance_requests.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadPDF = async () => {
        try {
            const res = await axios.get("http://localhost:5000/maintenance/pdf", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "maintenance_requests.pdf";
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.log("PDF download error =>", err);
        }
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

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700"
                    >
                        <FaPlus /> New Request
                    </button>


                    <button
                        onClick={downloadTable}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-[#008800]/70 border border-green-800 hover:bg-[green]"
                    >
                        <FaFileExcel /> Download Excel
                    </button>

                    <button
                        onClick={downloadPDF}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-[#661010] border border-red-800 hover:bg-[#b63030]"
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
                        <div className="flex justify-between items-center text-lg text-gray-300 font-semibold">
                            <span>Request Maintenance</span>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                                <FaTimes />
                            </button>
                        </div>

                        <input
                            placeholder="Requested By"
                            value={requestedBy}
                            onChange={(e) => setRequestedBy(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/30 border border-gray-700"
                        />

                        <textarea
                            placeholder="Maintenance Details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/30 border border-gray-700 min-h-[100px]"
                        />

                        <button
                            onClick={submitRequest}
                            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700"
                        >
                            Submit Request
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            <tr key={req._id} className="border-t border-gray-800">
                                <td className="p-3">{new Date(req.timestamp).toLocaleString()}</td>
                                <td className="p-3">{req.details}</td>
                                <td className="p-3">{req.requestedBy}</td>
                                <td className="p-3 capitalize">{req.status}</td>

                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => updateStatus(req._id, "approved")}
                                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700"
                                    >
                                        <FaCheck />
                                    </button>

                                    <button
                                        onClick={() => updateStatus(req._id, "rejected")}
                                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700"
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
