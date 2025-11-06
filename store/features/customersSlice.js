import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Axios/axios";

const initialState = {
  customers: [],
  loading: false,
  error: null,
  success: null,
};

// Add customer
export const addCustomer = createAsyncThunk(
  "customers/add",
  async (customerData, thunkAPI) => {
    try {
      const res = await api.post("/customers", customerData);
      return res.data.customer;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Fetch all or search customers
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (searchTerm = "", { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/customers${searchTerm ? `?search=${searchTerm}` : ""}`
      );
      return res.data.customers;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch customers"
      );
    }
  }
);

// Update customer
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/customers/${id}`, data);
      return res.data.customer;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/customers/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
        state.success = "Customer added successfully";
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.customers[index] = action.payload;
        state.success = "Customer updated successfully";
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (c) => c._id !== action.payload
        );
        state.success = "Customer deleted successfully";
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = customersSlice.actions;
export default customersSlice.reducer;
