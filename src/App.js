import React from "react";
import { Router } from "@reach/router";

import "./App.css";
import SummaryPage from "./pages/SummaryPage";
import StateDataPage from "./pages/StateDataPage";
import NavBar from "./components/NavBar";

const App = () => {
  let basePath;
  if (process.env.NODE_ENV === "development") {
    basePath = "";
  } else {
    basePath = "/covid-data-client/";
  }
  return (
    <div className="app-container">
      <NavBar basePath={basePath} />
      <Router className="router-container" basepath={basePath}>
        <SummaryPage path="/" basePath={basePath} />
        <StateDataPage path="/:stateId" />
      </Router>
    </div>
  );
};

export default App;
