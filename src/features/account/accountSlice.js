import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  isAdmin: false,
  isLoggedIn: false,
  isLoading: false,
  message: "",
};

// test by mocking fetch and localstorage
export const tryLoginThunkFunc = async (credentials = {}, api) => {
  const _fetch = api._fetch || fetch;
  const _localStorage = api._localStorage || localStorage;
  let token = _localStorage.getItem("shiftToken");

  // get new token if credentials provided
  if (credentials.username && credentials.password) {
    const authResponse = await _fetch(
      `http://localhost:8080/account/${credentials.path}`,
      {
        method: "POST",
        body: JSON.stringify(credentials), // username, password, admin
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    token = await authResponse.json();
    // check for errors in response before moving on
    if (token.error) {
      return token;
    }

    _localStorage.setItem("shiftToken", token);
  }

  // get account info if token exists
  if (token) {
    const authResponse = await _fetch(`http://localhost:8080/account`, {
      method: "GET",
      headers: { Authorization: token },
    });
    return await authResponse.json();
  }

  // do nothing if there is no token
  return {};
};

export const tryLogin = createAsyncThunk(
  "account/fetchAccount",
  tryLoginThunkFunc
);

// test by passing in action creators from tryLogin
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logOut(state) {
      state.isLoggedIn = false;
      state.username = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(tryLogin.pending, (state) => {
        state.isLoading = true;
        state.message = "";
      })
      .addCase(tryLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.username) {
          state.username = action.payload.username;
          state.isAdmin = action.payload.admin;
          state.isLoggedIn = true;
        }
        if (action.payload.message) {
          state.message = action.payload.message;
        }
      })
      .addCase(tryLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      });
  },
});

export const { logOut } = accountSlice.actions;

export default accountSlice.reducer;
