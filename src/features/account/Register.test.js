import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { navigate } from "../ui_routes/uiSlice";
import Register from "./Register";

let initialState;
beforeEach(() => {
  initialState = {
    account: {
      username: null,
      isLoggedIn: false,
      isLoading: false,
      isAdmin: false,
      message: "",
    },
  };
});
afterEach(() => {
  initialState = null;
});

it("should display username/password inputs, and submit button", () => {
  const mockUseDispatch = () => () => {};
  const mockUseSelector = (callback) => callback(initialState);
  render(
    <Register _useDispatch={mockUseDispatch} _useSelector={mockUseSelector} />
  );
  expect(screen.getByLabelText("Username")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(screen.getByRole("checkbox")).toBeInTheDocument();
  expect(screen.getByText("Submit")).toBeInTheDocument();
});

it("should dispatch user typed credentials when submit clicked, and detect loggedIn state to dispatch navigate", async () => {
  const mockDispatch = jest.fn((arg) => {
    initialState.account.isLoggedIn = true;
  });
  const mockUseDispatch = () => mockDispatch;
  const mockUseSelector = (callback) => callback(initialState);
  const mockCredentials = (cred) => cred.username + cred.password + cred.admin;
  const user = userEvent.setup();
  render(
    <Register
      _useDispatch={mockUseDispatch}
      _useSelector={mockUseSelector}
      _credentials={mockCredentials}
    />
  );

  // these are wrapped in act()
  await user.type(screen.getByLabelText("Username"), "u");
  await user.type(screen.getByLabelText("Password"), "p");
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByText("Submit"));

  expect(screen.getByDisplayValue("u")).toBeInTheDocument();
  expect(screen.getByDisplayValue("p")).toBeInTheDocument();
  expect(mockDispatch).toHaveBeenCalledWith("uptrue");

  render(
    <Register
      _useDispatch={mockUseDispatch}
      _useSelector={mockUseSelector}
      _credentials={mockCredentials}
    />
  );
  await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith(navigate("")));
});
