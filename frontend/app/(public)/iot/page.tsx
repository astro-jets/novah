'use client'
import { useState } from "react";
import {manualDose} from "@/actions/actions"

export default function LedControl() {
  const [status, setStatus] = useState("");

  const toggle = async (state) => {
    manualDose()
    setStatus(data.message || data.error);
  };

  return (
    <div className="p-4 border rounded">
      <h1 className="text-xl font-bold">LED Controller</h1>

      <button
        onClick={() => toggle("on")}
        className="bg-green-500 text-white p-2 rounded m-2"
      >
        Turn ON
      </button>

      <button
        onClick={() => toggle("off")}
        className="bg-red-500 text-white p-2 rounded m-2"
      >
        Turn OFF
      </button>

      <p className="text-white">Status: {status}</p>
    </div>
  );
}
