import React from "react";
import { useSelector } from "react-redux";
import Login from "../account/Login";
import Register from "../account/Register";
import ErrorPage from "./ErrorPage";

const UiRoutes = ({ _useSelector = useSelector }) => {
  const currentPage = _useSelector((state) => state.ui.currentPage);
  let switchPage = null;
  switch (currentPage) {
    case "login":
      switchPage = <Login />;
      break;
    case "":
      switchPage = null;
      break;
    case "register":
      switchPage = <Register />;
      break;
    default:
      switchPage = <ErrorPage />;
      break;
  }

  return <>{switchPage}</>;
};

export default UiRoutes;