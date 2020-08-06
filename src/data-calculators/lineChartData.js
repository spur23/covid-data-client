const d3 = require("d3");

function lineChartData(data, width, height) {
  const xExtent = d3.extent(data, (d) => d.date);
  const xScale = d3.scaleTime().domain(xExtent).range([0, width]);

  // min: low temp, max: high temp
  const highMax = d3.max(data, (d) => d.high);

  const lowMin = d3.min(data, (d) => d.low);

  const yScale = d3.scaleLinear().domain([lowMin, highMax]).range([height, 0]);

  // const highLine = d3
  //   .line()
  //   .x((d) => xScale(d.date))
  //   .y((d) => yScale(d.high));

  const line = d3.line().x((d) => xScale(d.date));

  // return [
  //   {
  //     path: highLine(data),
  //     fille: "red",
  //   },
  // ];
  // generate a second line without another line generator
  return [
    {
      path: line.y((d) => yScale(d.high))(data),
      fill: "red",
    },
    // {
    //   path: line.y((d) => yScale(d.low))(data),
    //   fill: "blue",
    // },
  ];
}

export default lineChartData;
