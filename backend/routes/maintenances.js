import express from "express";
import PDFDocument  from "pdfkit";
import Maintenance from "../models/Maintenance.js";

const router = express.Router();

// CREATE maintenance request
router.post("/", async (req, res) => {
    try {
        const newReq = await Maintenance.create({
            details: req.body.details,
            requestedBy: req.body.requestedBy,
            timestamp: Date.now(),
            status: "pending"
        });
        res.json(newReq);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all requests
router.get("/", async (req, res) => {
    const list = await Maintenance.find().sort({ timestamp: -1 });
    res.json(list);
});

// UPDATE status
router.put("/:id", async (req, res) => {
    const updated = await Maintenance.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );
    res.json(updated);
});

router.get("/pdf", async (req, res) => {
    try {
        const records = await Maintenance.find().sort({ timestamp: -1 });

        const doc = new PDFDocument({ margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=maintenance_report.pdf");

        doc.pipe(res);

        doc.fontSize(20).text("Maintenance Report", { align: "center" });
        doc.moveDown();

        records.forEach((rec) => {
            doc.fontSize(12).text(`Timestamp: ${new Date(rec.timestamp).toLocaleString()}`);
            doc.text(`Requested By: ${rec.requestedBy}`);
            doc.text(`Details: ${rec.details}`);
            doc.text(`Status: ${rec.status.toUpperCase()}`);
            doc.moveDown();
            doc.moveDown();
        });

        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating PDF");
    }
});


export default router;
