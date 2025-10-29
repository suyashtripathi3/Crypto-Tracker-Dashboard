import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import coinRoutes from "./routes/coins.js";
import historyRoutes from "./routes/history.js";
import { startCron } from "./cron/fetchData.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();
startCron();

app.use("/api/coins", coinRoutes);
app.use("/api/history", historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
