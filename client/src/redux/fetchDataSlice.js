import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/jwtInterceptor";

// const baseUrl = "https://irsserver.onrender.com";
const baseUrl = "http://localhost:5000";

export const getAllUser = createAsyncThunk("/users", async () => {
  try {
    const response = await axiosInstance.get("users");
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const approveUser = createAsyncThunk(
  "approve/reject",
  async (_id, approve) => {
    try {
      const response = await axiosInstance.put(
        "users/approve",
        { _id: _id, approve: approve },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to approve");
    }
  }
);

const fetchDataSlice = createSlice({
  name: "data",
  initialState: {
    loading: false,
    error: null,
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.fulfilled, (state, action) => {
       const pendingUser =  action.payload.filter((user) => {
          return !user.verified;
        });
       
        state.users = pendingUser;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        const { _id } = action.payload;

        state.users = state.users.filter((user) => user._id !== _id) || []
      });
  },
});

export default fetchDataSlice.reducer;
