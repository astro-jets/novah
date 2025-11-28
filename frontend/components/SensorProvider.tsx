"use client";

import { useEffect } from "react";
import { useSensorStore } from "@/store/useSensorStore";
import { getStatus } from "@/actions/actions";

export default function SensorProvider({ children }: { children: React.ReactNode }) {
  const updateData = useSensorStore((s) => s.updateData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStatus();


        console.log("Fetched sensor data:", data);

        if (data) {
          updateData({
            ...data,    // <-- extract the sensor fields properly
            timestamp: Date.now(),
          });
        }
      } catch (e) {
        console.log("Sensor fetch error:", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [updateData]);

  return <>{children}</>;
}
