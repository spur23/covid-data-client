import React, { useEffect, useState } from "react";
import {
  geoPath,
  max,
  scaleSequential,
  interpolateBlues,
  interpolateReds,
  select,
  format,
  selectAll,
  min,
  geoMercator,
} from "d3";

import { legendColor } from "d3-svg-legend";
import Functions from "../utils/index";
import "./GeoChart.css";

const f = format(",.0f");
const dimensions = {
  width: 1000,
  height: 610,
};

const calculateScale = (sqMile) => {
  // calculates the scale value to be used for the state maximum scale of 2000
  const base = 665384.04;
  const multiplier = Math.ceil(base / sqMile);
  const scale = 500;
  const result = scale * multiplier;
  const resultMax = 3250;
  if (result > resultMax) return resultMax;
  return scale * multiplier;
};

const GeoChartState = ({ geoData, mapData, data, selection }) => {
  const [lines, setLines] = useState([]);
  const [tooltip, setToolTip] = useState({ opacity: 0, text: "Active Cases" });
  const { replaceCharacterRegex } = Functions;
  const replaceSpace = replaceCharacterRegex(/\s+/g);
  const replacePeriod = replaceCharacterRegex(/\./g);
  const replaceDash = replaceCharacterRegex(/-/g);
  const replaceUnderscore = replaceCharacterRegex(/_/g);
  const replaceApostrophe = replaceCharacterRegex(/'/g);
  const replaceNumberOne = replaceCharacterRegex(/1/g);

  useEffect(() => {
    if (!geoData) return;
    let interplotorSelection;
    selection === "cases"
      ? (interplotorSelection = interpolateBlues)
      : (interplotorSelection = interpolateReds);
    // calculates the minimum and maximum amount of the selection for colormap values
    const minProp = min(data, (data) => data[selection]);
    const maxProp = max(data, (data) => data[selection]);

    const colorScale = scaleSequential()
      .domain([minProp, maxProp])
      .interpolator(interplotorSelection);

    // long and lat of state selected to center svg on state
    const { x, y } = mapData[0];

    const scale = calculateScale(mapData[0].sqMile);

    const projection = geoMercator()
      .center([x, y])
      .scale(scale)
      .translate([dimensions.width / 2, dimensions.height / 2]);

    const pathGenerator = geoPath().projection(projection);

    // creates the map color legend
    const legendLinear = legendColor()
      .shapeWidth(200)
      .orient("horizontal")
      .scale(colorScale);

    select(".legend").call(legendLinear);
    selectAll(".label").text((d) => f(d));

    // creates and maps the data to the path elements
    const render = geoData.map((feature) => {
      // finds an exact match to use for the color map
      const [colorMap] = data.filter((el) => {
        const searchParam = replaceUnderscore(
          replaceDash(feature.properties.NAME, " "),
          "."
        );
        return el.county === searchParam;
      });

      // if colormap exact match is empty find a partial match
      let partialMatch;
      if (colorMap === undefined) {
        const [match] = data.filter((el) =>
          el.county.includes(feature.properties.NAME)
        );
        partialMatch = match;
      }

      // creates the key used for path element key and id
      const key = replaceApostrophe(
        replacePeriod(replaceSpace(feature.properties.NAME, "-"), "_"),
        "1"
      );

      return (
        <path
          key={key}
          className="state"
          id={key}
          fill={
            partialMatch === undefined
              ? colorMap === undefined
                ? colorScale(0)
                : colorScale(colorMap[selection])
              : colorScale(partialMatch[selection])
          }
          d={pathGenerator(feature)}
          // onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        ></path>
      );
    });

    setLines(render);
  }, [geoData, mapData, selection]);

  // Context actions
  const onMouseEnter = (e) => {
    const hover = document.querySelector(`#${e.target.id}`);

    const county = replaceNumberOne(
      replaceUnderscore(replaceDash(e.target.id, " "), "."),
      "'"
    );

    const viewPort = hover.getBoundingClientRect();
    const countyData = data.filter((el) => {
      const searchParam = replaceNumberOne(
        replaceUnderscore(replaceDash(e.target.id, " "), "."),
        "'"
      );
      return el.county === searchParam;
    });

    let partialMatch = [];

    if (countyData.length === 0) {
      partialMatch = data.filter((el) => {
        const searchParam = replaceUnderscore(
          replaceDash(e.target.id, " "),
          "."
        );
        return el.county.includes(searchParam);
      });
    }

    // creates the text for the hover tooltip
    const text =
      selection === "cases"
        ? `Cases`
        : selection === "deaths"
        ? `Deaths`
        : null;

    // creates tooltip object for styling, text, and location
    const toolTipStyle = {
      opacity: 1,
      text: `${county} ${text}: ${
        countyData.length > 0
          ? f(countyData[0][selection])
          : partialMatch.length > 0
          ? f(partialMatch[0][selection])
          : 0
      }`,
      top: viewPort.top - 50,
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

export default GeoChartState;
