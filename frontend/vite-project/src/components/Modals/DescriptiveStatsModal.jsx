import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const DescriptiveStatsModal = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  // Tüm unique kolon isimlerini al
  const columns = stats.map(stat => stat.column);
  const statTypes = ["mean", "median", "stdDev", "min", "max"];

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white p-6 rounded-2xl w-11/12 max-w-6xl shadow-xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-wide">Descriptive Statistics</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="cursor-pointer" size={28} />
          </button>
        </div>

        <div className="mt-6 overflow-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          <table className="w-full text-sm border-separate border-spacing-2">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-3 text-left text-gray-400 font-semibold">Statistic</th>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-gray-200 font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statTypes.map((type) => (
                <tr key={type} className="hover:bg-gray-800 transition">
                  <td className="px-4 py-2 text-gray-300 font-medium capitalize">{type}</td>
                  {stats.map((stat, index) => (
                    <td key={index} className="px-4 py-2 text-white">
                      {stat[type]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default DescriptiveStatsModal;
