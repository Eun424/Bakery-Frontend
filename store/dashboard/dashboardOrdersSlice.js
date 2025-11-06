import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Axios/axios";


const initialState = {
  orders: [],
  loading: false,
  error: null,
  success: null,
};

// Fetch orders
export const fetchOrders = createAsyncThunk(
  "dashboardOrders/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/orders");
      return res.data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Something went wrong");
    }
  }
);

const dashboardOrdersSlice = createSlice({
  name: "dashboardOrders",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = dashboardOrdersSlice.actions;
export default dashboardOrdersSlice.reducer;
