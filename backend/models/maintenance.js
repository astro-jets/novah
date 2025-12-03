import mongoose from "mongoose";

const MaintenanceSchema = new mongoose.Schema({
    timestamp: Number,
    details: String,
    requestedBy: String,
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
});

const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);
export default Maintenance;
