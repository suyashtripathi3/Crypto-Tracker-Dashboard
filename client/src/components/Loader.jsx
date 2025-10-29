import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function Loader() {
  return (
    <div className="flex justify-center items-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      >
        <FaSpinner className="text-4xl text-yellow-400" />
      </motion.div>
    </div>
  );
}
