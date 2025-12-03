"use client";

import { useState } from "react";

// Define a type for a User object
interface User {
    id: number;
    name: string;
    role: string;
    initials: string;
    color: string; // Tailwind color class suffix for avatar
}

export default function SettingsPage() {
    // State for the sensor thresholds (kept from original)
    const [thresholds, setThresholds] = useState({
        ph: 7.5,
        tds: 500,
        temp: 28,
    });

    // State for the users array
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: "Novahiwa Mukiwa", role: "Admin", initials: "N.M", color: "blue" },
        { id: 2, name: "James Saidi", role: "Facilitator", initials: "J.S", color: "purple" },
        { id: 3, name: "Grace Banda", role: "Operator", initials: "G.B", color: "green" },
    ]);

    // State to toggle the add user form visibility
    const [showAddUserForm, setShowAddUserForm] = useState(false);

    // State for the new user form inputs
    const [newUserForm, setNewUserForm] = useState({
        name: '',
        role: 'Operator', // Default role
    });

    // --- Helper Functions for Users ---

    // Function to generate initials from a full name
    const getInitials = (name: string): string => {
        return name.split(' ').map(n => n[0]).join('.').toUpperCase().slice(0, 3);
    };

    // Function to get a random color for the avatar
    const getRandomColor = (): string => {
        const colors = ["red", "orange", "yellow", "green", "teal", "blue", "indigo", "purple", "pink"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Generic handler to update sensor settings (kept from original)
    const handleChange = (key: string, value: number) => {
        setThresholds((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Handler to delete a user
    const handleDeleteUser = (userId: number) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };

    // Handler for form input changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUserForm(prev => ({ ...prev, [name]: value }));
    };

    // Handler to submit and add the new user
    const handleSubmitNewUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserForm.name.trim()) return;

        const newUser: User = {
            id: Date.now(),
            name: newUserForm.name.trim(),
            role: newUserForm.role,
            initials: getInitials(newUserForm.name.trim()),
            color: getRandomColor(),
        };

        setUsers((prevUsers) => [...prevUsers, newUser]);
        setNewUserForm({ name: '', role: 'Operator' }); // Reset form fields
        setShowAddUserForm(false); // Hide the form
    };

    // Helper component for the User Card
    const UserCard = ({ user }: { user: User }) => {
        const avatarClass = `w-8 h-8 rounded-full bg-${user.color}-500/20 flex items-center justify-center text-${user.color}-400 text-xs font-semibold`;

        return (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="flex items-center gap-3">
                    {/* Avatar based on initials and color */}
                    <div className={avatarClass}>
                        {user.initials}
                    </div>
                    <div>
                        <p className="text-sm text-gray-300">{user.name}</p>
                        <p className="text-[10px] text-gray-500">{user.role}</p>
                    </div>
                </div>
                {/* Actions: Delete */}
                <div className="flex items-center gap-2">
                    <button
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                        onClick={() => handleDeleteUser(user.id)}
                        // Prevent deleting the first user (Admin) for a better demo flow
                        disabled={user.id === 1}
                        title={user.id === 1 ? "Cannot delete the primary Admin in this demo" : "Delete User"}
                    >
                        Delete
                    </button>
                    <button className="text-xs text-gray-400 hover:text-white transition-colors">
                        Edit
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl min-h-screen text-white font-sans">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-100">System Settings ⚙️</h2>
                <button className="cursor-pointer text-sm text-gray-400 hover:text-teal-400 transition-colors py-1 px-3 border border-gray-700 rounded-lg">
                    Reset Defaults
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SENSOR THRESHOLDS CARD */}
                <div className="p-5 bg-[#121212] shadow-lg border border-gray-700 rounded-xl flex flex-col gap-6">
                    <div className="border-b border-gray-800 pb-3">
                        <p className="text-lg text-teal-400 font-medium">Sensor Thresholds 💧</p>
                        <p className="text-xs text-gray-500">
                            Set the safety limits for alert triggers on water quality and temperature.
                        </p>
                    </div>

                    {/* pH Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-sm text-gray-400 font-medium">
                                Max pH Level
                            </label>
                            <span className="text-teal-400 font-mono text-sm bg-teal-400/10 px-2 py-1 rounded">
                                {thresholds.ph} pH
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="14"
                            step="0.1"
                            value={thresholds.ph}
                            onChange={(e) => handleChange("ph", parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 transition-all"
                        />
                        <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                            <span>Acidic (0)</span>
                            <span>Alkaline (14)</span>
                        </div>
                    </div>

                    {/* TDS Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-sm text-gray-400 font-medium">
                                Max TDS Value
                            </label>
                            <span className="text-amber-400 font-mono text-sm bg-amber-400/10 px-2 py-1 rounded">
                                {thresholds.tds} ppm
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={thresholds.tds}
                            onChange={(e) => handleChange("tds", parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
                        />
                        <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                            <span>0 ppm</span>
                            <span>1000 ppm</span>
                        </div>
                    </div>

                    {/* Temperature Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-sm text-gray-400 font-medium">
                                Max Temperature
                            </label>
                            <span className="text-rose-400 font-mono text-sm bg-rose-400/10 px-2 py-1 rounded">
                                {thresholds.temp}°C
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={thresholds.temp}
                            onChange={(e) => handleChange("temp", parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400 transition-all"
                        />
                        <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                            <span>Freezing (0°C)</span>
                            <span>Boiling (100°C)</span>
                        </div>
                    </div>
                </div>

                {/* USER MANAGEMENT CARD (UPDATED with Form) */}
                <div className="p-5 bg-[#121212] shadow-lg border border-gray-700 rounded-xl h-fit">
                    <div className="border-b border-gray-800 pb-3 mb-4">
                        <p className="text-lg text-indigo-400 font-medium">User Management 👥</p>
                        <p className="text-xs text-gray-500">
                            Manage operator access levels and credentials.
                        </p>
                    </div>

                    {showAddUserForm ? (
                        /* --- ADD USER FORM --- */
                        <form onSubmit={handleSubmitNewUser} className="space-y-4 p-2">
                            <h3 className="text-md text-gray-200 font-semibold mb-3">Add New System User</h3>

                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newUserForm.name}
                                    onChange={handleFormChange}
                                    placeholder="e.g., Jane Doe"
                                    className="w-full px-3 py-2 text-sm text-gray-200 bg-gray-900 border border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Role Select */}
                            <div>
                                <label htmlFor="role" className="block text-xs font-medium text-gray-400 mb-1">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={newUserForm.role}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 text-sm text-gray-200 bg-gray-900 border border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Facilitator">Facilitator</option>
                                    <option value="Operator">Operator</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddUserForm(false)}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    disabled={!newUserForm.name.trim()}
                                >
                                    Save User
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* --- USER LIST & ADD BUTTON --- */
                        <div className="space-y-3">
                            {/* Dynamically render User Cards */}
                            {users.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))}

                            {/* Button to show the Add New User Form */}
                            <button
                                className="w-full cursor-pointer mt-2 py-2 text-xs border border-dashed border-gray-600 text-gray-400 rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => setShowAddUserForm(true)}
                            >
                                + Add New User
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}