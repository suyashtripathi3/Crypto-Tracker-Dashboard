import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import CryptoTable from "../components/CryptoTable";
import { motion } from "framer-motion";
import { FaBitcoin } from "react-icons/fa";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      setErrorMsg(""); // reset error
      // const res = await axios.get("http://localhost:8080/api/coins");
      const res = await axios.get("https://crypto-tracker-dashboard-3n2b.onrender.com/api/coins");
      setCoins(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Error fetching coins:", error);
      if (error.response?.status === 429) {
        setErrorMsg(
          "⚠️ Too many requests! Please wait a minute before retrying."
        );
      } else if (error.code === "ERR_NETWORK") {
        setErrorMsg("🚫 Cannot reach server. Please check your backend.");
      } 
      else {
        setErrorMsg("❌ Something went wrong. Try again later.");
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query) => {
    setFiltered(
      coins.filter((coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center py-10 text-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <FaBitcoin className="text-yellow-400 text-4xl drop-shadow-md" />
        <h1 className="text-4xl font-bold tracking-wide text-center">
          Crypto Tracker Dashboard
        </h1>
      </motion.div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Error Message */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-red-400 bg-red-900/20 border border-red-600 rounded-lg px-4 py-2 text-center w-11/12 md:w-3/4"
        >
          {errorMsg}
        </motion.div>
      )}

      {/* Crypto Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-11/12 md:w-3/4 mt-8 bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-700"
      >
        {filtered.length > 0 ? (
          <CryptoTable coins={filtered} />
        ) : (
          <p className="text-center text-gray-400 py-10">
            No coins found. Try searching again 🔍
          </p>
        )}
      </motion.div>

      {/* Footer */}
      <p className="text-gray-500 mt-10 text-sm">
        ⏱ Auto-refreshes every 30 minutes | Powered by CoinGecko API
      </p>
    </div>
  );
}
