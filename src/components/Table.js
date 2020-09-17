import React from "react";
import TableHeader from "./TableHeader";

import functions from "../utils/index";

const Table = ({ data, className, columns, columnHeaders, percent }) => {
  // columns are the properties from data that will be displayed in the table columns
  // columnHeaders are the headers to use for the table
  // percent is an array with a true and the column to calculate the percentage of

  let totalSelection = 0;
  if (percent[0] === true) {
    data.forEach((el) => {
      totalSelection += el[columns[1]];
    });
    columnHeaders.push("% of Total");
  }

  const cleanedData = data.map((el) => {
    const arr = [];

    // loops through columns
    columns.forEach((heading) => {
      if (typeof el[heading] === "number") {
        const numberFormatted = functions.convertNumberLocal(el[heading]);
        const percentOfTotal =
          ((el[heading] / totalSelection) * 100).toFixed(2) + "%";

        arr.push(numberFormatted);
        arr.push(percentOfTotal);
      } else {
        arr.push(el[heading]);
      }
    });
    return arr;
  });

  const rowData = !cleanedData
    ? null
    : cleanedData.map((el) => (
        <tr key={el[0]}>
          {Object.keys(el).map((key) => {
            return <td key={`${el[0]}-${key}`}>{el[key]}</td>;
          })}
        </tr>
      ));

  return (
    <>
      <table className={className}>
        <thead>
          <tr>
            <TableHeader headers={columnHeaders} />
          </tr>
        </thead>
        <tbody>{rowData}</tbody>
      </table>
    </>
  );
};

export default Table;
