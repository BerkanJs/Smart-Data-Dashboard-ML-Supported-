import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { X } from 'lucide-react';
import {
  renderBarChart,
  renderPieChart,
  renderLineChart,
  renderCategoricalChart,
  renderBubbleChart,
  renderMultiLineChart
} from '../ChartRenderer';

const VisualizationModal = ({ isOpen, onClose, csvData }) => {
  const [columns, setColumns] = useState([]);
  const [columnTypes, setColumnTypes] = useState({});
  const [selectedCols, setSelectedCols] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [error, setError] = useState('');
  const [renderChart, setRenderChart] = useState(null);

  const cleanColumnName = (colName) => colName.replace(/[^a-zA-Z0-9_]/g, '').trim().toLowerCase();

  useEffect(() => {
    if (csvData && csvData.length > 0) {
      const cols = Object.keys(csvData[0]);
      setColumns(cols);
      const types = detectColumnTypes(csvData, cols);
      setColumnTypes(types);
    }
  }, [csvData]);


  const detectColumnTypes = (data, cols) => {
    const types = {};
    const sample = data.slice(0, 20);
    cols.forEach(col => {
      const values = sample.map(row => row[col]);

      // Sayısal verileri sayma
      const numericCount = values.filter(v => !isNaN(parseFloat(v)) && v !== '').length;
      const hasDecimal = values.some(v => v.includes('.'));

      // Try to improve float detection (also check for valid float values)
      if (numericCount > sample.length / 2) {
        if (hasDecimal) {
          types[col] = 'float';
        } else {
          types[col] = 'int';
        }
      } else {
        types[col] = 'categorical';
      }
    });
    return types;
  };

  const handleColSelect = (col) => {
    const updated = selectedCols.includes(col)
      ? selectedCols.filter(c => c !== col)
      : [...selectedCols, col].slice(0, chartType === 'multiline' || chartType === 'bubble' ? 3 : 1);
    setSelectedCols(updated);
  };

  
  const aggregateData = (data, numBins = 15) => {
    const binSize = Math.ceil(data.length / numBins);
    let aggregatedData = [];

    for (let i = 0; i < data.length; i += binSize) {
      const bin = data.slice(i, i + binSize);
      const average = bin.reduce((sum, value) => sum + parseFloat(value), 0) / bin.length;
      aggregatedData.push(average);
    }

    return aggregatedData;
  };

 
  const getDataSubset = (data, maxRows = 500) => {
    return data.slice(0, maxRows);
  };



const convertDataToInt = (data) => {
  return data.map(value => {
    const num = parseFloat(value);
    return isNaN(num) ? value : Math.round(num); 
  });
};

  const handleRenderChart = () => {
    setError('');
    if (selectedCols.length < (chartType === 'multiline' || chartType === 'bubble' ? 2 : 1)) {
      setError(`Bu grafik için en az ${chartType === 'multiline' || chartType === 'bubble' ? 2 : 1} sütun seçmelisiniz.`);
      return;
    }


    const subsetData = getDataSubset(csvData, 500);
    const cleanedCols = selectedCols.map(col => cleanColumnName(col));
    const selectedData = cleanedCols.map(col => subsetData.map(row => row[col]));


    const summarizedData = selectedData.map(data => aggregateData(data, 15));


    const intData = summarizedData.map(data => convertDataToInt(data));

    if (intData.some(data => data.some(value => isNaN(parseFloat(value))))) {
      setError("Seçilen sütunlar sayısal değil. Lütfen doğru türde veri seçin.");
      return;
    }

    setRenderChart({ cols: cleanedCols, data: intData });
  };

  const renderChartContent = () => {
    if (!renderChart) return;
    const { cols, data } = renderChart;
    const chartId = `chart-${cols.join('-').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

    d3.select(`#${chartId}`).selectAll("*").remove();
    const svg = d3.select(`#${chartId}`).append("svg").attr("width", 800).attr("height", 600);

   
    if (chartType === 'bar') renderBarChart(svg, data[0], cols[0]);
    else if (chartType === 'pie') renderPieChart(svg, data[0], cols[0]);
    else if (chartType === 'line') renderLineChart(svg, data[0], cols[0]);
    else if (chartType === 'categorical') renderCategoricalChart(svg, data[0], cols[0]);
    else if (chartType === 'bubble') renderBubbleChart(svg, data, cols);
    else if (chartType === 'multiline') renderMultiLineChart(svg, data, cols);
  };

  useEffect(() => {
    if (renderChart) renderChartContent();
  }, [renderChart]);

  if (!isOpen || !csvData || csvData.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 w-full max-w-7xl relative flex overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <div className="w-1/3 p-4">
          <h2 className="text-2xl font-semibold mb-4">Veri Görselleştirme</h2>
          <div className="grid grid-cols-1 gap-2 mb-4">
            {columns.map(col => (
              <label key={col} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCols.includes(col)}
                  onChange={() => handleColSelect(col)}
                  className="form-checkbox"
                />
                <span>{col} ({columnTypes[col]})</span>
              </label>
            ))}
          </div>

          <div className="mb-4">
            <select
              className="select select-bordered w-full bg-white"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="bar">Çubuk Grafik</option>
              <option value="pie">Pasta Grafik</option>
              <option value="line">Çizgi Grafik</option>
              <option value="categorical">Kategorik Grafik</option>
              <option value="bubble">Bubble Grafik</option>
              <option value="multiline">Çoklu Çizgi Grafik</option>
            </select>
          </div>

          <button
            onClick={handleRenderChart}
            className="btn w-full text-white bg-gray-800 hover:bg-gray-700"
          >
            Grafiği Göster
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="w-2/3 p-4 max-h-[90vh] overflow-auto">
          <div
            id={`chart-${selectedCols.join('-').replace(/\s+/g, '-').toLowerCase()}`}
            className="h-full bg-gray-100 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default VisualizationModal;
