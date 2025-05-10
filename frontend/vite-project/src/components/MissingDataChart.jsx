import React, { useEffect, useState } from 'react';
import { useDataStore } from '../store/dataStore';
import * as d3 from 'd3';

const MissingDataChart = ({ data }) => {
  const fallbackData = useDataStore((state) => state.data);
  const dataStored = data || fallbackData;
  const [missingStats, setMissingStats] = useState([]);

  useEffect(() => {
    if (!dataStored || dataStored.length === 0) return;

    const columns = Object.keys(dataStored[0]);

    const stats = columns.map((col) => {
      const missingCount = dataStored.filter(
        (row) =>
          row[col] === null ||
          row[col] === undefined ||
          row[col] === '' ||
          row[col] === 'NaN'
      ).length;

      return {
        column: col,
        missingCount,
      };
    });

    // Filtreleme: sadece eksik veriye sahip sütunları tutuyoruz
    const filteredStats = stats.filter((stat) => stat.missingCount > 0);
    setMissingStats(filteredStats);
  }, [dataStored]);

  useEffect(() => {
    const svg = d3.select('#missing-data-chart');
    const containerWidth = 1200;
    const height = 300;
    const margin = { top: 40, left: 60, right: 40, bottom: 100 };

    svg.selectAll('*').remove();
    svg.attr('width', containerWidth).attr('height', height);

    const xScale = d3
      .scaleBand()
      .domain(missingStats.map((d) => d.column))
      .range([margin.left, containerWidth - margin.right])
      .padding(0.2); // Daha ince barlar için padding'i azaltabiliriz

    const yMax = d3.max(missingStats, (d) => d.missingCount) || 1;

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range(['#e5e7eb', '#1e3a8a']); // Açık gri - lacivert

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', '#111827');

    // Y axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('fill', '#111827');

    // Barlar
    svg
      .selectAll('.bar')
      .data(missingStats)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.column))
      .attr('y', (d) => yScale(d.missingCount))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - margin.bottom - yScale(d.missingCount))
      .attr('fill', (d) => colorScale(d.missingCount));
  }, [missingStats]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
 
      <div className="overflow-x-auto">
        <svg id="missing-data-chart" className="min-w-[800px] max-w-full h-[300px]" />
      </div>
      <ul className="mt-4 text-sm max-h-32 overflow-y-auto text-gray-700">
        {missingStats.map((col, index) => (
          <li key={index} className="mb-1">
            <span className="font-medium">{col.column}</span>: {col.missingCount} eksik değer
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MissingDataChart;
