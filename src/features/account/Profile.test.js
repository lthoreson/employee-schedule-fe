import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profile from "./Profile";

it("should display firstname/lastname inputs, and submit button", () => {
  const mockFetch = jest.fn((path, options) => {
    return Promise.resolve({
      json: () => Promise.resolve({ firstName: "", lastName: "" }),
    });
  });
  render(<Profile _fetch={mockFetch} />);
  expect(screen.getByLabelText("First Name")).toBeInTheDocument();
  expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
  expect(screen.getByText("Submit")).toBeInTheDocument();
});

it("should fetch profile upon render", async () => {
  const mockFetch = jest.fn((path, options) => {
    return Promise.resolve({
      json: () => Promise.resolve({ firstName: "f name", lastName: "l name" }),
    });
  });
  render(<Profile _fetch={mockFetch} />);
  await waitFor(() => {
    expect(screen.getByDisplayValue("f name")).toBeInTheDocument();
    expect(screen.getByDisplayValue("l name")).toBeInTheDocument();
  });
  expect(mockFetch).toHaveBeenCalled();
});

it("should fetch profile upon submit", async () => {
  const mockFetch = jest.fn((path, options) => {
    return Promise.resolve({
      json: () => Promise.resolve({ firstName: "f name", lastName: "l name" }),
    });
  });
  const user = userEvent.setup();
  render(<Profile _fetch={mockFetch} />);

  await user.type(screen.getByLabelText("First Name"), "f name");
  await user.type(screen.getByLabelText("Last Name"), "l name");
  await user.click(screen.getByText("Submit"));

  expect(screen.getByDisplayValue("f name")).toBeInTheDocument();
  expect(screen.getByDisplayValue("l name")).toBeInTheDocument();
  expect(mockFetch).toHaveBeenCalledTimes(2);
});
