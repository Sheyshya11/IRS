import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import axiosInstance from "../axios/jwtInterceptor";

const baseUrl = "http://localhost:5000";

export const registerUser = createAsyncThunk(
  "user/signup",
  async (credential,{ rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/register`, credential);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/googlelogin",
  async (accessToken,{ rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/google`,
        {
          googleAccessToken: accessToken,
        },
        { withCredentials: true }
      );
      return response.data
    } catch (err) {
      return rejectWithValue(err.response.status)
    }
  }
);

export const signUpWithGoogle = createAsyncThunk(
  "user/googlesignup",
  async (accessToken,{ rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/google/signup`, {
        googleAccessToken: accessToken,
      });
      if (response) {
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
);

export const loginUser = createAsyncThunk("/auth", async (credential,{ rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseUrl}/auth`, credential, {
      withCredentials: true,
    });
  
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data.msg)
  }
});



export const getUser = createAsyncThunk("/userinfo", async (id) => {
  try {
    const response = await axiosInstance.get(`users/${id}`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch");
  }
});

export const logout = createAsyncThunk("/logout", async () => {
  try {
    const abc = "asd";
    const response = await axios.post(`${baseUrl}/auth/logout`, abc, {
      withCredentials: true,
    });
  } catch (error) {
    console.log({ error });
  }
});

export const createPassword = createAsyncThunk('/createPassword',async(cred)=>{
  try {
    
    const response = await axiosInstance.patch('users/createPass',cred,{
      withCredentials: true
    })
    return response.data
  } catch (error) {
    console.log({error})
  }
})



const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    accessToken: "",
    isLoggedin: false,
    msg: ""
  },
  reducers: {
 

  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        Cookies.set("token", state.accessToken);
        Cookies.set('passwordExists',true)
        state.isLoggedin = true;
      })

      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
       
      })

      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken
        Cookies.set("token", state.accessToken);
        Cookies.set('passwordExists',action.payload.passwordExist)
        state.isLoggedin = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        Cookies.remove("token");
        Cookies.remove('passwordExists')
        state.isLoggedin = false;
        state.accessToken=''
        
      })
      .addCase(createPassword.fulfilled,(state,action)=>{
        state.msg = action.payload.msg
      })
    
  },
});

export default userSlice.reducer;

