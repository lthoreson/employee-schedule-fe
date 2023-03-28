import { afterEach, expect, vi } from "vitest";
import reducer, { tryLogin, tryLoginThunkFunc } from "./accountSlice";

let initialState;
beforeEach(() => {
  initialState = {
    username: null,
    isLoggedIn: false,
    isLoading: false,
    message: "",
  };
});
afterEach(() => {
  initialState = null;
});

it("should start with blank username, message, and not logged in or loading", () => {
  const state = reducer(undefined, {});
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(false);
  expect(state.message).toBe("");
});

it("should be loading after tryLogin begins", () => {
  const state = reducer(initialState, tryLogin.pending());
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(true);
  expect(state.message).toBe("");
});

it("should store username, be logged in, and not loading anymore if tryLogin returns with a user", () => {
  const state = reducer(
    initialState,
    tryLogin.fulfilled([{ username: "expected" }])
  );
  expect(state.username).toBe("expected");
  expect(state.isLoggedIn).toBe(true);
  expect(state.isLoading).toBe(false);
  expect(state.message).toBe("");
});

it("should show message and not loading anymore if tryLogin returns without a user", () => {
  const state = reducer(initialState, tryLogin.fulfilled([]));
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(false);
  expect(state.message).toBe("invalid username/password");
});

it("should show message and not loading anymore if tryLogin fails", () => {
  const state = reducer(initialState, tryLogin.rejected());
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(false);
  expect(state.message).toBe("server error");
});

it("should take credentials, pass them to fetch, and return response.json() result", async () => {
  const mockFetch = vi.fn((cred) => {
    return Promise.resolve({ json: () => Promise.resolve(cred) });
  });

  const mockAPI = {
    _fetch: mockFetch,
  };

  const testCreds = { username: "expected", password: "expected" };

  const data = await tryLoginThunkFunc(testCreds, mockAPI);

  expect(data).toBe(
    "http://localhost:3000/accounts?username=expected&password=expected"
  );
  expect(mockFetch).toHaveBeenCalled();
});

it("should ");
