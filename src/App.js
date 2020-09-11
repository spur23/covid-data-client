import React from "react";
import { Router } from "@reach/router";

import "./App.css";
import SummaryPage from "./pages/SummaryPage";
import StateDataPage from "./pages/StateDataPage";
import NavBar from "./components/NavBar";

const App = () => (
  <div className="app-container">
    <NavBar />
    <Router className="router-container">
      <SummaryPage path="/" />
      <StateDataPage path="/data/:stateId" />
    </Router>
  </div>
);

export default App;
