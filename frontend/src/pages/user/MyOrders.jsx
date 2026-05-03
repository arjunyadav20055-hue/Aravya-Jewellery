import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

// 🔹 Status badge styles
const getStatusStyles = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Processing":
      return "bg-blue-100 text-blue-700";
    case "Shipped":
      return "bg-purple-100 text-purple-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error("Orders fetch error:", err);
        setError("Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="p-6 text-gray-700">Loading orders...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#fffafb] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl bg-white shadow-sm p-5"
            >
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium text-gray-900">{order._id}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusStyles(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 py-4 items-center"
                  >
                    {/* Product Image */}
                    <img
                      src={item.product?.images?.[0] || "/placeholder.jpg"}
                      alt={item.product?.name || "Deleted Product"}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product?._id || ""}`}
                        className="font-medium text-lg text-gray-900 hover:underline"
                      >
                        {item.product?.name || "Deleted Product"}
                      </Link>

                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>

                      <p className="text-sm font-semibold mt-1 text-gray-900">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col md:flex-row justify-between items-center mt-4 pt-4 border-t">
                <p className="text-lg font-bold text-gray-900">
                  Total: ₹{order.totalAmount}
                </p>

                <Link
                  to="/"
                  className="mt-2 md:mt-0 text-sm text-blue-600 hover:underline"
                >
                  Continue Shopping →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
