import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthStructure from "./AuthStructure";
import { register } from "../../store/features/authSlice";

const Signup = () => {
  const { success, error } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return toast.error("All fields are required");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    dispatch(register(formData));
  };

  useEffect(() => {
    if (success) {
      navigate("/login", { replace: true });
    }
  }, [success, navigate]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      toast.error(error);
    }
  }, [error]);

  return (
    <AuthStructure>
      <div className="w-full md:w-1/2 p-8 rounded-3xl shadow-lg bg-white text-gray-900">
        <h2 className="text-3xl font-bold text-[#933C24] mb-8 text-center">
          Register
        </h2>
        {errorMessage && (
          <div className="text-red-500 text-center">{errorMessage}</div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#933C24] focus:outline-none focus:ring-2 focus:ring-[#933C24]"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#933C24] focus:outline-none focus:ring-2 focus:ring-[#933C24]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#933C24] focus:outline-none focus:ring-2 focus:ring-[#933C24]"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              minLength={8} 
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#933C24] focus:outline-none focus:ring-2 focus:ring-[#933C24]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-2 text-gray-500 flex items-center"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#933C24] focus:outline-none focus:ring-2 focus:ring-[#933C24]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 px-2 text-gray-500 flex items-center"
            >
              {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#933C24] to-[#000000] text-white font-bold rounded-xl hover:scale-105 transition-transform duration-300"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </AuthStructure>
  );
};

export default Signup;
