import React from "react";

import LineGraph from "../components/LineGraph";

const LineGraphs = ({ data }) => (
  <div className="graph-container">
    <LineGraph
      data={data}
      category={["positive"]}
      color={["blue"]}
      title="Positive Cases"
    />
    <LineGraph
      data={data}
      category={["positiveIncrease", "positiveIncreaseRA7"]}
      color={["#341f97", "#00d2d3"]}
      title="Daily Positive Case Increase"
    />
    <LineGraph
      data={data}
      category={["death"]}
      color={["red"]}
      title="Deaths"
    />
    <LineGraph
      data={data}
      category={["deathIncrease", "deathIncreaseRA7"]}
      color={["#feca57", "#ee5253"]}
      title="Daily Death Increase"
    />
    <LineGraph
      data={data}
      category={["hospitalizedCurrently"]}
      color={["purple"]}
      title="Hospitalized"
    />
    <LineGraph
      data={data}
      category={["hospitalizedIncrease", "hospitalizedIncreaseRA7"]}
      color={["#54a0ff", "#5f27cd"]}
      title="Daily Hospitalized Increase"
    />
  </div>
);

export default LineGraphs;
