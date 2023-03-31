import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { navigate } from "../ui_routes/uiSlice";
import Login from "./Login";

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
    <Login _useDispatch={mockUseDispatch} _useSelector={mockUseSelector} />
  );
  expect(screen.getByLabelText("Username")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  expect(screen.getByText("Submit")).toBeInTheDocument();
});

it("should dispatch user typed credentials when submit clicked, and detect loggedIn state to dispatch navigate", async () => {
  const mockDispatch = jest.fn((arg) => {
    initialState.account.isLoggedIn = true;
  });
  const mockUseDispatch = () => mockDispatch;
  const mockUseSelector = (callback) => callback(initialState);
  const mockCredentials = (cred) => cred.username + cred.password;
  const user = userEvent.setup();
  render(
    <Login
      _useDispatch={mockUseDispatch}
      _useSelector={mockUseSelector}
      _credentials={mockCredentials}
    />
  );

  await user.type(await screen.findByLabelText("Username"), "u");
  await user.type(await screen.findByLabelText("Password"), "p");
  await user.click(await screen.findByText("Submit"));
  await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith("up"));

  render(
    <Login
      _useDispatch={mockUseDispatch}
      _useSelector={mockUseSelector}
      _credentials={mockCredentials}
    />
  );
  await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith(navigate("")));
});
