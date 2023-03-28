import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    navigate(state, action) {
      state.currentPage = action.payload;
    },
  },
});

export const { navigate } = uiSlice.actions;

export default uiSlice.reducer;
