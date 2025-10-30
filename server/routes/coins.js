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
        timeout: 5000,
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

    await CurrentData.deleteMany({});
    await CurrentData.insertMany(formatted);

    return res.json(formatted);
  } catch (err) {
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
    } else {
      console.warn("💥 Unexpected error occurred. Restarting server...");
      process.exit(1); 
    }
  }
});

export default router;
