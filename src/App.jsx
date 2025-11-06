import { createBrowserRouter, RouterProvider } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./auth/LoginPage";
import Layout from "./components/Layout";
import  Dashboard  from "./pages/Dashboard";
import ProductsPage from "./pages/Products";
import Expenses from "./pages/Expenses";
import OrdersPage from "./pages/Orders";
import CustomersPage from "./pages/Customers";
import Signup from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";









const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },


  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },

  {
    path: "/forgotpassword",
    element: <ForgotPassword />
  },

  {
    path: "/resetpassword",
    element: <ResetPassword />
  },

  // Dashboard rotes//
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "products",
        element: <ProductsPage />
      },
      {
        path: "expenses",
        element: <Expenses />
      },
      {
        path: "orders",
        element: <OrdersPage />
      },
      {
        path: "customers",
        element: <CustomersPage />
      }
    ]
  }
  


  
])

function App() {
  return  <RouterProvider router={router} />
}




export default App;