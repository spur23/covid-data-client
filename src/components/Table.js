import React from "react";
import TableHeader from "./TableHeader";

import functions from "../utils/index";

const Table = ({ data, className, columns, columnHeaders }) => {
  const cleanedData = data.map((el) => {
    const arr = [];
    columns.forEach((heading) => {
      if (typeof el[heading] === "number") {
        const numberFormatted = functions.convertNumberLocal(el[heading]);
        arr.push(numberFormatted);
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
