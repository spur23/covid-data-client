import moment from "moment";

function sumArray(array) {
  return array.reduce((a, b) => a + b);
}

function average(x) {
  return sumArray(x) / (x.length || 1);
}

export function calculateMovingAverage(array, days, field) {
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
  return moment(x, "YYYYMMDD").format("MM/DD/YYYY");
}

const functions = {
  calculateMovingAverage,
  formatDate,
  numberWithCommas,
};

export default functions;
