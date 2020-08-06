import React from "react";

const Title = ({ children, data, className }) => (
  <h4 className={className}>
    {children}
    {data}
  </h4>
);

export default Title;
