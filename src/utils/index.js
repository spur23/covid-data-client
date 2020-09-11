import moment from "moment";
const dataForge = require("data-forge");

function sumArray(array) {
  return array.reduce((a, b) => a + b);
}

function average(x) {
  return sumArray(x) / (x.length || 1);
}

function calculateMovingAverage(array, days, field) {
  let arr = [...array];
  let avgArr = new Array(days).fill(0);

  for (let i = 0; i < arr.length; i++) {
    avgArr.shift();
    avgArr.push(arr[i][field]);
    const result = Math.round(average(avgArr));
    arr[i][`${field}MovingAverage${days}`] = result;
  }
  return arr;
}
function numberWithCommas(x) {
  if (!x) return 0;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(x) {
  return moment(x, "YYYYMMDD").format("YYYY-MM-DD");
}

const replaceCharacterRegex = (regex) => {
  const characterToReplaceRegex = regex;
  return (string, replacement) =>
    string.replace(characterToReplaceRegex, replacement);
};

const calculateMovingAverageDataForge = (data, days, field) => {
  const arr = [...data];
  let result;

  // create dataframe from data
  const df = new dataForge.DataFrame(arr)
    .toStrings("date", "yyyymmdd")
    .parseDates("date", "YYYYMMDD")
    .orderBy((row) => row.date);

  // calculate the rolling average for each field provided
  field.forEach((el) => {
    const RAFrame = df
      .rollingWindow(days)
      .select((window) => {
        const indexValues = window.getIndex().toArray();
        const indexNo = indexValues[indexValues.length - 1];
        const numbers = window.toArray();

        // convert numbers window array to object
        const dataObject = numbers.reduce((accumulator, item) => {
          Object.keys(item).forEach((key) => {
            accumulator[key] = (accumulator[key] || 0) + item[key];
          });
          return accumulator;
        }, {});

        const fieldRA = dataObject[el] / days;

        return [indexNo, fieldRA];
      })
      .toArray();

    let colNames = ["index", `${el}RA${days.toString()}`];

    const rollingAverageDF = new dataForge.DataFrame({
      columnNames: colNames,
      rows: RAFrame,
    })
      .setIndex("index")
      .dropSeries("index");

    if (!result) {
      result = df.merge(rollingAverageDF);
    } else {
      result = result.merge(rollingAverageDF);
    }
  });

  // converts data back into an array and rounds to 0
  field.forEach((el) => {
    result = result.transformSeries({
      [`${el}RA${days.toString()}`]: (value) => {
        if (!value) {
          return 0;
        } else {
          return value;
        }
      },
    });
  });

  return result.round(0).toArray();
};

const createUSButtonArray = (onClick, activeButton) => {
  return [
    {
      class: activeButton === "activeCases" ? "active" : null,
      id: "activeCases",
      text: "Active Cases",
      onClick: onClick,
    },
    {
      class: activeButton === "recoveries" ? "active" : null,
      id: "recoveries",
      text: "Recoveries",
      onClick: onClick,
    },
    {
      class: activeButton === "deaths" ? "active" : null,
      id: "deaths",
      text: "Deaths",
      onClick: onClick,
    },
    {
      class: activeButton === "inICU" ? "active" : null,
      id: "inICU",
      text: "In ICU",
      onClick: onClick,
    },
    {
      class: activeButton === "hospitalized" ? "active" : null,
      id: "hospitalized",
      text: "Hospitalized",
      onClick: onClick,
    },
    {
      class: activeButton === "totalCases" ? "active" : null,
      id: "totalCases",
      text: "Total Cases",
      onClick: onClick,
    },
  ];
};

const functions = {
  calculateMovingAverage,
  calculateMovingAverageDataForge,
  formatDate,
  numberWithCommas,
  replaceCharacterRegex,
  createUSButtonArray,
};

export default functions;
