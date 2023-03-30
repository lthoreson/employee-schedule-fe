import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  isAdmin: false,
  isLoggedIn: false,
  isLoading: false,
  message: "",
};

export const credentialsFetch = async (credentials, api) => {
  const _fetch = api._fetch || fetch; // testing
  const _localStorage = api._localStorage || localStorage;
  const _tryToken = api._tryToken || tryToken;
  let token;
  // obtain token or reject with error
  try {
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
  } catch (err) {
    return api.rejectWithValue("connection failed");
  }
  // save cookie and log in with the token
  _localStorage.setItem("shiftToken", token);
  return api.dispatch(_tryToken());
};

export const credentials = createAsyncThunk(
  "account/credentials",
  credentialsFetch
);

export const tryTokenFetch = async (_, api) => {
  const _fetch = api._fetch || fetch;
  const _localStorage = api._localStorage || localStorage;
  let token = _localStorage.getItem("shiftToken");
  if (!token) {
    return {}; // no token is fine, default to welcome page
  }
  const authResponse = await _fetch(`http://localhost:8080/account`, {
    method: "GET",
    headers: { Authorization: token },
  });
  return await authResponse.json(); // account info or error message
};

export const tryToken = createAsyncThunk("account/tryToken", tryTokenFetch);

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
      .addCase(tryToken.pending, (state) => {
        state.isLoading = true;
        state.message = "";
      })
      .addCase(tryToken.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.username) {
          state.username = action.payload.username;
          state.isAdmin = action.payload.admin;
          state.isLoggedIn = true;
        } else if (action.payload.message) {
          state.message = action.payload.message;
        }
      })
      .addCase(tryToken.rejected, (state, action) => {
        state.isLoading = false;
        state.message = "connection failed";
      })
      .addCase(credentials.pending, (state) => {
        state.isLoading = true;
        state.message = "";
      })
      .addCase(credentials.rejected, (state, action) => {
        state.isLoading = false;
        state.message = "connection failed";
      });
  },
});

export const { logOut } = accountSlice.actions;

export default accountSlice.reducer;
