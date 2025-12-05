import { NavLink, useNavigate } from "react-router";
import {
  FaChartBar,
  FaBoxOpen,
  FaWallet,
  FaSignOutAlt,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/authSlice";
import { useState } from "react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FaChartBar size={20} /> },
    { to: "/dashboard/products", label: "Products", icon: <FaBoxOpen size={20} /> },
    { to: "/dashboard/expenses", label: "Expenses", icon: <FaWallet size={20} /> },
    { to: "/dashboard/customers", label: "Customers", icon: <FaUsers size={20} /> },
    { to: "/dashboard/orders", label: "Orders", icon: <FaClipboardList size={20} /> },
  ];

  return (
    <>
      {/* Transparent blurred overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:relative z-50 w-64 h-screen p-6 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
        style={{
          backgroundColor: "#441609",
          color: "white",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div
              className="flex items-center justify-center rounded-full p-2"
              style={{ backgroundColor: "#FF8C42" }}
            >
              <img
                src="/images/Bee_s_Bakery.png"
                alt="Bakery Logo"
                className="h-24 w-24 object-contain"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)} // closes sidebar on click (mobile)
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-white text-[#E65F2B]"
                      : "text-white hover:bg-white hover:text-[#E65F2B]"
                  }`
                }
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 p-2 rounded-lg w-full text-left text-white hover:bg-white hover:text-[#E65F2B] transition-colors duration-200"
          >
            <FaSignOutAlt size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#441609]">
              Confirm Logout
            </h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
