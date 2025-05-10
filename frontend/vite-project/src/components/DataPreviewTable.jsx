import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const DataPreviewTable = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewData = data.slice(0, 16); // İlk 16 satırı alıyoruz

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-8 mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Veri Önizleme</h3>

      <div className="overflow-x-auto max-h-[400px]">
        <motion.table
          className="min-w-full table-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={toggleModal}
        >
          <thead className="bg-gray-900 text-white">
            <tr>
              {Object.keys(previewData[0] || {}).map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700 transition-all duration-300"
                >
                  {column} <ChevronDown size={14} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                } text-white hover:bg-gray-600 transition-all duration-300`}
              >
                {Object.values(row).map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-600 transition-all duration-300"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-start justify-start p-8">
          <div className="bg-white rounded-lg w-full h-full overflow-auto relative shadow-2xl p-10">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-white bg-gray-500 hover:bg-black cursor-pointer rounded-full w-[35px] h-[35px] hover:scale-110 duration-300 transition-all  z-10"
            >
              X
            </button>

            <h2 className="text-3xl font-bold mb-6 text-gray-800">Veri Önizleme </h2>

            <motion.table
              className="min-w-full table-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <thead className="bg-gray-900 text-white sticky top-0 z-20">
                <tr>
                  {Object.keys(previewData[0] || {}).map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-base font-semibold"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${
                      rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                    } text-white hover:bg-gray-600 transition-all duration-300`}
                  >
                    {Object.values(row).map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-3 text-base"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreviewTable;
