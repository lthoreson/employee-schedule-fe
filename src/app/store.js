import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import accountReducer from "../features/account/accountSlice";
import uiReducer from "../features/ui_routes/uiSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    account: accountReducer,
    ui: uiReducer,
  },
});
