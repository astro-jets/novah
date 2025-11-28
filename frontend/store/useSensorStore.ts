import { create } from "zustand";

type SensorData = {
  tds?: number;
  temperature?: number;
  ph?: number;
  timestamp?: number;
};

type SensorStore = {
  data: SensorData;
  updateData: (newData: SensorData) => void;
};

export const useSensorStore = create<SensorStore>((set) => ({
  data: {},
  updateData: (newData) => set({ data: newData }),
}));
