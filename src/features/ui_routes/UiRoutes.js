import React from "react";
import { useSelector } from "react-redux";
import Login from "../account/Login";
import Register from "../account/Register";
import Shifts from "../shifts/Shifts";
import ErrorPage from "./ErrorPage";

const UiRoutes = ({ _useSelector = useSelector }) => {
  const currentPage = _useSelector((state) => state.ui.currentPage);
  let switchPage = null;
  switch (currentPage) {
    case "":
      switchPage = null;
      break;
    case "login":
      switchPage = <Login />;
      break;
    case "register":
      switchPage = <Register />;
      break;
    case "shifts":
      switchPage = <Shifts />;
      break;
    default:
      switchPage = <ErrorPage />;
      break;
  }

  return <>{switchPage}</>;
};

export default UiRoutes;
