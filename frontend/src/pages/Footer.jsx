import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-[#fffafb] border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* ================= BRAND ================= */}
        <div>
          <img src="/logo.png" alt="Aravya Jewels" className="h-20 w-auto object-contain mb-2 mix-blend-multiply" />
          <p className="mt-2 text-sm text-gray-600 max-w-xs">
            Crafting timeless jewellery with elegance, purity, and trust.
            Designed to shine with every moment of your life.
          </p>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="/home" className="hover:text-pink-500 transition-colors">
                Shop
              </Link>
            </li>

            {!user && (
              <>
                <li>
                  <Link to="/login" className="hover:text-pink-500 transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-pink-500 transition-colors">
                    Register
                  </Link>
                </li>
              </>
            )}

            {user && user.role === "user" && (
              <>
                <li>
                  <Link to="/profile" className="hover:text-pink-500 transition-colors">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" className="hover:text-pink-500 transition-colors">
                    My Orders
                  </Link>
                </li>
              </>
            )}

            {user && user.role === "admin" && (
              <>
                <li>
                  <Link to="/admin" className="hover:text-pink-500 transition-colors">
                    Admin Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* ================= POLICIES ================= */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Policies</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="/privacy-policy" className="hover:text-pink-500 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-conditions" className="hover:text-pink-500 transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-pink-500 transition-colors">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-pink-500 transition-colors">
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= INFO ================= */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Contact</h3>
          <p className="text-sm text-gray-600">
            Email: aravyajewels@gmail.com
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Phone: +91 9258725997
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Address: Vidhuna road, Bharthana, Etawah, UP 206242
          </p>
        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-pink-100 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Aravya Jewels. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
