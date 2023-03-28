import React from "react";
import "./App.css";
import UiRoutes from "./features/ui_routes/UiRoutes";
import NavMenu from "./NavMenu";

function App() {
  return (
    <>
      <NavMenu />
      <UiRoutes />
    </>
  );
}

export default App;
