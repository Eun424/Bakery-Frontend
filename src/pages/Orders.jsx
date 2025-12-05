import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import {fetchOrders,addOrder,updateOrder,deleteOrder,clearMessages} from "../../store/features/ordersSlice.js";



// Product List//
const products = [
  { name: "Chocolate Cake", image: "/productimages/Chocolate_cake.png" },
  { name: "Vanilla Cake", image: "/productimages/Vanilla_cake.png" },
  { name: "Red Velvet", image: "/productimages/Red_velvet.png" },
  { name: "Butter Bread", image: "/productimages/Butter_bread.png" },
  { name: "Sugar Bread", image: "/productimages/Sugar_Bread.png" },
  { name: "Wheat Bread", image: "/productimages/Wheat_Bread.png" },
  { name: "Chocolate Bread", image: "/productimages/Chocolate_bread.png" },
  { name: "Meat Pie", image: "/productimages/Meat_Pies.png" },
  { name: "Samosa", image: "/productimages/Samosa_fries.png" },
  { name: "Spring Rolls", image: "/productimages/Springrolls_fries.png" },
];


const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, success, error, loading } = useSelector(
    (state) => state.orders
  );

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [editId, setEditId] = useState(null);

  const [newOrder, setNewOrder] = useState({
    customerName: "",
    items: [],
    date: "",
  });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      toast.error(error);
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() === "") dispatch(fetchOrders());
      else dispatch(fetchOrders(search));
    }, 500);
    return () => clearTimeout(delay);
  }, [search, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (e) => {
    const selectedName = e.target.value;
    if (!selectedName) return;

    const selected = products.find((p) => p.name === selectedName);
    if (!selected) return;

    setNewOrder((prev) => {
      const exists = prev.items.find(
        (item) => item.productName === selectedName
      );
      if (exists) return prev;
      return {
        ...prev,
        items: [...prev.items, { productName: selectedName, price: 0 }],
      };
    });

    setSelectedProduct(""); // Reset dropdown after selection
  };

  const handleItemPriceChange = (index, value) => {
    const itemsCopy = [...newOrder.items];
    itemsCopy[index].price = Number(value);
    setNewOrder((prev) => ({ ...prev, items: itemsCopy }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newOrder.customerName || !newOrder.items.length || !newOrder.date) {
      toast.error("Please fill all fields and add at least one product");
      return;
    }
    for (let item of newOrder.items) {
      if (!item.price || item.price <= 0) {
        toast.error(`Price for ${item.productName} is required`);
        return;
      }
    }
    if (editId) dispatch(updateOrder({ id: editId, data: newOrder }));
    else dispatch(addOrder({ ...newOrder, status: "Pending" }));

    setShowModal(false);
    setNewOrder({ customerName: "", items: [], date: "" });
    setSelectedProduct("");
    setEditId(null);
  };

  const handleEdit = (order) => {
    setEditId(order._id);
    setNewOrder({
      customerName: order.customerName,
      items: order.items,
      date: order.date ? order.date.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteOrder(deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleToggleStatus = (order) => {
    if (order.status === "Completed") return toast("Order already completed!");
    const nextStatus =
      order.status === "Pending"
        ? "Processing"
        : order.status === "Processing"
        ? "Completed"
        : order.status;
    dispatch(updateOrder({ id: order._id, data: { status: nextStatus } }));
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-row flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#e05c28] font-['Sansita_Swashed']">
            Orders
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#933C24] to-[#000000] text-white font-medium text-base px-4 py-1.5 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            + Add Order
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white rounded-xl shadow-sm p-3 w-full sm:w-1/2">
          <FiSearch className="text-gray-500 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search by customer or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="ml-2 text-gray-500 hover:text-black transition"
            >
              ×
            </button>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-md overflow-x-auto rounded-xl">
          <table className="w-full border-collapse table-auto">
            <thead className="bg-[#b6350e] text-white sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left font-semibold">Customer</th>
                <th className="p-3 text-left font-semibold">Items</th>
                <th className="p-3 text-left font-semibold">Total (₵)</th>
                <th className="p-3 text-left font-semibold">Date</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((o, i) => (
                  <tr
                    key={o._id}
                    className={`${
                      i % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"
                    } hover:bg-[#FDF3F0] transition`}
                  >
                    <td className="p-3">{o.customerName}</td>
                    <td className="p-3 flex flex-col gap-1">
                      {o.items.map((item, idx) => {
                        const product = products.find(
                          (p) => p.name === item.productName
                        );
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            {product?.image && (
                              <img
                                src={product.image}
                                alt={item.productName}
                                className="w-8 h-8 object-cover rounded-full"
                              />
                            )}
                            <span>
                              {item.productName} (₵{item.price})
                            </span>
                          </div>
                        );
                      })}
                    </td>
                    <td className="p-3">
                      {o.items.reduce((sum, item) => sum + item.price, 0)}
                    </td>
                    <td className="p-3">
                      {new Date(o.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleStatus(o)}
                        className={`px-3 py-1 rounded-full font-semibold ${
                          o.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : o.status === "Processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {o.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 flex gap-3 justify-start">
                      <button
                        onClick={() => handleEdit(o)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(o._id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Order Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/20">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#e65f2b]">
              {editId ? "Edit Order" : "Add Order"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={newOrder.customerName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newOrder.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Add Products</label>
                <select
                  value={selectedProduct}
                  onChange={handleProductSelect}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {newOrder.items.length > 0 && (
                <div>
                  <label className="block mb-1 font-medium">
                    Products & Prices
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="flex-1">{item.productName}</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) =>
                            handleItemPriceChange(idx, e.target.value)
                          }
                          className="w-20 border border-gray-300 rounded-md p-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white ${
                    editId
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {editId ? "Update Order" : "Add Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/20">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#441609]">
              Confirm Delete
            </h2>
            <p className="mb-4">Are you sure you want to delete this order?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
