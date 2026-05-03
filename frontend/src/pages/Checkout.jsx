import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  if (!state) return <p className="p-6">No items to checkout.</p>;

  const { cartItems, totalPrice } = state;

  // ======================
  // COD ORDER
  // ======================
  const placeCODOrder = async () => {
    setPlacingOrder(true);
    try {
      await api.post("/orders", {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: "COD",
      });

      toast.success("Order placed successfully");
      navigate("/thank-you");
    } catch (err) {
      console.error("COD Order Error:", err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ======================
  // RAZORPAY ORDER
  // ======================
  const placeOnlineOrder = async () => {
    try {
      const { data: orderData } = await api.post("/orders", {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: "RAZORPAY",
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.totalAmount * 100,
        currency: "INR",
        name: "Aravya Jewels",
        description: "Order Payment",
        order_id: orderData.razorpayOrder?.id,
        handler: async function (response) {
          try {
            await api.post("/orders/verify-payment", {
              orderId: orderData.order._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful");
            navigate("/thank-you", { state: { payment: response } });
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error(err.response?.data?.message || "Payment verification failed");
          }
        },
        theme: { color: "#f9c5d1" }, // pink theme
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  const handlePlaceOrder = () => {
    if (!shippingAddress.trim()) {
      toast.error("Please enter shipping address");
      return;
    }

    paymentMethod === "COD" ? placeCODOrder() : placeOnlineOrder();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#fffafb] min-h-screen">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>

      <div className="space-y-6">
        {/* SHIPPING ADDRESS */}
        <div className="bg-white border border-[#fdecef] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>

          <textarea
            rows="4"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Enter full delivery address"
            className="w-full border border-[#fdecef] rounded-lg p-3
                       focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* PAYMENT METHOD */}
        <div className="bg-white border border-[#fdecef] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-[#fdecef] rounded-lg p-3
                       focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="RAZORPAY">Online Payment</option>
          </select>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white border border-[#fdecef] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm text-gray-700">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-gray-200 pb-2 last:border-b-0"
              >
                <span className="truncate">
                  {item.product.name} × {item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* PLACE ORDER */}
        <div className="bg-white border border-[#fdecef] rounded-xl p-6">
          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="w-full bg-pink-400 text-white py-3 rounded-lg
                       font-medium hover:bg-pink-500 transition"
          >
            {placingOrder
              ? "Processing..."
              : paymentMethod === "COD"
              ? "Place Order"
              : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
