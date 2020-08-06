import React from "react";

import "./Loader.css";

const Loader = () => (
  <div className="loader-container">
    <h1>Loading</h1>
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Loader;
