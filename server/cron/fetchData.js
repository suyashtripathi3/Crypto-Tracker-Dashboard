import axios from "axios";
import nodeCron from "node-cron";
import HistoryData from "../models/HistoryData.js";

export const startCron = () => {
  nodeCron.schedule("0 * * * *", async () => {
    try {
      console.log("⏱ Fetching hourly data...");

      const lastRecord = await HistoryData.findOne().sort({ timestamp: -1 });
      if (
        lastRecord &&
        Date.now() - lastRecord.timestamp.getTime() < 60 * 60 * 1000
      ) {
        console.log(
          "⏳ Skipping fetch — already fetched within the last hour."
        );
        return;
      }

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
            "User-Agent": "VR-Automations/1.0",
          },
        }
      );

      const records = data.map((coin) => ({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price,
        marketCap: coin.market_cap,
        change24h: coin.price_change_percentage_24h,
      }));

      await HistoryData.insertMany(records);
      console.log("✅ Hourly snapshot saved.");
    } catch (err) {
      if (err.response?.status === 429) {
        console.error(
          `🚫 Rate limit hit! Retry after ${err.response.headers["retry-after"]} seconds.`
        );
      } else {
        console.error("❌ Cron Error:", err.message);
      }
    }
  });
};
