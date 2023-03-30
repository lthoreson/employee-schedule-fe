import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../features/account/accountSlice";
import uiReducer from "../features/ui_routes/uiSlice";
import employeesReducer from "../features/employees/employeeSlice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    ui: uiReducer,
    employees: employeesReducer,
  },
});
