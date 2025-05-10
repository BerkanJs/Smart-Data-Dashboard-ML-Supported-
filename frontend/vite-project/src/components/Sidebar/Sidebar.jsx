import React, { useState } from "react";
import {
  ChartColumnStacked,
  ChartNoAxesColumnIncreasing,
  PenLine,
  AlignStartVertical,
  BrainCircuit,
} from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import SidebarItem from "./SidebarItem";
import DescriptiveStatsModal from "../Modals/DescriptiveStatsModal";
import MissingDataChart from "../../components/MissingDataChart";
import ImputationModal from "../Modals/ImputationModal";
import VisualizationModal from "../Modals/VisualizationModal";
import TrainAndPredictModal from "../Modals/TrainAndPredictModal";

const Sidebar = () => {
  const { data } = useDataStore();
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [isMissingDataOpen, setIsMissingDataOpen] = useState(false);
  const [isImputationOpen, setIsImputationOpen] = useState(false);
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(false);
  const [isTrainAndPredictOpen, setIsTrainAndPredictOpen] = useState(false);
  const [stats, setStats] = useState([]);

  const calculateStats = (data) => {
    const numericColumns = Object.keys(data[0] || {}).filter(
      (key) => !isNaN(parseFloat(data[0][key]))
    );

    return numericColumns.map((col) => {
      const values = data
        .map((row) => parseFloat(row[col]))
        .filter((v) => !isNaN(v));
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
      const stdDev = Math.sqrt(
        values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
          values.length
      );

      return {
        column: col,
        mean: mean.toFixed(2),
        median: median.toFixed(2),
        stdDev: stdDev.toFixed(2),
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });
  };

  const handleTrainAndPredictClick = () => {
    setIsTrainAndPredictOpen(true);
  };

  const handleDescClick = () => {
    const computedStats = calculateStats(data);
    setStats(computedStats);
    setIsDescOpen(true);
  };

  const handleMissingDataClick = () => {
    setIsMissingDataOpen(true);
  };

  const handleImputationClick = () => {
    console.log("Imputation Modal Açıldı");
    setIsImputationOpen(true);
  };

  const handleVisualizationClick = () => {
    setIsVisualizationOpen(true);
  };

  return (
    <div className="fixed top-0 left-0 w-16 h-full bg-gray-900 flex flex-col items-center justify-start space-y-4 p-4 z-30">
      <SidebarItem
        icon={<ChartColumnStacked size={24} />}
        onClick={handleDescClick}
        tooltip="Descriptive"
      />
      <SidebarItem
        icon={<ChartNoAxesColumnIncreasing size={24} />}
        onClick={handleMissingDataClick}
        tooltip="Missing Value Chart"
      />
      <SidebarItem
        icon={<PenLine size={24} />}
        onClick={handleImputationClick}
        tooltip="Impute Missing Data"
      />
      <SidebarItem
        icon={<AlignStartVertical size={24} />}
        onClick={handleVisualizationClick}
        tooltip="Visualize Data"
      />
      <SidebarItem
        icon={<BrainCircuit size={24} />}
        onClick={handleTrainAndPredictClick}
        tooltip="Train & Predict"
      />

      <DescriptiveStatsModal
        isOpen={isDescOpen}
        onClose={() => setIsDescOpen(false)}
        stats={stats}
      />
      {isMissingDataOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-40">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl relative">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Eksik Veri Dağılımı
            </h3>
            <MissingDataChart data={data} />
            <button
              onClick={() => setIsMissingDataOpen(false)}
              className="absolute top-4 right-4 p-3 bg-gray-600 text-white rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {isImputationOpen && (
        <ImputationModal
          isOpen={isImputationOpen}
          onClose={() => setIsImputationOpen(false)}
          data={data}
        />
      )}
      {isVisualizationOpen && (
        <VisualizationModal
          isOpen={isVisualizationOpen}
          onClose={() => setIsVisualizationOpen(false)}
          csvData={data}
        />
      )}
      {isTrainAndPredictOpen && (
        <TrainAndPredictModal
          isOpen={isTrainAndPredictOpen}
          onClose={() => setIsTrainAndPredictOpen(false)}
          data={data} // Veriyi modal'a gönderiyoruz
        />
      )}
    </div>
  );
};

export default Sidebar;
