import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import {fetchCustomers,addCustomer,updateCustomer,deleteCustomer,clearMessages} from "../../store/features/customersSlice.js";

const CustomersPage = () => {
  const dispatch = useDispatch();
  const { customers, loading, error, success } = useSelector(
    (state) => state.customers
  );

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    location: "",
    date: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch customers from backend//
  useEffect(() => {
  const delay = setTimeout(() => {
    dispatch(fetchCustomers(searchTerm));
  }, 400); // small delay to avoid fetching on every keystroke

  return () => clearTimeout(delay);
}, [dispatch, searchTerm]);

  //Toast Notifications//
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

  

  const handleAddCustomer = (e) => {
    e.preventDefault();
    dispatch(addCustomer(newCustomer));
    setNewCustomer({ name: "", contact: "", location: "", date: "" });
    setIsAdding(false);
  };

  const handleUpdateCustomer = (e) => {
    e.preventDefault();
    dispatch(
      updateCustomer({ id: selectedCustomer._id, data: selectedCustomer })
    );
    setIsEditing(false);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-row flex-wrap justify-between items-center gap-4">
  <h1 className="text-3xl sm:text-4xl font-bold text-[#e05c28] font-['Sansita_Swashed']">
    Customers
  </h1>
  <button
    onClick={() => setIsAdding(true)}
    className="bg-gradient-to-r from-[#933C24] to-[#000000] text-white font-medium text-base px-4 py-1.5 rounded-lg hover:scale-105 transition-transform duration-300"
  >
    + Add Customer
  </button>
</div>


        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-xl shadow-sm p-3 w-full sm:w-1/2">
          <FiSearch className="text-gray-500 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search by customer or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 text-gray-500 hover:text-black transition"
            >
              ×
            </button>
          )}
        </div>

        {/* Customers Table */}
        <div className="bg-white shadow-md overflow-x-auto rounded-lg">
          <table className="w-full border-collapse table-fixed min-w-[600px]">
            <thead className="bg-[#b6350e] text-white sticky top-0 z-10">
              <tr>
                <th className="p-3 sm:p-4 text-left font-semibold">Name</th>
                <th className="p-3 sm:p-4 text-left font-semibold">Contact</th>
                <th className="p-3 sm:p-4 text-left font-semibold">Location</th>
                <th className="p-3 sm:p-4 text-left font-semibold">Date</th>
                <th className="p-3 sm:p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((c, i) => (
                  <tr
                    key={c._id}
                    className={`${
                      i % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"
                    } hover:bg-[#FDF3F0] transition duration-200`}
                  >
                    <td className="p-3 sm:p-4">{c.name}</td>
                    <td className="p-3 sm:p-4">{c.contact}</td>
                    <td className="p-3 sm:p-4">{c.location}</td>
                    <td className="p-3 sm:p-4">
                      {new Date(c.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-3 sm:p-4 text-center flex justify-center gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          setSelectedCustomer(c);
                          setIsEditing(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(c._id);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500 font-medium"
                  >
                    No customer found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modals */}
        {isAdding && (
          <CustomerModal
            title="Add Customer"
            customer={newCustomer}
            setCustomer={setNewCustomer}
            onSubmit={handleAddCustomer}
            onClose={() => setIsAdding(false)}
            submitText="Add Customer"
          />
        )}
        {isEditing && selectedCustomer && (
          <CustomerModal
            title="Edit Customer"
            customer={selectedCustomer}
            setCustomer={setSelectedCustomer}
            onSubmit={handleUpdateCustomer}
            onClose={() => setIsEditing(false)}
            submitText="Update"
            color="yellow"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-[#E65F2B] mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this customer?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg font-medium w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(deleteCustomer(deleteId));
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium w-full sm:w-auto"
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

// Customer Modal//
const CustomerModal = ({
  title,
  customer,
  setCustomer,
  onSubmit,
  onClose,
  submitText,
  color,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm px-4">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-[#441609]">{title}</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-[#441609]">Name</label>
          <input
            type="text"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-[#441609]"
            required
          />
        </div>

        <div>
          <label className="block text-[#441609]">Contact</label>
          <input
            type="text"
            value={customer.contact}
            onChange={(e) =>
              setCustomer({ ...customer, contact: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-[#441609]"
            required
          />
        </div>

        <div>
          <label className="block text-[#441609]">Location</label>
          <input
            type="text"
            value={customer.location}
            onChange={(e) =>
              setCustomer({ ...customer, location: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-[#441609]"
            required
          />
        </div>

        <div>
          <label className="block text-[#441609]">Date</label>
          <input
            type="date"
            value={customer.date ? customer.date.slice(0, 10) : ""}
            onChange={(e) =>
              setCustomer({ ...customer, date: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-[#441609]"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${
              color === "yellow"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-black hover:bg-gray-800"
            } text-white rounded-md px-4 py-2 w-full sm:w-auto`}
          >
            {submitText}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default CustomersPage;
