import React from "react";

import GeoChartUS from "../visualizations/GeoChartUS";
import GeoChartState from "../visualizations/GeoChartState";

const Map = ({ data, selection, onClick, type, geoData, mapData }) =>
  type === "US" ? (
    <GeoChartUS data={data} selection={selection} onClick={onClick} />
  ) : (
    <GeoChartState
      geoData={geoData}
      mapData={mapData}
      data={data}
      selection={selection}
    />
  );

export default Map;
