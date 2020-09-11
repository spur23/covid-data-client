import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { format } from "d3";
import Functions from "../utils/index";
import moment from "moment";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const f = format(",");
const NivoLineChart = ({ chartData, category, lineColor }) => {
  const [data, setData] = useState([]);
  const { formatDate } = Functions;

  useEffect(() => {
    if (!chartData) {
      return;
    }

    let count = 0;
    const graphData = category.map((cat) => {
      const categoryData = chartData.map((el) => {
        const date = formatDate(el.date);
        return {
          x: date,
          y: el[cat],
        };
      });
      count++;
      return {
        id: cat,
        data: categoryData,
        color: lineColor[count - 1],
      };
    });

    setData(graphData);
  }, [chartData]);

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 115, bottom: 50, left: 100 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: "%b %d",
        tickValues: "every 1 months",
        legendOffset: -12,
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -50,
        legendPosition: "middle",
        format: ",",
      }}
      sliceTooltip={({ slice }) => {
        const date = moment(slice.points[0]["data"]["x"]).format("MM-DD-YYYY");
        return (
          <div
            style={{
              background: "#ecf0f1",
              padding: "9px 12px",
              border: "1px solid #ccc",
            }}
          >
            <div>date: {date}</div>
            {slice.points.map((point) => (
              <div
                key={point.id}
                style={{
                  color: point.serieColor,
                  padding: "3px 0",
                }}
              >
                <strong>{point.serieId}:</strong> {point.data.yFormatted}
              </div>
            ))}
          </div>
        );
      }}
      curve="natural"
      colors={lineColor}
      enablePoints={false}
      pointSize={2}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="y"
      enableSlices="x"
      pointLabelYOffset={-12}
      useMesh={true}
      isInteractive={true}
      yFormat={(value) => f(value)}
      theme={{
        background: "#f5f6fa",
        grid: {
          line: {
            stroke: "#353b48",
          },
        },
        tooltip: {
          container: {
            background: "#333",
          },
        },
      }}
      legends={[
        {
          anchor: "right",
          direction: "column",
          justify: false,
          translateX: 82,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default NivoLineChart;
