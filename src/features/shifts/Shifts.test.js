import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fetchProfiles } from "../employees/employeeSlice";
import { navigate } from "../ui_routes/uiSlice";
import Shifts from "./Shifts";

let initialState;
beforeEach(() => {
  initialState = {
    account: {
      username: null,
      isLoggedIn: false,
      isLoading: false,
      isAdmin: true,
      message: "",
    },
    employees: {
      employees: [
        {
          id: 1,
          firstName: "ee",
          lastName: "ll",
        },
      ],
    },
  };
});
afterEach(() => {
  initialState = null;
});

it("should display shift inputs, and should fetch profiles and shifts", () => {
  const mockDispatch = jest.fn();
  const mockUseDispatch = () => mockDispatch;
  const mockUseSelector = (callback) => callback(initialState);
  const mockFetchProfiles = () => "fetch profiles";
  const mockFetch = jest.fn();
  render(
    <Shifts
      _useDispatch={mockUseDispatch}
      _useSelector={mockUseSelector}
      _fetchProfiles={mockFetchProfiles}
      _fetch={mockFetch}
    />
  );
  expect(screen.getByLabelText("Date")).toBeInTheDocument();
  expect(screen.getByLabelText("Start Time")).toBeInTheDocument();
  expect(screen.getByLabelText("End Time")).toBeInTheDocument();
  expect(screen.getByLabelText("Employee")).toBeInTheDocument();
  expect(screen.getByText("ee ll")).toBeInTheDocument();
  expect(screen.getByText("Submit")).toBeInTheDocument();
  expect(screen.getByText("Generate")).toBeInTheDocument();
  expect(screen.getByText("Assign")).toBeInTheDocument();
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(mockDispatch).toHaveBeenCalledWith("fetch profiles");
  expect(mockFetch).toHaveBeenCalled();
});

it("should fetch when submit clicked", async () => {
  const mockUseSelector = (callback) => callback(initialState);
  const mockFetchProfiles = () => {};
  const mockFetch = jest.fn();
  const user = userEvent.setup();
  render(
    <Shifts
      _useDispatch={() => () => {}}
      _useSelector={mockUseSelector}
      _fetchProfiles={mockFetchProfiles}
      _fetch={mockFetch}
    />
  );

  // these are wrapped in act()
  await user.type(screen.getByLabelText("Date"), "04/07/2023");
  await user.type(screen.getByLabelText("Start Time"), "1");
  await user.type(screen.getByLabelText("End Time"), "2");
  await user.click(screen.getByText("Submit"));

  expect(mockFetch).toHaveBeenCalled();
});

it("should fetch when generate clicked", async () => {
  const mockUseSelector = (callback) => callback(initialState);
  const mockFetchProfiles = () => "fetch profiles";
  const mockFetch = jest.fn(() =>
    Promise.resolve({
      json: () => [],
    })
  );
  const user = userEvent.setup();
  render(
    <Shifts
      _useDispatch={() => () => {}}
      _useSelector={mockUseSelector}
      _fetchProfiles={mockFetchProfiles}
      _fetch={mockFetch}
    />
  );

  await user.click(screen.getByText("Generate"));

  expect(mockFetch).toHaveBeenCalled();
});

it("should fetch when assign clicked", async () => {
  const mockUseSelector = (callback) => callback(initialState);
  const mockFetchProfiles = () => "fetch profiles";
  const mockFetch = jest.fn(() =>
    Promise.resolve({
      json: () => [],
    })
  );
  const user = userEvent.setup();
  render(
    <Shifts
      _useDispatch={() => () => {}}
      _useSelector={mockUseSelector}
      _fetchProfiles={mockFetchProfiles}
      _fetch={mockFetch}
    />
  );

  await user.click(screen.getByText("Assign"));

  expect(mockFetch).toHaveBeenCalled();
});

it("should fetch when claimShift triggered by child component", async () => {
  const mockUseSelector = (callback) => callback(initialState);
  const mockFetchProfiles = () => "fetch profiles";
  const mockFetch = jest.fn(() =>
    Promise.resolve({
      json: () => [],
    })
  );
  const mockTable = ({ claimShift }) => {
    claimShift();
    return <div></div>;
  };
  const user = userEvent.setup();
  render(
    <Shifts
      _useDispatch={() => () => {}}
      _useSelector={mockUseSelector}
      _fetchProfiles={mockFetchProfiles}
      _fetch={mockFetch}
      _ShiftsTable={mockTable}
    />
  );

  await user.click(screen.getByText("Assign"));

  expect(mockFetch).toHaveBeenCalled();
});

it("should fetch when surrenderShift triggered by child component", async () => {
  const mockUseSelector = (callback) => callback(initialState);
  const mockFetchProfiles = () => "fetch profiles";
  const mockFetch = jest.fn(() =>
    Promise.resolve({
      json: () => [],
    })
  );
  const mockTable = ({ surrenderShift }) => {
    surrenderShift();
    return <div></div>;
  };
  const user = userEvent.setup();
  render(
    <Shifts
      _useDispatch={() => () => {}}
      _useSelector={mockUseSelector}
      _fetchProfiles={mockFetchProfiles}
      _fetch={mockFetch}
      _ShiftsTable={mockTable}
    />
  );

  await user.click(screen.getByText("Assign"));

  expect(mockFetch).toHaveBeenCalled();
});
