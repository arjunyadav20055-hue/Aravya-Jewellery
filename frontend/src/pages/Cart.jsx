import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCartItems(res.data);
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      setError("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems, totalPrice } });
  };

  if (loading)
    return <p className="p-6 text-gray-700">Loading your cart...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (cartItems.length === 0)
    return <p className="p-6 text-gray-700">Your cart is empty.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#fffafb] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <motion.div
            key={item.product._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between border border-pink-200 rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            {/* Image */}
            <div className="flex items-center gap-4">
              {item.product.images && item.product.images[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{item.product.name}</span>
                <span className="text-gray-500 text-sm">Qty: {item.quantity}</span>
              </div>
            </div>

            {/* Price */}
            <span className="font-semibold text-gray-900">
              ₹{item.product.price * item.quantity}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Total & Checkout */}
      <div className="text-right mt-6">
        <p className="text-2xl font-bold text-gray-900">Total: ₹{totalPrice}</p>
        <button
          className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 mt-4 rounded-lg font-medium transition"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
