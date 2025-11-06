import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Axios/axios";


const initialState = {
  expenses: [],
  loading: false,
  error: null,
  success: null,
};

// Fetch expenses
export const fetchExpenses = createAsyncThunk(
  "dashboardExpenses/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/expenses");
      return res.data.expenses;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Something went wrong");
    }
  }
);

const dashboardExpensesSlice = createSlice({
  name: "dashboardExpenses",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = dashboardExpensesSlice.actions;
export default dashboardExpensesSlice.reducer;
