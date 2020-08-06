const d3 = require("d3");

function radialChartData(data, width, height) {
  const radiusScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)])
    .range([0, width / 2]);

  const colorScale = d3
    .scaleSequential()
    .domain(d3.extent(data, (d) => d.avg))
    .interpolator(d3.interpolateRdYlBu);

  // get the angle for each slice
  // 2PI/365
  const perSliceAngle = (2 * Math.PI) / data.length;
  // startAngle= i * perSliceAngle
  // endAngle = (i +1) * perSliceAngle

  const arcGenerator = d3.arc();

  return data.map((d, i) => {
    const path = arcGenerator({
      startAngle: i * perSliceAngle,
      endAngle: (i + 1) * perSliceAngle,
      innerRadius: radiusScale(d.low),
      outerRadius: radiusScale(d.high),
    });
    return { path, fill: colorScale(d.avg) };
  });
}

export default radialChartData;
