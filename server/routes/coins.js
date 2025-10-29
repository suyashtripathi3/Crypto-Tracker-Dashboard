import express from "express";
import axios from "axios";
import CurrentData from "../models/CurrentData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
        },
        headers: {
          "User-Agent": "CryptoTracker/1.0",
        },
        timeout: 5000, // avoid hanging if API slow
      }
    );

    const formatted = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date(),
    }));

    // Replace old data with fresh data
    await CurrentData.deleteMany({});
    await CurrentData.insertMany(formatted);

    return res.json(formatted);
  } catch (err) {
    // ✅ Clean, friendly logging — no stack trace
    if (err.response?.status === 429) {
      console.warn("⚠️ CoinGecko rate limit reached. Try again later.");
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    } else if (err.code === "ECONNABORTED") {
      console.warn("⏳ CoinGecko API timed out.");
      return res
        .status(504)
        .json({ message: "CoinGecko API timeout. Try again shortly." });
    } else if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      console.warn("🚫 Cannot connect to CoinGecko API.");
      return res
        .status(503)
        .json({ message: "CoinGecko service unavailable right now." });
    } else {
      console.warn("❌ Unexpected error while fetching crypto data.");
      return res
        .status(500)
        .json({ message: "Server error while fetching crypto data." });
    }
  }
});

export default router;
