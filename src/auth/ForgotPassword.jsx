import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import AuthStructure from "./AuthStructure";
import api from "../../Axios/axios.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthStructure>
      <div className="w-full md:w-1/2 p-8 rounded-3xl shadow-lg bg-white text-gray-900">
        <h2 className="text-3xl font-bold text-[#933C24] mb-8 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#933C24] focus:outline-none focus:ring-2 focus:ring-[#933C24]"
          />
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-[#933C24] to-[#000000] text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </AuthStructure>
  );
};

export default ForgotPassword;
