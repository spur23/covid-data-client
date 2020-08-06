import React from "react";
import TableHeader from "./TableHeader";

const Table = ({ data, className }) => {
  const rowData = !data
    ? null
    : data.map((el) => {
        return (
          <tr key={el.state} id={el.state}>
            {Object.keys(el).map((key) => {
              return <td key={`${el.state}-${key}`}>{el[key]}</td>;
            })}
          </tr>
        );
      });
  const headers = !data ? null : Object.keys(data[0]).map((key) => key);

  return (
    <>
      <table className={className}>
        <thead>
          <tr>
            <th colSpan="2" className="table-name">
              Top Five {headers[1]}
            </th>
          </tr>

          <tr>
            <TableHeader headers={headers} />
          </tr>
        </thead>
        <tbody>{rowData}</tbody>
      </table>
    </>
  );
};

export default Table;
