import express from "express";
import HistoryData from "../models/HistoryData.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await HistoryData.insertMany(req.body);
    res.status(201).json({ message: "History saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving history" });
  }
});

router.get("/:coinId", async (req, res) => {
  const history = await HistoryData.find({ coinId: req.params.coinId });
  res.json(history);
});

export default router;
