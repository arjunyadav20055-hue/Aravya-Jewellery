import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [goldRate18K, setGoldRate18K] = useState(0);
  const [previousGoldRate18K, setPreviousGoldRate18K] = useState(0);
  const [newGoldRate18K, setNewGoldRate18K] = useState("");

  const [goldRate20K, setGoldRate20K] = useState(0);
  const [previousGoldRate20K, setPreviousGoldRate20K] = useState(0);
  const [newGoldRate20K, setNewGoldRate20K] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
    fetchGoldRate();

    // Cleanup: dismiss any lingering toasts (like the confirm popup) when leaving the dashboard
    return () => {
      toast.dismiss();
    };
  }, []);

  const fetchGoldRate = async () => {
    try {
      const res = await api.get("/settings");
      if (res.data) {
        setGoldRate18K(res.data.goldRate18K || 0);
        setPreviousGoldRate18K(res.data.previousGoldRate18K || 0);
        setGoldRate20K(res.data.goldRate20K || 0);
        setPreviousGoldRate20K(res.data.previousGoldRate20K || 0);
      }
    } catch (err) {
      console.error("Error fetching gold rate:", err);
    }
  };

  const updateGoldRate = (e, carat) => {
    if (e && e.preventDefault) e.preventDefault();

    const newRate = carat === "18K" ? newGoldRate18K : newGoldRate20K;

    if (!newRate || isNaN(newRate) || newRate <= 0) {
      toast.error(`Please enter a valid ${carat} gold rate.`);
      return;
    }

    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-gray-800">
            Update {carat} gold rate to <span className="font-bold text-pink-600">₹{newRate}</span>?
            <br />
            <span className="text-sm text-gray-500 font-normal">This will recalculate all {carat} product prices.</span>
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                performGoldRateUpdate(newRate, carat);
              }}
              className="px-4 py-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  const performGoldRateUpdate = async (rate, carat) => {
    const toastId = toast.loading(`Updating ${carat} gold rate...`);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = carat === "18K" ? { goldRate18K: Number(rate) } : { goldRate20K: Number(rate) };

      const res = await api.put(
        "/settings/gold-price",
        payload,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      toast.success(res.data.message || "Gold rate updated successfully", { id: toastId });

      if (carat === "18K") {
        setGoldRate18K(res.data.settings.goldRate18K);
        setPreviousGoldRate18K(res.data.settings.previousGoldRate18K);
        setNewGoldRate18K("");
      } else {
        setGoldRate20K(res.data.settings.goldRate20K);
        setPreviousGoldRate20K(res.data.settings.previousGoldRate20K);
        setNewGoldRate20K("");
      }

      fetchProducts(); // Refresh products with new prices
    } catch (err) {
      console.error("Error updating gold rate:", err);
      toast.error("Error updating gold rate", { id: toastId });
    }
  };

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.get("/orders", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.put(
        `/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const exportToCSV = () => {
    const headers = ["ID,Name,Email,Role,Joined"];
    const rows = users.map(u => `${u._id},${u.name},${u.email},${u.role},${new Date(u.createdAt).toLocaleDateString()}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete product
  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-gray-800">
            Are you sure you want to delete this product?
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                performDelete(id);
              }}
              className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  const performDelete = async (id) => {
    const toastId = toast.loading("Deleting product...");
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully", { id: toastId });
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Error deleting product", { id: toastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-pink-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage products and inventory
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-2 rounded-xl font-medium transition ${activeTab === "products" ? "bg-pink-400 text-white" : "bg-white border border-pink-200 text-gray-700 hover:bg-pink-50"}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-xl font-medium transition ${activeTab === "users" ? "bg-pink-400 text-white" : "bg-white border border-pink-200 text-gray-700 hover:bg-pink-50"}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2 rounded-xl font-medium transition ${activeTab === "orders" ? "bg-pink-400 text-white" : "bg-white border border-pink-200 text-gray-700 hover:bg-pink-50"}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-2 rounded-xl font-medium transition ${activeTab === "settings" ? "bg-pink-400 text-white" : "bg-white border border-pink-200 text-gray-700 hover:bg-pink-50"}`}
          >
            Gold Rate
          </button>
        </div>
      </div>

      {activeTab === "products" && (
        <>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="border border-pink-100 rounded-2xl p-5 bg-white shadow-sm">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-3xl font-bold mt-1 text-pink-500">
                {products.length}
              </p>
            </div>

            <div className="border border-pink-100 rounded-2xl p-5 bg-white shadow-sm">
              <p className="text-sm text-gray-500">Admin Actions</p>
              <p className="mt-2 text-gray-700">
                Add, edit, or remove products from inventory
              </p>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Products
              </h2>
              <Link
                to="/admin/add-product"
                className="bg-pink-400 text-white px-6 py-2 rounded-xl hover:bg-pink-500 transition font-medium text-sm"
              >
                + Add Product
              </Link>
            </div>

            {products.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-pink-100 rounded-2xl
                           shadow-sm overflow-hidden hover:shadow-lg transition"
                  >
                    {/* Image */}
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    )}

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate text-gray-900">
                        {product.name}
                      </h3>

                      <p className="text-pink-500 mt-1 font-medium">
                        ₹{product.price}
                      </p>

                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>Stock: {product.stock}</span>
                        <span>{product.category}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className="flex-1 text-center bg-pink-400 text-white py-1.5
                                 rounded-xl hover:bg-pink-500 transition"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex-1 bg-red-400 text-white py-1.5
                                 rounded-xl hover:bg-red-500 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "users" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              User Management
            </h2>
            <button
              onClick={exportToCSV}
              className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition font-medium text-sm"
            >
              Download CSV
            </button>
          </div>

          <div className="bg-white border border-pink-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-50 border-b border-pink-100">
                  <th className="p-4 font-semibold text-gray-700">Name</th>
                  <th className="p-4 font-semibold text-gray-700">Email</th>
                  <th className="p-4 font-semibold text-gray-700">Role</th>
                  <th className="p-4 font-semibold text-gray-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-pink-50 hover:bg-pink-50/50 transition">
                    <td className="p-4 text-gray-800 font-medium">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="p-6 text-gray-500 text-center">No users found.</p>}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Manage Orders</h2>
          <div className="grid gap-6">
            {orders.length === 0 ? (
              <div className="bg-white border border-pink-100 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h2>
                <p className="text-gray-500">There are currently no orders placed on the store.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white border border-pink-100 rounded-2xl shadow-sm p-6">
                  <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-pink-50">
                    <div>
                      <p className="font-semibold text-gray-900">Order ID: <span className="text-gray-600 font-normal">{order._id}</span></p>
                      {order.user?.name && <p className="text-sm text-gray-500 mt-1">Customer: {order.user.name} ({order.user.email})</p>}
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img src={item.product?.images?.[0] || "/placeholder.jpg"} alt={item.product?.name || "Deleted"} className="w-12 h-12 object-cover rounded-lg border" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.product?.name || "Deleted Product"}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-pink-50 font-bold text-lg text-gray-900 text-right">
                    Total: ₹{order.totalAmount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 18K Settings */}
          <div className="bg-white border border-pink-100 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">18 Carat Gold Rate</h2>
            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-xs font-medium mb-1">Current (1g)</p>
                <p className="text-2xl font-bold text-gray-900">₹{goldRate18K}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-xs font-medium mb-1">Previous (1g)</p>
                <p className="text-2xl font-bold text-gray-500">₹{previousGoldRate18K}</p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New 18K Gold Rate (₹)
                </label>
                <input
                  type="number"
                  value={newGoldRate18K}
                  onChange={(e) => setNewGoldRate18K(e.target.value)}
                  placeholder="Enter 18K gold rate"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  required
                />
              </div>
              <button
                type="button"
                onClick={(e) => updateGoldRate(e, "18K")}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl transition duration-200"
              >
                Update 18K Rate
              </button>
            </div>
          </div>

          {/* 20K Settings */}
          <div className="bg-white border border-pink-100 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">20 Carat Gold Rate</h2>
            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-xs font-medium mb-1">Current (1g)</p>
                <p className="text-2xl font-bold text-gray-900">₹{goldRate20K}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-xs font-medium mb-1">Previous (1g)</p>
                <p className="text-2xl font-bold text-gray-500">₹{previousGoldRate20K}</p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New 20K Gold Rate (₹)
                </label>
                <input
                  type="number"
                  value={newGoldRate20K}
                  onChange={(e) => setNewGoldRate20K(e.target.value)}
                  placeholder="Enter 20K gold rate"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  required
                />
              </div>
              <button
                type="button"
                onClick={(e) => updateGoldRate(e, "20K")}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl transition duration-200"
              >
                Update 20K Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
