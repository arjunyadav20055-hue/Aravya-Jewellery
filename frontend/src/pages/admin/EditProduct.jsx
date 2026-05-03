import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Necklaces",
  "Rings",
  "Earrings",
  "Bracelets",
  "Bangles",
  "Pendants",
  "Mangalsutra",
  "Anklets",
  "Others",
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    stock: "",
    goldWeight: "",
    makingCharges: "",
    gst: "",
    profitMargin: "",
    carat: "18K",
  });
  const [goldRate18K, setGoldRate18K] = useState(0);
  const [goldRate20K, setGoldRate20K] = useState(0);

  useEffect(() => {
    const fetchGoldRate = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data) {
          setGoldRate18K(res.data.goldRate18K || 0);
          setGoldRate20K(res.data.goldRate20K || 0);
        }
      } catch (err) {
        console.error("Error fetching gold rate:", err);
      }
    };
    fetchGoldRate();
  }, []);

  const calculatedPrice = () => {
    const w = Number(form.goldWeight) || 0;
    const m = Number(form.makingCharges) || 0;
    const g = Number(form.gst) || 0;
    const p = Number(form.profitMargin) || 0;
    const currentRate = form.carat === "20K" ? goldRate20K : goldRate18K;
    const baseValue = currentRate * w;
    return Math.round(baseValue + (baseValue * m / 100) + (baseValue * g / 100) + (baseValue * p / 100));
  };

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      const toastId = toast.loading("Fetching product...");
      try {
        const res = await api.get("/products");
        const product = res.data.find((p) => p._id === id);

        if (!product) {
          toast.error("Product not found", { id: toastId });
          navigate("/admin");
          return;
        }

        setForm({
          name: product.name,
          description: product.description,
          category: product.category,
          stock: product.stock,
          goldWeight: product.goldWeight || "",
          makingCharges: product.makingCharges || "",
          gst: product.gst || "",
          profitMargin: product.profitMargin || "",
          carat: product.carat || "18K",
        });

        toast.dismiss(toastId);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to fetch product", { id: toastId });
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      toast.error("Not authorized");
      return;
    }

    const toastId = toast.loading("Updating product...");

    try {
      await api.put(`/products/${id}`, form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success("Product updated successfully!", { id: toastId });
      navigate("/admin");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Edit Product
        </h1>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-pink-100 rounded-2xl shadow-sm p-8 space-y-6"
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none
                         focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* Pricing Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gold Weight (grams)
              </label>
              <input
                type="number"
                name="goldWeight"
                value={form.goldWeight}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Making Charges (%)
              </label>
              <input
                type="number"
                name="makingCharges"
                value={form.makingCharges}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST (%)
              </label>
              <input
                type="number"
                name="gst"
                value={form.gst}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profit Margin (%)
              </label>
              <input
                type="number"
                name="profitMargin"
                value={form.profitMargin}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
          </div>

          {/* Stock & Calculated Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            
            <div className="flex flex-col justify-end">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Final Price
              </label>
              <div className="bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 flex items-center justify-between h-[50px]">
                <span className="text-xl font-bold text-pink-600">₹{calculatedPrice()}</span>
              </div>
            </div>
          </div>

          {/* Category & Carat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white
                           focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carat
              </label>
              <select
                name="carat"
                value={form.carat}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white
                           focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              >
                <option value="18K">18 Carat</option>
                <option value="20K">20 Carat</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-4 rounded-xl
                       text-lg font-medium hover:bg-pink-500 transition"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
