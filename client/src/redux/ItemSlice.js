import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/jwtInterceptor";

export const createItem = createAsyncThunk("/createItem", async (items) => {
  try {
    const response = await axiosInstance.post("items/", items, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log({ error });
  }
});

export const fetchItems = createAsyncThunk("/fetchItems", async () => {
  try {
    const response = await axiosInstance.get("items", {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log({ err });
  }
});

export const fetchALlItems = createAsyncThunk("/fetchAllItems", async () => {
  try {
    const response = await axiosInstance.get("items", {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.log({ err });
  }
});

export const requestItem = createAsyncThunk("/requestItem", async (items) => {
  try {
    const response = await axiosInstance.post("items/requestItem", items, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log({ error });
  }
});

export const getRequestedItems = createAsyncThunk(
  "/getRequestedItems",
  async () => {
    try {
      const response = await axiosInstance.get("requestItems", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const approveItemRequest = createAsyncThunk('/approveRequest',async(items)=>{
  try {
    const response = await axiosInstance.put('requestItems/approveRequestItem',items,{
      withCredentials: true
    })
    console.log(response)
    
  } catch (error) {
    console.log({error})
  }
})

const itemSlice = createSlice({
  name: "Item",
  initialState: {
    itemInfo: {},
    items: [],
    requestedItems: [],
    allItems: [],
    itemCount: {},
    loading: false,
    error: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createItem.fulfilled, (state, action) => {
        state.itemInfo = action.payload;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        const itemArray = action.payload;
        const uniqueObjects = [];
        const names = new Set();

        for (const obj of state.items) {
          if (!names.has(obj.name)) {
            names.add(obj.name);
            uniqueObjects.push(obj);
          }
        }
        const nameCounts = {};
        for (const obj of itemArray) {
          const name = obj.name;
          nameCounts[name] = (nameCounts[name] || 0) + 1;
        }
        state.itemCount = nameCounts;

        state.items = uniqueObjects;
      })
      .addCase(getRequestedItems.fulfilled, (state, action) => {
        state.requestedItems = action.payload.reqItem;
        const itemsArray = action.payload.items;
        const filterArray = itemsArray.filter((item)=>{
          return item.Status === false
        })
        
        const newArray = filterArray.reduce((acc, obj) => {
          const existingObj = acc.find((item) => item.name === obj.name);
          if (existingObj) {
            existingObj.ssid.push(obj.ssid);
          } else {
            acc.push({ name: obj.name, ssid: [obj.ssid] });
          }
          return acc;
        }, [])
       
        state.allItems = newArray;
      })
      .addCase(fetchALlItems.fulfilled, (state, action) => {
        state.allItems = action.payload;
      });
  },
});

export default itemSlice.reducer;
export const { setLoading } = itemSlice.actions;
