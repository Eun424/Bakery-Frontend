import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import {fetchExpenses,addExpense,updateExpense,deleteExpense,clearMessages} from "../../store/features/expensesSlice.js";

const ExpensesPage = () => {
  const dispatch = useDispatch();
  const { expenses, loading, error, success } = useSelector(
    (state) => state.expenses
  );

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch expenses//
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchExpenses(searchTerm));
    }, 400);

    return () => clearTimeout(delay);
  }, [dispatch, searchTerm]);

  // Toast notifications//
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

  const handleAddExpense = (e) => {
    e.preventDefault();
    dispatch(addExpense(newExpense));
    setNewExpense({ category: "", amount: "", date: "" });
    setIsAdding(false);
  };

  const handleUpdateExpense = (e) => {
    e.preventDefault();
    dispatch(updateExpense({ id: selectedExpense._id, data: selectedExpense }));
    setIsEditing(false);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-row flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#e05c28] font-['Sansita_Swashed']">
            Expenses
          </h1>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-[#933C24] to-[#000000] text-white font-medium text-base px-4 py-1.5 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            + Add Expense
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-xl shadow-sm p-3 w-full sm:w-1/2">
          <FiSearch className="text-gray-500 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search by category or note..."
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

        {/* Expenses Table */}
        <div className="bg-white shadow-md overflow-x-auto rounded-xl">
          <table className="w-full border-collapse table-auto">
            <thead className="bg-[#b6350e] text-white sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left font-semibold">Category</th>
                <th className="p-4 text-left font-semibold">Amount</th>
                <th className="p-4 text-left font-semibold">Date</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : expenses.length > 0 ? (
                expenses.map((e, i) => (
                  <tr
                    key={e._id}
                    className={`${
                      i % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"
                    } hover:bg-[#FDF3F0] transition duration-200`}
                  >
                    <td className="p-4 break-words">{e.category || "-"}</td>
                    <td className="p-4">{e.amount || "-"}</td>
                    <td className="p-4">
                      {e.date
                        ? new Date(e.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="p-4 text-center flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedExpense(e);
                          setIsEditing(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(e._id);
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
                    colSpan="4"
                    className="p-6 text-center text-gray-500 font-medium"
                  >
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modals */}
        {isAdding && (
          <ExpenseModal
            title="Add Expense"
            expense={newExpense}
            setExpense={setNewExpense}
            onSubmit={handleAddExpense}
            onClose={() => setIsAdding(false)}
            submitText="Add Expense"
          />
        )}
        {isEditing && selectedExpense && (
          <ExpenseModal
            title="Edit Expense"
            expense={selectedExpense}
            setExpense={setSelectedExpense}
            onSubmit={handleUpdateExpense}
            onClose={() => setIsEditing(false)}
            submitText="Update"
            color="yellow"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-[350px] shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-[#E65F2B] mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this expense?
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
                  dispatch(deleteExpense(deleteId));
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
  );
};

// Expense Modal Component//
const ExpenseModal = ({
  title,
  expense,
  setExpense,
  onSubmit,
  onClose,
  submitText,
  color,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-[#441609]">{title}</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-[#441609]">Category</label>
          <input
            type="text"
            value={expense.category || ""}
            onChange={(e) =>
              setExpense({ ...expense, category: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-[#441609]"
            required
          />
        </div>
        <div>
          <label className="block text-[#441609]">Amount</label>
          <input
            type="number"
            value={expense.amount || ""}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-[#441609]"
            required
          />
        </div>
        <div>
          <label className="block text-[#441609]">Date</label>
          <input
            type="date"
            value={expense.date ? expense.date.slice(0, 10) : ""}
            onChange={(e) => setExpense({ ...expense, date: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-[#441609]"
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${
              color === "yellow"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-black hover:bg-gray-800"
            } text-white rounded-md px-4 py-2`}
          >
            {submitText}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default ExpensesPage;
