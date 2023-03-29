import React from "react";
import { useSelector } from "react-redux";
import Login from "../account/Login";
import Profile from "../account/Profile";
import Register from "../account/Register";
import Employees from "../employees/Employees";
import Shifts from "../shifts/Shifts";
import ErrorPage from "./ErrorPage";

const UiRoutes = ({ _useSelector = useSelector }) => {
  const currentPage = _useSelector((state) => state.ui.currentPage);
  let switchPage = null;
  switch (currentPage) {
    case "":
      switchPage = null;
      break;
    case "employees":
      switchPage = <Employees />;
      break;
    case "login":
      switchPage = <Login />;
      break;
    case "profile":
      switchPage = <Profile />;
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
