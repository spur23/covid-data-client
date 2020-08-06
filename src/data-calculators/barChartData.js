import * as d3 from "d3";

function barChartData(data, width, height) {
  const margin = { top: 20, right: 5, bottom: 20, left: 35 };
  // 1. map date to x-position
  // get min-max of date
  const xExtent = d3.extent(data, (d) => new Date(d.date));
  const xScale = d3
    .scaleTime()
    .range([margin.left, width - margin.right])
    .domain(xExtent);
  // 2. map high temp to y-position
  // get min-max of high temp
  const yExtent = d3.max(data, (d) => d.high);
  const yScale = d3
    .scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([0, yExtent]);

  // 3. map average temperature to color
  // get min/max of avg
  const colorExtent = d3.extent(data, (d) => d.avg).reverse();
  const colorScale = d3
    .scaleSequential(d3.interpolateSpectral)
    .domain(colorExtent)
    .interpolator(d3.interpolateRdYlBu);

  // array of objects: x, y, height
  const arr = data.map((d) => {
    const y1 = yScale(d.high);
    const y2 = yScale(d.low);
    return {
      x: xScale(new Date(d.date)),
      y: y1,
      height: y2 - y1,
      fill: colorScale(d.avg),
    };
  });
  return [arr, xScale, yScale];
}

export default barChartData;
