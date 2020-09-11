import React from "react";
import { Link } from "@reach/router";
import { useDispatch } from "react-redux";

import "./NavBar.css";

import { resetState } from "../redux/actions/actionCreator";

const NavBar = () => {
  const dispatch = useDispatch();
  const onLinkClick = () => {
    dispatch(resetState());
  };
  return (
    <header>
      <Link to="/" onClick={() => dispatch(resetState())}>
        To US Map
      </Link>
    </header>
  );
};

export default NavBar;
