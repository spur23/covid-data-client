import React, { useState, useEffect } from "react";

import Dropdown from "./Dropdown";
import NivoPieChart from "../visualizations/NivoPieChart";

import "./PieChart.css";

const colors = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#16a085",
  "#27ae60",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#ecf0f1",
  "#95a5a6",
  "#c0392b",
  "#bdc3c7",
  "#7f8c8d",
  "#00a8ff",
  "#e84118",
  "#ff7f50",
  "#eccc68",
  "#ffa502",
  "#70a1ff",
  "#1e90ff",
  "#2ed573",
  "#7bed9f",
];

const ageGroup = [
  "1-4 years",
  "15-24 years",
  "25-34 years",
  "35-44 years",
  "45-54 years",
  "5-14 years",
  "55-64 years",
  "65-74 years",
  "75-84 years",
  "85 years and over",
  "Under 1 year",
];

const PieChart = ({
  data,
  dropDownLabel,
  dropDownSelection,
  dataInfo,
  title,
}) => {
  const [selection, setSelection] = useState();
  const [categories, setCategories] = useState();
  const [graphData, setGraphData] = useState([]);
  const { label, id, value } = dataInfo;
  useEffect(() => {
    if (!data) return;

    const dropDownData = data
      .filter((el) => ageGroup.includes(el.age_group))
      .reduce((a, b) => {
        if (!a.includes(b[dropDownSelection])) {
          a.push(b[dropDownSelection]);
        }
        return a;
      }, []);

    setCategories(dropDownData);
    setSelection(dropDownData[0]);
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const filteredData = data
      .filter((el) => el[dropDownSelection] === selection)
      .map((el) => {
        return {
          label: el[label],
          id: el[id],
          value: !el[value] ? 0 : parseInt(el[value]),
        };
      })
      .filter((el) => ageGroup.includes(el.label));

    setGraphData(filteredData);
  }, [data, selection]);

  const onChange = (e) => {
    setSelection(e.target.value);
  };

  return (
    <div className="piechart-container">
      <div className="chart-header">
        <h4>{title}</h4>
      </div>
      <Dropdown
        value={selection}
        onChange={onChange}
        categories={categories}
        dropDownLabel={dropDownLabel}
      />
      <NivoPieChart data={graphData} />
    </div>
  );
};

export default PieChart;
