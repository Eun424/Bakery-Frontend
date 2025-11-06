import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaChartLine, FaChartBar } from "react-icons/fa";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";
import CediSign from "../components/CediSign";
import {fetchOrders,fetchMonthlyRevenue} from "../../store/features/ordersSlice";
import { fetchExpenses } from "../../store/features/expensesSlice";

// Custom Tooltip for Sales Chart//
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border p-2 rounded shadow text-sm">
        <p>{label}</p>
        <p>
          <CediSign /> {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const dispatch = useDispatch();

  // Get state from Redux//
  const { orders, monthlyRevenue } = useSelector((state) => state.orders);
  const { expenses } = useSelector((state) => state.expenses);

  // Destructure monthlyRevenue//
  const { currentMonth = 0, lastMonth = 0 } = monthlyRevenue;

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchExpenses());
    dispatch(fetchMonthlyRevenue());
  }, [dispatch]);

  // Totals//
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.totalAmount || o.amount) || 0),
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );
  const netProfit = totalRevenue - totalExpenses;
  const ordersCount = orders.length;

  // Calculate revenue change//
  const revenueChange = lastMonth
    ? ((currentMonth - lastMonth) / lastMonth) * 100
    : 0;

  // Calculate net profit change//
  const netProfitChange = lastMonth
    ? ((netProfit - (lastMonth - totalExpenses)) /
        (lastMonth - totalExpenses || 1)) *
      100
    : 0;

  // Orders change//
  const ordersChange = lastMonth
    ? ((ordersCount - ordersCount) / (ordersCount || 1)) * 100
    : 0;

  const stats = [
    {
      title: "Total Revenue",
      value: (
        <>
          <CediSign />
          {totalRevenue.toLocaleString()}
        </>
      ),
      change: `${revenueChange.toFixed(1)}%`,
      isPositive: revenueChange >= 0,
      icon: <FaChartLine className="h-6 w-6" />,
    },
    {
      title: "Total Expenses",
      value: (
        <>
          <CediSign />
          {totalExpenses.toLocaleString()}
        </>
      ),
      change: "0%",
      isPositive: false,
      icon: <FaChartBar className="h-6 w-6" />,
    },
    {
      title: "Net Profit",
      value: (
        <>
          <CediSign />
          {netProfit.toLocaleString()}
        </>
      ),
      change: `${netProfitChange.toFixed(1)}%`,
      isPositive: netProfitChange >= 0,
      icon: <FaChartLine className="h-6 w-6" />,
    },
    {
      title: "Orders",
      value: ordersCount,
      change: `${ordersChange.toFixed(1)}%`,
      isPositive: ordersChange >= 0,
      icon: <FaShoppingCart className="h-6 w-6" />,
    },
  ];

  // Getting day//
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Aggregate orders by day//
  const salesData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day) => {
      const dayTotal = orders
        .filter(
          (order) => order.createdAt && getDayName(order.createdAt) === day
        )
        .reduce((sum, o) => sum + Number(o.totalAmount || o.amount || 0), 0);
      return { name: day, sales: dayTotal };
    }
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-4 sm:p-6 flex items-center justify-between rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex-1">
              <p className="text-sm text-[#6B7280]">{stat.title}</p>
              <h3 className="mt-1 sm:mt-2 text-[#1F1F1F]">{stat.value}</h3>
              <p className={`text-xs mt-1 sm:mt-2 ${stat.isPositive ? "text-green-600" : "text-red-600"}`}>
                {stat.change} from last month
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#E65F2B]/10 flex items-center justify-center text-[#E65F2B]">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Weekly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#1F1F1F" />
              <YAxis stroke="#1F1F1F" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#E65F2B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4 space-y-2 sm:space-y-4">
          <h2 className="font-semibold text-lg mb-2">Recent Expenses</h2>
          {expenses.map((expense, idx) => {
            const colors = [
              "bg-orange-100 text-orange-800",
              "bg-blue-100 text-blue-800",
              "bg-green-100 text-green-800",
              "bg-purple-100 text-purple-800",
              "bg-red-100 text-red-800",
              "bg-yellow-100 text-yellow-800",
            ];
            const colorClass = colors[idx % colors.length];
            return (
              <div
                key={expense._id || expense.id}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-[#F3F4F6]/50 transition-colors ${colorClass}`}
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">{expense.description}</p>
                  <p className="text-xs mt-0.5 sm:mt-1 text-[#6B7280]">{expense.date}</p>
                </div>
                <div className="ml-2 sm:ml-4">
                  <p className="text-red-600">
                    -₵{Number(expense.amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <h2 className="font-semibold text-lg mb-2">Recent Orders</h2>
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-[#F3F4F6]">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Product</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id || order.id}
                className="hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="p-2">{order._id || order.id}</td>
                <td className="p-2">{order.customerName || order.customer}</td>
                <td className="p-2">
                  {Array.isArray(order.items)
                    ? order.items.map((it) => it.productName).join(", ")
                    : order.product || order.items}
                </td>
                <td className="p-2">
                  <CediSign /> {Number(order.totalAmount || order.amount || 0).toLocaleString()}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-2 text-[#6B7280]">
                  {new Date(order.createdAt || order.time).toLocaleDateString(
                    "en-US",
                    { weekday: "short", month: "short", day: "numeric" }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default Dashboard