import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  message: "",
  employees: [],
};

// test by mocking fetch and localstorage
export const employeesThunkFunc = async (_, api) => {
  const _fetch = api._fetch || fetch;

  const profilesResponse = await _fetch(
    `http://localhost:8080/account/profiles`
  );
  return await profilesResponse.json();
};

export const fetchProfiles = createAsyncThunk(
  "employees/fetchProfiles",
  employeesThunkFunc
);

// test by passing in action creators from tryLogin
const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.isLoading = true;
        state.message = "";
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.length > 0) {
          state.employees = action.payload;
        }
        if (action.payload.message) {
          state.message = action.payload.message;
        }
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      });
  },
});

export default employeeSlice.reducer;
