import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Axios/axios";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  success: null,
  revenue: 0,
  monthlyRevenue: { currentMonth: 0, lastMonth: 0 },
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (searchTerm = "", { rejectWithValue }) => {
    try {
      const res = await api.get(`/orders${searchTerm ? `?search=${searchTerm}` : ""}`);
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);


export const addOrder = createAsyncThunk(
  "orders/add",
  async (orderData, thunkAPI) => {
    try {
      const res = await api.post("/orders", orderData);
      return res.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const updateOrder = createAsyncThunk(
  "orders/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/orders/${id}`, data);
      return res.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/orders/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const fetchRevenue = createAsyncThunk(
  "orders/fetchRevenue",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/orders/revenue");
      return res.data.totalRevenue;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const fetchMonthlyRevenue = createAsyncThunk(
  "orders/fetchMonthlyRevenue",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/orders/monthlyrevenue");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
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
      })

      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.success = "Order added successfully";
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) state.orders[index] = action.payload;
        state.success = "Order updated successfully";
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((o) => o._id !== action.payload);
        state.success = "Order deleted successfully";
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.revenue = action.payload;
      })

      // fetchMonthlyRevenue
      .addCase(fetchMonthlyRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyRevenue = action.payload; // { currentMonth, lastMonth }
      })
      .addCase(fetchMonthlyRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = ordersSlice.actions;
export default ordersSlice.reducer;
