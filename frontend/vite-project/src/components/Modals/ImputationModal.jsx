import React, { useState } from 'react';
import { imputeData } from '../../api/api'; // api.js içindeki imputeData fonksiyonunu import et
import { motion } from 'framer-motion'; // Framer Motion importu
import { ChevronDown } from 'lucide-react';

const ImputationModal = ({ isOpen, onClose, data }) => {
  const [method, setMethod] = useState('median');
  const [isLoading, setIsLoading] = useState(false);
  const [imputedData, setImputedData] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
  
    const requestData = {
      data: data,
      method: method,
    };
  
    console.log("API'ye gönderilen veri:", requestData); // 👈 BURAYI EKLE
  
    try {
      const result = await imputeData(requestData);
      console.log("İmputasyon sonucu:", result); // 👈 Geri dönüş verisi
      setImputedData(result);
    } catch (error) {
      console.error('İmputasyon hatası:', error.response?.data || error.message); // daha detaylı hata
    } finally {
      setIsLoading(false);
    }
  };

  // Veriyi indirme fonksiyonu
  const handleDownload = () => {
    if (!imputedData) {
      alert("İmputasyon işlemi yapılmadı!");
      return;
    }
  
    const headers = Object.keys(imputedData[0]);
    const csvRows = [
      headers.join(','), // Başlıklar
      ...imputedData.map(row => headers.map(header => row[header]).join(',')) // Satırlar
    ];
  
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'imputed_data.csv';
    link.click();
    URL.revokeObjectURL(url); // URL'yi temizle
  };

  // Veri önizleme için ilk 8 satırı ve tüm kolonları almak
  const getPreviewData = () => {
    return data.slice(0, 8);  // İlk 8 satırı al
  };

  return (
    isOpen && (
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-full max-w-md relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <h3 className="text-3xl font-semibold mb-6">Eksik Veri Doldurma</h3>

          {/* Veri önizleme tablosu - sadece işlem yapıldıktan sonra gözüksün */}
          {imputedData && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-gray-300 mb-2">İşlenmiş Veri (Önizleme)</h4>
              <div className="overflow-x-auto max-h-[400px]">
                <motion.table
                  className="min-w-full table-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <thead className="bg-gray-900 text-white">
                    <tr>
                      {Object.keys(imputedData[0] || {}).map((col, idx) => (
                        <th key={idx} className="px-4 py-2 border-b text-left">
                          {col} <ChevronDown size={14} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {imputedData.map((row, rowIdx) => (
                      <tr key={rowIdx} className={`${rowIdx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} text-white`}>
                        {Object.values(row).map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-2">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </motion.table>
              </div>
            </div>
          )}

          {/* İmputasyon Yöntemi Seçimi */}
          <div className="mb-4">
            <p className="text-gray-200 mb-2">İmputasyon Yöntemi:</p>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  value="median" 
                  checked={method === 'median'} 
                  onChange={() => setMethod('median')} 
                  disabled={!!imputedData}  // İşlem tamamlandığında devre dışı bırak
                  className="mr-2" 
                />
                Medyan
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  value="mean" 
                  checked={method === 'mean'} 
                  onChange={() => setMethod('mean')} 
                  disabled={!!imputedData}  // İşlem tamamlandığında devre dışı bırak
                  className="mr-2" 
                />
                Ortalama
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  value="mode" 
                  checked={method === 'mode'} 
                  onChange={() => setMethod('mode')} 
                  disabled={!!imputedData}  // İşlem tamamlandığında devre dışı bırak
                  className="mr-2" 
                />
                Mod
              </label>
            </div>
          </div>

          {/* İşlem tamamlanana kadar butonun görünmesini engelle */}
          {!imputedData && (
            <button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="bg-blue-600 text-white p-3 rounded-md w-full hover:bg-blue-700 focus:outline-none disabled:bg-gray-500"
            >
              {isLoading ? 'İşlem devam ediyor...' : 'İmputasyonu Uygula'}
            </button>
          )}

          {imputedData && (
            <div className="mt-4">
              <button 
                onClick={handleDownload} 
                className="bg-gray-600 text-white p-3 rounded-md w-full hover:bg-gray-700 focus:outline-none"
              >
                Veriyi İndir
              </button>
            </div>
          )}

          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-3 bg-gray-600 cursor-pointer text-white rounded-full shadow-md transition-transform transform hover:scale-110"
            aria-label="Close Modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </motion.div>
      </motion.div>
    )
  );
};

export default ImputationModal;
