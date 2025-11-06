import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/features/authSlice';
import productReducer from '../store/features/productsSlice';
import expenseReducer from '../store/features/expensesSlice';
import customerReducer from '../store/features/customersSlice';
import orderReducer from '../store/features/ordersSlice';
import dashboardOrdersReducer from '../store/dashboard/dashboardOrdersSlice';
import dashboardExpensesReducer from '../store/dashboard/dashboardExpensesSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    expenses: expenseReducer,
    customers: customerReducer,
    orders: orderReducer,
    dashboardOrders: dashboardOrdersReducer,
    dashboardExpenses: dashboardExpensesReducer,
  }
});
