import React from "react";
import NivoLineChart from "../visualizations/NivoLineChart";

const LineGraph = ({ data, category, color, title }) => (
  <div className="chart-container">
    <h4>{title}</h4>
    <NivoLineChart chartData={data} category={category} lineColor={color} />
  </div>
);

export default LineGraph;
