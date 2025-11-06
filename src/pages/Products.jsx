import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {addProduct,deleteProduct,fetchProducts,updateProduct,clearMessages} from "../../store/features/productsSlice.js";
import toast from "react-hot-toast";

import chocolateCake from "../assets/productimages/Chocolate_cake.png";
import vanillaCake from "../assets/productimages/Vanilla_cake.png";
import redvelvetCake from "../assets/productimages/Red_velvet.png";
import butterBread from "../assets/productimages/Butter_bread.png";
import sugarBread from "../assets/productimages/Sugar_Bread.png";
import wheatBread from "../assets/productimages/Wheat_Bread.png";
import chocolateBread from "../assets/productimages/Chocolate_bread.png";
import meatPie from "../assets/productimages/Meat_Pies.png";
import samosa from "../assets/productimages/Samosa_fries.png";
import springRolls from "../assets/productimages/Springrolls_fries.png";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, success } = useSelector(
    (state) => state.products
  );

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    date: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const availableProducts = [
    { name: "Chocolate Cake", image: chocolateCake },
    { name: "Vanilla cake", image: vanillaCake },
    { name: "Red velvet", image: redvelvetCake },
    { name: "Butter bread", image: butterBread },
    { name: "Sugar bread", image: sugarBread },
    { name: "Wheat bread", image: wheatBread },
    { name: "Chocolate bread", image: chocolateBread },
    { name: "Samosa", image: samosa },
    { name: "Meatpie", image: meatPie },
    { name: "Springrolls", image: springRolls },
  ];

  // Fetch all products//
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const productsWithImages = products.map((p) => {
    const match = availableProducts.find(
      (ap) => ap.name.toLowerCase() === p.name.toLowerCase()
    );
    return { ...p, image: match ? match.image : null };
  });

  // Toast for success/error//
  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  // Add new product//
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.quantity || !formData.date) {
      toast.error("Please fill all fields!");
      return;
    }

    dispatch(addProduct(formData));

    setFormData({ name: "", quantity: "", date: "", image: "" });
  };

  // Edit product//
  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setIsEditing(true);
  };

  // Update product//
  const handleUpdate = (e) => {
    e.preventDefault();

    dispatch(updateProduct({ id: editingId, data: formData }));
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", quantity: "", date: "", image: "" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", quantity: "", date: "", image: "" });
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-[#e05c28] mb-4 sm:mb-8">
          Bakery Products
        </h1>

        {/* Add Product Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg">
          <form
            onSubmit={isEditing ? handleUpdate : handleSubmit}
            className="space-y-4 sm:space-y-6"
          >
            <select
              value={formData.name}
              onChange={(e) => {
                const selected = availableProducts.find(
                  (p) => p.name === e.target.value
                );
                setFormData({
                  ...formData,
                  name: selected?.name || "",
                  image: selected?.image || "",
                });
              }}
              className="w-full border border-gray-300 rounded-md p-2 text-base sm:text-lg focus:border-black outline-none placeholder:text-gray-400 text-gray-700"
              required
            >
              <option value="">Select Product</option>
              {availableProducts.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            {formData.image ? (
              <div className="flex justify-center mt-2 sm:mt-3">
                <img
                  src={formData.image}
                  alt={formData.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl border border-gray-300"
                />
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-2">
                Select a product to display an image
              </p>
            )}

            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 text-base sm:text-lg focus:border-black outline-none placeholder:text-gray-400 text-gray-700"
              required
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 text-base sm:text-lg focus:border-black outline-none placeholder:text-gray-400 text-gray-700"
              required
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-[#933C24] to-[#000000] text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-md hover:scale-105 transition-transform duration-300"
            >
              {isEditing ? "Update Product" : " + Add Product "}
            </button>
          </form>
        </div>

        {/* Products Table */}
        <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-lg overflow-x-auto">
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : !products || products.length === 0 ? (
            <p className="text-center py-8 text-lg">No products found.</p>
          ) : (
            <table className="w-full min-w-[600px] table-auto text-[#441609]">
              <thead className="bg-[#b6350e] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Product Name</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsWithImages.map((p, i) => (
                  <tr
                    key={p._id}
                    className={`${
                      i % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"
                    } hover:bg-[#FDF3F0] transition duration-300`}
                  >
                    <td className="py-3 px-4">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Select a product to display an image
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      {p.quantity}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(p.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-3 py-1 transition duration-200"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(p._id);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1 transition duration-200"
                        title="Delete"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl text-center">
              <h2 className="text-2xl font-bold text-[#E65F2B] mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this product?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    dispatch(deleteProduct(deleteId));
                    setShowDeleteModal(false);
                    setDeleteId(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
