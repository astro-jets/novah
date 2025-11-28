import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Replace with your UNO port
const port = new SerialPort({ path: "COM4", baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let latestData = {};

parser.on("data", (line) => {
  try {
    const data = JSON.parse(line);
    latestData = data;
    console.log("Received:", data);
    io.emit("sensorData", data); // broadcast JSON to frontend
  } catch (err) {
    console.error("Invalid JSON:", line);
  }
});

app.get("/api/latest", (req, res) => {
  res.json(latestData); // endpoint for REST requests
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
