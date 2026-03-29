import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat";
import profileRoutes from "./routes/profile";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Main Routes
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);

// Database Connect
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));
} else {
  console.log("⚠️ No MONGO_URI provided. Attempting local MongoDB connection for prototype.");
  mongoose.connect('mongodb://127.0.0.1:27017/et-ai-concierge')
    .then(() => console.log("✅ Local MongoDB Connected on port 27017"))
    .catch(err => console.log("❌ MongoDB Error. Please ensure it's running natively or via Docker."));
}

app.listen(PORT, () => {
  console.log(`🚀 ET AI Concierge Backend running on http://localhost:${PORT}`);
});
