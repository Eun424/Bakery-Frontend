import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Axios/axios";

const initialState = {
  expenses: [],
  loading: false,
  error: null,
  success: null,
};

export const addExpense = createAsyncThunk(
  "expenses/add",
  async (expenseData, thunkAPI) => {
    try {
      const res = await api.post("/expenses", expenseData);
      return res.data.expense;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

//Fetch Expenses//
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (searchTerm = "", { rejectWithValue }) => {
    try {
      // If there’s a search term, send it as a query string (?search=value)
      const res = await api.get(
        `/expenses${searchTerm ? `?search=${searchTerm}` : ""}`
      );
      return res.data.expenses;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch expenses"
      );
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/expenses/${id}`, data);
      return res.data.expense;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/expenses/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const expensesSlice = createSlice({
  name: "expenses",
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
      })

      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
        state.success = "Expense added successfully";
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) state.expenses[index] = action.payload;
        state.success = "Expense updated successfully";
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter((e) => e._id !== action.payload);
        state.success = "Expense deleted successfully";
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = expensesSlice.actions;
export default expensesSlice.reducer;
