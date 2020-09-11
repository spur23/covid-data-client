import React, { useEffect, useState } from "react";
import {
  geoPath,
  max,
  scaleSequential,
  interpolateBlues,
  interpolateReds,
  interpolateGreens,
  interpolatePuBu,
  interpolateOranges,
  interpolatePurples,
  geoAlbersUsa,
  select,
  format,
  selectAll,
  min,
} from "d3";
import { legendColor } from "d3-svg-legend";
import { USData } from "./USGEOJSON";
import "./GeoChart.css";

const f = format(",.0f");
const dimensions = {
  width: 975,
  height: 610,
};

const GeoChartUS = ({ data, selection, onClick }) => {
  const [lines, setLines] = useState([]);
  const [tooltip, setToolTip] = useState({ opacity: 0, text: "Active Cases" });

  useEffect(() => {
    let interpolatorSelection;
    selection === "activeCases"
      ? (interpolatorSelection = interpolateBlues)
      : selection === "deaths"
      ? (interpolatorSelection = interpolateReds)
      : selection === "recoveries"
      ? (interpolatorSelection = interpolateGreens)
      : selection === "inICU"
      ? (interpolatorSelection = interpolateOranges)
      : selection === "hospitalized"
      ? (interpolatorSelection = interpolatePurples)
      : (interpolatorSelection = interpolatePuBu);

    const minProp = min(data, (data) => data[selection]);
    const maxProp = max(data, (data) => data[selection]);

    const colorScale = scaleSequential()
      .domain([minProp, maxProp])
      .interpolator(interpolatorSelection);

    const projection = geoAlbersUsa().scale([1000]);

    const pathGenerator = geoPath().projection(projection);

    const graphData = USData.features
      .map((feature) => {
        const stateData = data.filter(
          (state) => state.stateName === feature.properties.NAME
        );
        return { ...feature, stateData: stateData[0] };
      })
      .filter((feature) => feature.stateData !== undefined);

    const render = graphData.map((feature) => {
      return (
        <path
          key={feature.stateData.state}
          className="state"
          id={feature.stateData.state}
          fill={colorScale(feature.stateData[selection])}
          d={pathGenerator(feature)}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        ></path>
      );
    });

    const legendLinear = legendColor()
      .shapeWidth(200)
      .orient("horizontal")
      .scale(colorScale);

    select(".legend").call(legendLinear);
    selectAll(".label").text((d) => f(d));

    setLines((prevRender) => [...prevRender, render]);
  }, [data, onClick]);

  const onMouseEnter = (e) => {
    const hover = document.querySelector(`#${e.target.id}`);
    const viewPort = hover.getBoundingClientRect();

    const stateData = data.filter((el) => el.state === e.target.id);

    const text =
      selection === "activeCases"
        ? `Active Cases`
        : selection === "recoveries"
        ? `Recoveries`
        : selection === "deaths"
        ? `Deaths`
        : selection === "totalCases"
        ? `Total Cases`
        : selection === "inICU"
        ? "In ICU"
        : selection === "hospitalized"
        ? "Hospitalized"
        : null;

    const toolTipStyle = {
      opacity: 1,
      text: `${stateData[0].stateName} ${text}: ${f(stateData[0][selection])}`,
      top: viewPort.top - 15,
      left: (viewPort.right - viewPort.left) / 4 + viewPort.left,
    };
    setToolTip(toolTipStyle);
  };
  const onMouseLeave = (e) => setToolTip({ opacity: 0 });
  return (
    <>
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="legend"></g>
        {lines}
      </svg>
      <div className="tool-tip" style={tooltip}>
        {tooltip.text}
      </div>
    </>
  );
};

export default GeoChartUS;
