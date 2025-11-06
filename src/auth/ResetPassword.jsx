import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import AuthStructure from "./AuthStructure";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Reset link sent to your email");
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <AuthStructure>
      <div className="w-full md:w-1/2 p-8 rounded-3xl shadow-lg bg-white text-gray-900">
        <h2 className="text-3xl font-bold text-[#933C24] mb-8 text-center">
          Reset Password
        </h2>
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-[#000000]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-[#933C24] focus:outline-none focus:ring-2 focus:ring-[#933C24]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#933C24] to-[#000000] text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300"
          >
            Send Reset Link
          </button>

          <p className="text-center text-sm mt-4">
            Remembered your password?{" "}
            <a href="/login" className="text-[#933C24] font-semibold underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </AuthStructure>
  );
};

export default ResetPassword;
