import React, { useState, useEffect } from "react";
import { trainAndPredict } from "../../api/api";
import { X } from "lucide-react";

const TrainAndPredictModal = ({ isOpen, onClose, data }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [targetColumn, setTargetColumn] = useState("");
  const [modelType, setModelType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [numericColumns, setNumericColumns] = useState([]);
  const [categoricalColumns, setCategoricalColumns] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const sampleRow = data[0];
      const numeric = [];
      const categorical = [];
      Object.keys(sampleRow).forEach((key) => {
        const value = sampleRow[key];
        if (!isNaN(Number(value)) && value !== "") {
          numeric.push(key);
        } else {
          categorical.push(key);
        }
      });
      setNumericColumns(numeric);
      setCategoricalColumns(categorical);
    }
  }, [data]);

  useEffect(() => {
    if (numericColumns.includes(targetColumn)) {
      setAvailableModels([
        { value: "linear_regression", label: "Linear Regression" },
        { value: "decision_tree_regression", label: "Decision Tree Regression" },
        { value: "svm_regression", label: "SVM Regression" },
        { value: "random_forest_regression", label: "Random Forest Regression" },
      ]);
      setModelType("linear_regression");
    } else if (categoricalColumns.includes(targetColumn)) {
      setAvailableModels([
        { value: "decision_tree_classification", label: "Decision Tree Classification" },
        { value: "random_forest_classification", label: "Random Forest Classification" },
        { value: "svm_classification", label: "SVM Classification" },
      ]);
      setModelType("decision_tree_classification");
    } else {
      setAvailableModels([]);
      setModelType("");
    }
  }, [targetColumn, numericColumns, categoricalColumns]);

  const handleButtonClick = async () => {
    try {
      setIsLoading(true);
      const payload = {
        data: data,
        target_column: targetColumn,
        model_type: modelType,
      };
      const response = await trainAndPredict(payload);
      if (response.error) {
        setError("API Hatası: " + response.error);
        setResult(null);
      } else {
        setResult(response);
        setError(null);
      }
    } catch (err) {
      setError("Bir hata oluştu: " + err.message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-gray-100 p-8 rounded-lg w-11/12 h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          <X size={28} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">
          Modeli Eğit ve Tahmin Et
        </h2>
        <div className="flex gap-10">
          {/* Sol Alan - Seçenekler */}
          <div className="w-1/3 space-y-6 flex flex-col">
            <div>
              <label className="block mb-2">Hedef Sütunu Seç</label>
              {numericColumns.concat(categoricalColumns).map((col) => (
                <div key={col} className="mb-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="targetColumn"
                      value={col}
                      checked={targetColumn === col}
                      onChange={() => setTargetColumn(col)}
                      className="mr-2"
                    />
                    {col}
                  </label>
                </div>
              ))}
            </div>

            <div>
              <label className="block mb-2">Model Türü Seç</label>
              {availableModels.map((model) => (
                <div key={model.value} className="mb-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="modelType"
                      value={model.value}
                      checked={modelType === model.value}
                      onChange={() => setModelType(model.value)}
                      className="mr-2"
                    />
                    {model.label}
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleButtonClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              disabled={isLoading || !targetColumn || !modelType}
            >
              {isLoading ? "Eğitiliyor..." : "Modeli Eğit ve Tahmin Et"}
            </button>

            {error && <div className="mt-4 text-red-400">{error}</div>}
          </div>

          {/* Sağ Alan - Tahminler ve Grafik */}
          <div className="flex-1 h-full  bg-gray-800 p-4 rounded-lg ">
            <h3 className="text-xl font-semibold mb-4">Tahminler</h3>
            {result && Array.isArray(result.predictions) && result.predictions.length > 0 ? (
              <ul className="space-y-1 max-h-[50vh] overflow-y-scroll ">
                {result.predictions.map((prediction, index) => (
                  <li
                    key={index}
                    className="bg-gray-700 p-2 rounded-md break-all"
                  >
                    {prediction}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Henüz bir tahmin yok.</p>
            )}

            {/* Başarı Metrikleri */}
            {result && result.metrics && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Model Başarı Metrikleri</h3>
                <pre className="text-gray-300 bg-gray-700 p-4 rounded-md">
                  {JSON.stringify(result.metrics, null, 2)}
                </pre>
              </div>
            )}

            {/* Grafik */}
            {result && result.figure && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Model Performans Grafiği</h3>
                <img
                  src={`data:image/png;base64,${result.figure}`}
                  alt="Model Performans Grafiği"
                  className="max-w-full mt-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainAndPredictModal;
