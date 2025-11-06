import { useState, useEffect } from "react";
import { FaBell, FaSearch, FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/features/productsSlice";
import toast from "react-hot-toast";

function Navbar({ setSidebarOpen }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  //Access orders from Redux
  const { orders } = useSelector((state) => state.orders);

  //Store the count of orders due soon
  const [dueSoonCount, setDueSoonCount] = useState(0);

  //Check for due orders (within 24 hours)
  useEffect(() => {
    if (orders && orders.length > 0) {
      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const dueSoon = orders.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate >= now &&
          orderDate <= in24Hours &&
          order.status !== "Completed"
        );
      });

      //If count changed, show a toast
      if (dueSoon.length !== dueSoonCount && dueSoon.length > 0) {
        toast.success(`You have ${dueSoon.length} order(s) due within 24 hours!`, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fff5f0",
            color: "#E65F2B",
            border: "1px solid #E65F2B",
          },
        });
      }

      setDueSoonCount(dueSoon.length);
    }
  }, [orders]);

  //Search Logic
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(fetchProducts(value));
  };

  const clearSearch = () => {
    setSearchTerm("");
    dispatch(fetchProducts());
  };

  //Hover to show toast manually
  const handleBellHover = () => {
    if (dueSoonCount > 0) {
      toast(`You have ${dueSoonCount} order(s) due within 24 hours!`, {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#fff5f0",
          color: "#E65F2B",
          border: "1px solid #E65F2B",
        },
      });
    } else {
      toast("No pending orders within 24 hours!", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#fff5f0",
          color: "#E65F2B",
          border: "1px solid #E65F2B",
        },
      });
    }
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      {/*Mobile menu button */}
      <button
        className="sm:hidden text-gray-600 mr-3"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/*Search bar */}
      <div className="relative w-full max-w-md flex-1 sm:flex-none">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none  text-sm"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-sm font-bold"
          >
            ×
          </button>
        )}
      </div>

      {/*Notifications and Profile */}
      <div className="flex items-center gap-3 sm:gap-6 ml-3">
        {/* Notification Bell */}
        <div
          className="relative cursor-pointer"
          onMouseEnter={handleBellHover}
        >
          <FaBell className="h-5 w-5 text-gray-600" />
          {dueSoonCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#E65F2B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {dueSoonCount}
            </span>
          )}
        </div>

        {/*User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-10 w-10 rounded-full bg-[#E65F2B] text-white flex items-center justify-center font-semibold">
            BB
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              Beatrice Boateng
            </span>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
