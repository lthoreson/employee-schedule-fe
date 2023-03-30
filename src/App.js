import React from "react";
import "./App.css";
import UiRoutes from "./features/ui_routes/UiRoutes";
import NavMenu from "./NavMenu";

function App({ _NavMenu = NavMenu, _UiRoutes = UiRoutes }) {
  return (
    <>
      <_NavMenu />
      <_UiRoutes />
    </>
  );
}

export default App;
