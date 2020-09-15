import React from "react";
import { Link } from "@reach/router";
import { useDispatch } from "react-redux";

import "./NavBar.css";

import { resetState } from "../redux/actions/actionCreator";

const NavBar = ({ basePath }) => {
  const dispatch = useDispatch();

  return (
    <header>
      <Link to={basePath} onClick={() => dispatch(resetState())}>
        To US Map
      </Link>
    </header>
  );
};

export default NavBar;
