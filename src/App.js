import React from "react";
import { Router } from "@reach/router";

import "./App.css";
import StateGraphPage from "./pages/StateGraphPage";
import SummaryPage from "./pages/SummaryPage";
import NavBar from "./components/NavBar";

const App = () => (
  <div className="app-container">
    <NavBar />
    <Router className="router-container">
      <SummaryPage path="/" />
      <StateGraphPage path="/data/:stateId" />
    </Router>
  </div>
);

export default App;
