import mongoose from "mongoose";

const HistoryDataSchema = new mongoose.Schema({
  coinId: String,
  name: String,
  symbol: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  timestamp: { type: Date, default: Date.now },
});

const HistoryData =
  mongoose.models.HistoryData ||
  mongoose.model("HistoryData", HistoryDataSchema);

export default HistoryData;
