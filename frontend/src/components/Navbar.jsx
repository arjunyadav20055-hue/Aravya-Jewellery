import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  PackagePlus,
  ClipboardList,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/products");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  /* ================= SEARCH SUGGESTIONS ================= */
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const value = search.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(value) ||
        p.category.toLowerCase().includes(value)
    );

    setSuggestions(filtered.slice(0, 6));
  }, [search, products]);

  const NavLinks = () => (
    <>
      {!user && (
        <>
          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-500"
          >
            <LogIn size={16} /> Login
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-pink-300 text-pink-500 hover:bg-pink-50"
          >
            <UserPlus size={16} /> Register
          </Link>
        </>
      )}

      {user && user.role === "user" && (
        <>
          <Link
            to="/wishlist"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-500"
          >
            <Heart size={16} /> Wishlist
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-500"
          >
            <ShoppingCart size={16} /> Cart
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-500"
          >
            <User size={16} /> Profile
          </Link>

          <Link
            to="/my-orders"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-500"
          >
            <ClipboardList size={16} /> Orders
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-pink-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </>
      )}

      {user && user.role === "admin" && (
        <>
          <Link
            to="/admin"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-500"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>

          <Link
            to="/admin/add-product"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-500"
          >
            <PackagePlus size={16} /> Add Product
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-pink-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white border-b border-pink-100"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
          >
            <img src="/logo.png" alt="Aravya Jewels" className="h-16 w-auto object-contain mix-blend-multiply" />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block relative w-full max-w-md">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jewellery..."
              className="w-full px-4 py-2 text-sm border border-pink-200 rounded-full focus:ring-2 focus:ring-pink-300"
            />

            {suggestions.length > 0 && (
              <div className="absolute top-11 w-full bg-white border border-pink-100 rounded-xl shadow-lg">
                {suggestions.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      navigate(`/product/${item._id}`);
                      setSearch("");
                      setSuggestions([]);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50"
                  >
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({item.category})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <NavLinks />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4 relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jewellery..."
            className="w-full px-4 py-2 text-sm border border-pink-200 rounded-full"
          />

          {suggestions.length > 0 && (
            <div className="absolute top-11 w-full bg-white border border-pink-100 rounded-xl shadow-lg">
              {suggestions.map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    setSearch("");
                    setSuggestions([]);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-pink-50"
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 flex flex-col gap-4 text-sm"
            >
              <NavLinks />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
