import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

it("should render two components", () => {
  const mockNav = () => <div>expected nav text</div>;
  const mockUiRoutes = () => <div>expected routes text</div>;

  render(<App _NavMenu={mockNav} _UiRoutes={mockUiRoutes} />);

  expect(screen.getByText("expected nav text")).toBeInTheDocument();
  expect(screen.getByText("expected routes text")).toBeInTheDocument();
});
