import React from "react";

const TableHeader = ({ headers }) =>
  headers.map((el) => <th key={el}>{el}</th>);

export default TableHeader;
