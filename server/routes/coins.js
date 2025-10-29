import express from "express";
import axios from "axios";
import CurrentData from "../models/CurrentData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
    );

    const formatted = data.map(coin => ({
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

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching data" });
  }
});

export default router;
