import { motion } from "framer-motion";

export default function CryptoTable({ coins }) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-center text-gray-300">
        <thead>
          <tr className="text-yellow-400 text-lg border-b border-gray-700">
            <th className="p-3">Name</th>
            <th className="p-3">Symbol</th>
            <th className="p-3">Price (USD)</th>
            <th className="p-3">Market Cap</th>
            <th className="p-3">24h %</th>
            <th className="p-3">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, idx) => (
            <motion.tr
              key={coin.coinId}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-gray-700/50 transition duration-200 cursor-pointer"
            >
              <td className="font-semibold text-white">{coin.name}</td>
              <td className="uppercase">{coin.symbol}</td>
              <td>${coin.price.toLocaleString()}</td>
              <td>${coin.marketCap.toLocaleString()}</td>
              <td
                className={
                  coin.change24h > 0
                    ? "text-green-400 font-bold"
                    : "text-red-400 font-bold"
                }
              >
                {coin.change24h.toFixed(2)}%
              </td>
              <td className="text-gray-400">
                {new Date(coin.timestamp).toLocaleTimeString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
