import { createSlice } from "@reduxjs/toolkit";

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    admin: false,
    dashboard: true,
    setting: false,
  },
  reducers: {
    setAdmin: (state, action) => {
      state.admin = true;
      state.dashboard = false;
      state.setting = false;
    },
    setDashboard: (state, action) => {
      (state.admin = false),
        (state.dashboard = true),
        (state.setting = false);
    },
    setReset: (state, action) => {
      state.admin = false;
      state.dashboard = true;
      state.setting = false;
    },
    setSetting:(state,action)=>{
      state.admin = false;
      state.dashboard = false;
      state.setting = true;
    },
  
    
  },
});

export default dashboardSlice.reducer;
export const { setAdmin, setDashboard, setReset, setSetting } =
  dashboardSlice.actions;
