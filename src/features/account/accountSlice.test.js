import reducer, {
  tryToken,
  tryLoginThunkFunc,
  tryTokenFetch,
  credentialsFetch,
  credentials,
  logOut,
} from "./accountSlice";

let initialState;
beforeEach(() => {
  initialState = {
    username: null,
    isLoggedIn: false,
    isLoading: false,
    isAdmin: false,
    message: "",
  };
});
afterEach(() => {
  initialState = null;
});

it("should start with blank username, message, and not admin, logged in, or loading", () => {
  const state = reducer(undefined, {});
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(false);
  expect(state.isAdmin).toBe(false);
  expect(state.message).toBe("");
});

it("should be loading after tryToken begins", () => {
  const state = reducer(initialState, tryToken.pending());
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(true);
  expect(state.message).toBe("");
});

it("should be loading after credentials begins", () => {
  const state = reducer(initialState, credentials.pending());
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(true);
  expect(state.message).toBe("");
});

it("should store user details, be logged in, and not loading if tryToken returns with a user", () => {
  initialState.isLoading = true;
  const state = reducer(
    initialState,
    tryToken.fulfilled({ username: "expected", admin: true })
  );
  expect(state.username).toBe("expected");
  expect(state.isAdmin).toBe(true);
  expect(state.isLoggedIn).toBe(true);
  expect(state.isLoading).toBe(false);
  expect(state.message).toBe("");
});

it("should show message and not loading if tryToken fulfills with an error", () => {
  initialState.isLoading = true;
  const state = reducer(
    initialState,
    tryToken.fulfilled({ message: "expected error message" })
  );
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(false);
  expect(state.message).toBe("expected error message");
});

it("should show message and not loading anymore if tryToken fails", () => {
  initialState.isLoading = true;
  const state = reducer(initialState, tryToken.rejected());
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(false);
  expect(state.message).toBe("connection failed");
});

it("should show message and not loading anymore if credentials fails", () => {
  initialState.isLoading = true;
  const state = reducer(initialState, credentials.rejected());
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(false);
  expect(state.message).toBe("connection failed");
});

it("should show message and not loading anymore if tryToken fails", () => {
  initialState.isLoggedIn = true;
  initialState.username = "initial username";
  const state = reducer(initialState, logOut());
  expect(state.username).toBe(null);
  expect(state.isLoggedIn).toBe(false);
  expect(state.isLoading).toBe(false);
  expect(state.message).toBe("");
});

it("should pass localStorage cookie into fetch and return response.json()", async () => {
  const mockFetch = jest.fn((path, options) => {
    return Promise.resolve({
      json: () => Promise.resolve(options.headers.Authorization),
    });
  });
  const mockGetCookie = jest.fn((name) => "expected response");
  const mockLocalStorage = {
    getItem: mockGetCookie,
  };

  const mockAPI = {
    _fetch: mockFetch,
    _localStorage: mockLocalStorage,
  };

  const data = await tryTokenFetch({}, mockAPI);

  expect(data).toBe("expected response");
  expect(mockFetch).toHaveBeenCalled();
  expect(mockGetCookie).toHaveBeenCalled();
});

it("should return an empty object if token is null", async () => {
  const mockGetCookie = jest.fn((name) => null);
  const mockLocalStorage = {
    getItem: mockGetCookie,
  };

  const mockAPI = {
    _localStorage: mockLocalStorage,
  };

  const data = await tryTokenFetch({}, mockAPI);

  expect(data).toStrictEqual({});
  expect(mockGetCookie).toHaveBeenCalled();
});

it("should pass credentials into fetch, save cookie, and dispatch tryToken", async () => {
  const mockFetch = jest.fn((path, options) => {
    return Promise.resolve({
      json: () => Promise.resolve("expected token"),
    });
  });
  const mockLocalStorage = {
    setItem: jest.fn(),
  };

  const mockAPI = {
    _fetch: mockFetch,
    _localStorage: mockLocalStorage,
    _tryToken: () => "returned from tryToken",
    dispatch: jest.fn(),
  };
  const mockCredentials = {
    username: "a",
    password: "b",
    path: "c",
  };
  await credentialsFetch(mockCredentials, mockAPI);

  expect(mockFetch).toHaveBeenCalled();
  expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
    "shiftToken",
    "expected token"
  );
  expect(mockAPI.dispatch).toHaveBeenCalledWith("returned from tryToken");
});

it("should pass credentials into fetch, save cookie, and dispatch tryToken", async () => {
  const mockFetch = jest.fn((path, options) => {
    return Promise.reject();
  });
  const mockLocalStorage = {
    setItem: jest.fn(),
  };

  const mockAPI = {
    _fetch: mockFetch,
    rejectWithValue: jest.fn(),
  };
  const mockCredentials = {
    username: "a",
    password: "b",
    path: "c",
  };
  await credentialsFetch(mockCredentials, mockAPI);

  expect(mockFetch).toHaveBeenCalled();
  expect(mockAPI.rejectWithValue).toHaveBeenCalledWith("connection failed");
});
