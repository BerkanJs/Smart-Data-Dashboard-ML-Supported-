import * as d3 from 'd3';

const addTitleAndLabels = (svg, title, xlabel, ylabel) => {
  svg.append("text")
    .attr("x", 250)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "24px") // Başlık font büyüklüğü
    .style("font-weight", "bold")
    .style("fill", "black") // Başlık rengi
    .text(title);

  svg.append("text")
    .attr("x", 250)
    .attr("y", 450)
    .attr("text-anchor", "middle")
    .style("font-size", "16px") // X ekseni etiket font büyüklüğü
    .style("fill", "black")
    .text(xlabel);

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px") // Y ekseni etiket font büyüklüğü
    .style("fill", "black")
    .text(ylabel);
};

export const renderBarChart = (svg, data) => {
  const numericData = data.map(d => parseFloat(d)).filter(d => !isNaN(d)); // Sayısal veriye dönüştürme
  const xScale = d3.scaleBand().domain(d3.range(numericData.length)).range([0, 600]).padding(0.1);
  const yScale = d3.scaleLinear().domain([0, d3.max(numericData)]).range([400, 0]);

  svg.selectAll("rect")
    .data(numericData)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => 400 - yScale(d))
    .attr("fill", "steelblue")
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  addTitleAndLabels(svg, "Bar Chart", "Index", "Value");
};

export const renderPieChart = (svg, data) => {
  const numericData = data.map(Number);
  const pie = d3.pie()(numericData);
  const arc = d3.arc().innerRadius(0).outerRadius(150);

  svg.selectAll("path")
    .data(pie)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("transform", "translate(250,250)")
    .attr("fill", (d, i) => d3.schemeSet3[i % 12])
    .attr("stroke", "white")
    .attr("stroke-width", 2); // Dış çerçeve rengi ve kalınlığı

  svg.append("text")
    .attr("x", 250)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .style("fill", "black")
    .text("Pie Chart");
};

export const renderLineChart = (svg, data) => {
  const numericData = data.map(Number);
  const xScale = d3.scaleLinear().domain([0, numericData.length - 1]).range([0, 600]);
  const yScale = d3.scaleLinear().domain([0, d3.max(numericData)]).range([400, 0]);

  const line = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d));

  svg.append("path")
    .data([numericData])
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 3); // Çizgi kalınlığı

  addTitleAndLabels(svg, "Line Chart", "Index", "Value");
};

export const renderCategoricalChart = (svg, data) => {
  const categories = [...new Set(data)];
  const countData = categories.map(category => ({
    category,
    count: data.filter(d => d === category).length
  }));

  const x = d3.scaleBand().domain(categories).range([0, 600]).padding(0.1);
  const y = d3.scaleLinear().domain([0, d3.max(countData, d => d.count)]).nice().range([400, 0]);

  svg.selectAll("rect")
    .data(countData)
    .enter()
    .append("rect")
    .attr("x", d => x(d.category))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", d => 400 - y(d.count))
    .attr("fill", "steelblue")
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  svg.append("g")
    .selectAll(".tick")
    .data(countData)
    .enter()
    .append("text")
    .attr("x", d => x(d.category) + x.bandwidth() / 2)
    .attr("y", 410)
    .attr("text-anchor", "middle")
    .style("font-size", "14px") // Kategori etiket font büyüklüğü
    .text(d => d.category)
    .attr("fill", "black");

  addTitleAndLabels(svg, "Categorical Chart", "Category", "Count");
};

export const renderBubbleChart = (svg, data) => {
  const numericX = data[0].map(Number);
  const numericY = data[1].map(Number);
  const size = data[2] ? data[2].map(Number) : numericY;

  svg.selectAll("circle")
    .data(numericX)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => numericX[i] * 10)
    .attr("cy", (d, i) => 400 - numericY[i] * 10)
    .attr("r", (d, i) => size[i] / 2 || 5)
    .attr("fill", "steelblue")
    .attr("opacity", 0.6)
    .attr("stroke", "black")
    .attr("stroke-width", 1); // Baloncuklara kenarlık

  addTitleAndLabels(svg, "Bubble Chart", "X Axis", "Y Axis");
};

export const renderMultiLineChart = (svg, data, cols) => {
  const colors = d3.schemeCategory10;

  cols.forEach((col, idx) => {
    const numericData = data[idx].map(Number);
    const xScale = d3.scaleLinear().domain([0, numericData.length - 1]).range([0, 600]);
    const yScale = d3.scaleLinear().domain([0, d3.max(numericData)]).range([400, 0]);

    const line = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));

    svg.append("path")
      .data([numericData])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", colors[idx % 10])
      .attr("stroke-width", 3); // Çizgi kalınlığı
  });

  addTitleAndLabels(svg, "Multi-Line Chart", "Index", "Value");
};
