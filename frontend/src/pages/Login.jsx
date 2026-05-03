import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth(); // added user to check if already logged in
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to /home
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in successfully");
      navigate("/home"); // redirect to Home.jsx after login
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffafb] px-6">
      <Toaster position="top-right" />

      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* LEFT SIDE (Brand / Info) */}
        <div className="hidden md:flex flex-col justify-center px-12 bg-[#fdecef]">
          <img src="/logo.png" alt="Aravya Jewels Logo" className="h-32 w-auto object-contain mb-6 mix-blend-multiply self-start" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Aravya Jewels
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Login to manage your orders, wishlist, and explore premium
            jewellery crafted with elegance.
          </p>
        </div>

        {/* RIGHT SIDE (Form) */}
        <div className="px-10 py-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">
            Please login to your account
          </p>

          <form onSubmit={submitHandler} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-pink-500 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
