import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import * as d3 from "d3";
import "./LineChart.css";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 75 };

const LineChart = ({
  data,
  graphData,
  secondLine,
  thirdLine,
  name,
  color,
  secondaryColor,
  thirdColor,
  title,
}) => {
  const animation = () => {
    if (!document.querySelector(`.${name}`)) return;
    gsap.fromTo(
      `.${name}`,
      {
        strokeDasharray: 10000,
        strokeDashoffset: 10000,
      },
      {
        strokeDashoffset: 0,
        strokeDasharray: 10000,
        ease: "linear",
        duration: 10,
        animationFillMode: "forwards",
      }
    );
  };

  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!data) return;

    const xMinMax = d3.extent(data, (d) => new Date(d.date));
    const xScale = d3
      .scaleTime()
      .range([margin.left, width - margin.right])
      .domain(xMinMax);

    const yMax = d3.max(data, (d) => d[graphData]);
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    // generates line x axis points
    const lineGenerator = d3.line().x((d) => xScale(new Date(d.date)));

    // takes the x axis generated points and adds y axis points
    const primaryLine = lineGenerator.y((d) => yScale(d[graphData]))(data);
    const secondaryLine = lineGenerator.y((d) => yScale(d[secondLine]))(data);
    const lineThree = lineGenerator.y((d) => yScale(d[thirdLine]))(data);

    // creates the axis labels
    const xAxis = d3
      .axisBottom()
      .ticks(6)
      .tickSizeInner(-height + margin.top * 2)
      .scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale).tickSizeInner(-width);

    d3.select(`.yAxis-line${name}`).call(yAxis).append("line");
    d3.select(`.xAxis-line${name}`).call(xAxis);

    setLines([
      { path: primaryLine, color: color },
      { path: secondaryLine, color: secondaryColor },
      { path: lineThree, color: thirdColor },
    ]);
    // animation();
  }, [data, graphData, name, color, secondLine, secondaryColor, thirdColor]);

  const lineGraphs = lines.map((el, i) => (
    <path
      key={i}
      className={name}
      fill="none"
      stroke={el.color}
      strokeWidth="3"
      d={el.path}
    />
  ));

  return (
    <svg width={width} height={height}>
      {lineGraphs}
      <g transform={`translate(${width / 1.75},${margin.top})`}>
        <text textAnchor="middle">{title}</text>
      </g>
      <g
        className={`xAxis-line${name}`}
        id={name}
        transform={`translate(0, ${height - margin.bottom})`}
      />
      <g
        className={`yAxis-line${name}`}
        id={name}
        transform={`translate(${margin.left}, 0)`}
      />
    </svg>
  );
};

export default LineChart;
