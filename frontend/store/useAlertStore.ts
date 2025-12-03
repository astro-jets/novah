// src/store/useAlertStore.ts
import { create } from 'zustand';

// Define the shape of your store's state
interface AlertState {
    alerts: string[];
    setAlerts: (newAlerts: string[]) => void;
    // Optional: A function to clear all alerts
    clearAlerts: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    // Initial state
    alerts: [],

    // Action to set (overwrite) the current alerts
    setAlerts: (newAlerts: string[]) => set({ alerts: newAlerts }),

    // Action to clear all alerts
    clearAlerts: () => set({ alerts: [] }),
}));