import React from "react";
import { Rows3, Columns3, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../store/dataStore";

const DashboardCards = ({ data }) => {
  const storeData = useDataStore((state) => state.data);
  const actualData = data || storeData;

  const totalRows = actualData?.length || 0;
  const totalColumns = actualData?.length > 0 ? Object.keys(actualData[0]).length : 0;

  const missingValues =
    actualData?.reduce((acc, row) => {
      const rowMissing = Object.values(row).filter(
        (value) => value === null || value === undefined || value === ""
      ).length;
      return acc + rowMissing;
    }, 0) || 0;

  const cards = [
    {
      icon: <Rows3 size={30} className="text-green-600" />,
      title: "Toplam Satır",
      value: totalRows,
    },
    {
      icon: <Columns3 size={30} className="text-indigo-600" />,
      title: "Toplam Sütun",
      value: totalColumns,
    },
    {
      icon: <AlertCircle size={30} className="text-red-600" />,
      title: "Eksik Veri",
      value: missingValues,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="bg-white shadow-lg rounded-lg p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            {card.icon}
            <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;
