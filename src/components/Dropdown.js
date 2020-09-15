import React, { useState } from "react";

const Dropdown = ({ value, onChange, categories, dropDownLabel }) => {
  return (
    <form>
      {dropDownLabel}:
      <select value={value} onChange={onChange}>
        {!categories
          ? null
          : categories.map((el) => (
              <option value={el} key={el}>
                {el}
              </option>
            ))}
      </select>
    </form>
  );
};

export default Dropdown;
