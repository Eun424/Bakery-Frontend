import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import AuthStructure from "./AuthStructure";
import { login } from "../../store/features/authSlice";

const Login = () => {
  const { users, error } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!userData.email || !userData.password) {
      return toast.error("Email and password are required");
    }

    dispatch(login(userData));
  };

  useEffect(() => {
    if (users?.success) {
      toast.success(users?.message);
      navigate("/dashboard", { replace: true });
    }
  }, [users, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setErrorMessage(error);
    }
  }, [error]);

  return (
    <AuthStructure>
      <div className="w-full md:w-1/2 p-8 rounded-3xl shadow-lg bg-white text-gray-900">
        <h2 className="text-3xl font-bold text-[#933C24] mb-8 text-center">
          Login
        </h2>
        {errorMessage && (
          <div className="text-red-500 text-center">{errorMessage}</div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <label className="block mb-1 font-medium text-[#000000]">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl border border-[#933C24] focus:outline-none focus:ring-2 focus:ring-[#933C24] transition"
          />

          <label className="block mb-1 font-medium text-[#000000]">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-[#933C24] focus:outline-none focus:ring-2 focus:ring-[#933C24] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-2 text-gray-500 flex items-center"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#933C24] to-[#000000] text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300"
          >
            LOGIN
          </button>

          <div className="text-[#933C24] underline -mt-3">
            <Link to="/forgotPassword">Forgot Password?</Link>
          </div>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#933C24] font-semibold underline"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </AuthStructure>
  );
};

export default Login;
