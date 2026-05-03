import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const { register, user } = useAuth(); // added user
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created successfully");
      navigate("/home"); // redirect to Home.jsx after registration
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffafb] px-6">
      <Toaster position="top-right" />

      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center px-12 bg-[#fdecef]">
          <img src="/logo.png" alt="Aravya Jewels Logo" className="h-32 w-auto object-contain mb-6 mix-blend-multiply self-start" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Aravya Jewels
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Create your account to save your wishlist, track orders,
            and experience premium jewellery shopping.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="px-10 py-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 mb-8">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-lg
                           focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-lg
                           focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-lg
                           focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-lg
                           focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-pink-400 text-white py-4 rounded-xl
                         text-lg font-semibold hover:bg-pink-500 transition"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-pink-500 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
