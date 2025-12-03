import express from "express";
import axios from "axios";
import cors from "cors";
import mongoose from "mongoose";

import maintenanceRouter from "./routes/maintenances.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ------------------- MONGO CONNECTION ------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/aquarium_system")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error:", err));

// ------------------- ESP32 IP ------------------------
const ESP_IP = "http://192.168.1.100";

// ------------------- PUMP CONTROL ------------------------
app.get("/api/pump/:action", async (req, res) => {
  const { action } = req.params;

  if (!["on", "off"].includes(action)) {
    return res.status(400).json({ error: "Invalid pump action" });
  }

  try {
    const response = await axios.get(`${ESP_IP}/pump/${action}`);
    res.json({ success: true, data: response.data });
  } catch {
    res.status(500).json({ error: "ESP32 unreachable" });
  }
});

// ------------------- MANUAL DOSE ------------------------
app.get("/api/pump/manual/:ms", async (req, res) => {
  const { ms } = req.params;

  try {
    const response = await axios.get(`${ESP_IP}/pump/manual?ms=${ms}`);
    res.json({ success: true, data: response.data });
  } catch {
    res.status(500).json({ error: "ESP32 unreachable" });
  }
});

// ------------------- AUTO MODE ------------------------
app.get("/api/auto/:action", async (req, res) => {
  const { action } = req.params;

  if (!["on", "off"].includes(action)) {
    return res.status(400).json({ error: "Invalid auto action" });
  }

  try {
    const response = await axios.get(`${ESP_IP}/auto/${action}`);
    res.json({ success: true, data: response.data });
  } catch {
    res.status(500).json({ error: "ESP32 unreachable" });
  }
});

// ------------------- GET STATUS ------------------------
app.get("/api/status", async (req, res) => {
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => resolve(null), 10000)
  );

  const esp32Promise = axios
    .get(`${ESP_IP}/status`)
    .then((r) => r.data)
    .catch(() => null);

  const data = await Promise.race([esp32Promise, timeoutPromise]);
  res.json(data);
});

// ------------------- MAINTENANCE ROUTES ------------------------
app.use("/maintenance", maintenanceRouter);

// ------------------- START SERVER ------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});