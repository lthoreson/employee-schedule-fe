import React from "react";
import { useSelector } from "react-redux";
import Login from "../account/Login";
import Profile from "../account/Profile";
import Register from "../account/Register";
import Employees from "../employees/Employees";
import Recurrings from "../recurring/Recurrings";
import Shifts from "../shifts/Shifts";
import TimeOff from "../timeOff/TimeOff";
import ErrorPage from "./ErrorPage";
import HomePage from "./HomePage";

const UiRoutes = ({ _useSelector = useSelector }) => {
  const currentPage = _useSelector((state) => state.ui.currentPage);
  let switchPage = null;
  switch (currentPage) {
    case "":
      switchPage = <HomePage />;
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
    case "recurrings":
      switchPage = <Recurrings />;
      break;
    case "register":
      switchPage = <Register />;
      break;
    case "shifts":
      switchPage = <Shifts />;
      break;
    case "timeOff":
      switchPage = <TimeOff />;
      break;
    default:
      switchPage = <ErrorPage />;
      break;
  }

  return <>{switchPage}</>;
};

export default UiRoutes;
