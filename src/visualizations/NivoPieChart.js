import { ClassNames } from "@emotion/core";
import { ResponsivePie } from "@nivo/pie";
import React from "react";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const NivoPieChart = ({ data }) => (
  <ResponsivePie
    data={data}
    // margin={{ top: 20, right: 50, bottom: 20, left: 50 }}
    innerRadius={0.25}
    padAngle={0.7}
    cornerRadius={3}
    borderWidth={1}
    borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
    slicesLabelsSkipAngle={10}
    slicesLabelsTextColor="#333333"
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    sortByValue={true}
    colors={{ scheme: "pastel2" }}
    enableRadialLabels={false}
    // radialLabel={(e) => e.id}
    // radialLabelsSkipAngle={10}
    // radialLabelsTextXOffset={6}
    // radialLabelsTextColor="#333333"
    // radialLabelsLinkOffset={0}
    // radialLabelsLinkDiagonalLength={0}
    // radialLabelsLinkHorizontalLength={0}
    // radialLabelsLinkStrokeWidth={0}
    // radialLabelsLinkColor={{ from: "color" }}
    // colors={(d) => d.color}
    sliceLabel={({ value }) =>
      Number(value).toLocaleString("en-Us", { minimumFractionDigits: 0 })
    }
    tooltipFormat={(value) =>
      Number(value).toLocaleString("en-US", { minimumFractionDigits: 0 })
    }
  />
);

export default NivoPieChart;
