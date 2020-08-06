import React from "react";

const Select = ({ data }) => {
  const selection = data.map((el, i) => <option key={i}>{el.state}</option>);
  return <select>{selection}</select>;
};

export default Select;
