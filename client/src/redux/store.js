import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import dataReducer from "./fetchDataSlice";
import dashboardReducer from "./dashboardSlice";
import ItemReducer from "./ItemSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    userData: dataReducer,
    dashboard: dashboardReducer,
    item: ItemReducer,
  },
});

export default store;
