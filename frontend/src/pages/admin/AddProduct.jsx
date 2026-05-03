import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
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

const AddProduct = () => {
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
  const [images, setImages] = useState([]);
  const [goldRate18K, setGoldRate18K] = useState(0);
  const [goldRate20K, setGoldRate20K] = useState(0);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    images.forEach((img) => data.append("images", img));

    const toastId = toast.loading("Adding product...");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      await api.post("/products/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!", { id: toastId });
      navigate("/admin");
    } catch (err) {
      console.error("Add Product Error:", err);
      toast.error("Failed to add product", { id: toastId });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Add New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-pink-100 rounded-2xl shadow-sm p-6 space-y-5"
      >
        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3
                     focus:outline-none focus:ring-2 focus:ring-pink-300"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 h-28 resize-none
                     focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        {/* Pricing Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="goldWeight"
            placeholder="Gold Weight (grams)"
            value={form.goldWeight}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            type="number"
            name="makingCharges"
            placeholder="Making Charges (%)"
            value={form.makingCharges}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            type="number"
            name="gst"
            placeholder="GST (%)"
            value={form.gst}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <input
            type="number"
            name="profitMargin"
            placeholder="Profit Margin (%)"
            value={form.profitMargin}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
        </div>

        {/* Stock & Calculated Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-gray-600 font-medium">Estimated Price:</span>
            <span className="text-xl font-bold text-pink-600">₹{calculatedPrice()}</span>
          </div>
        </div>

        {/* Category & Carat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white
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

          <select
            name="carat"
            value={form.carat}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          >
            <option value="18K">18 Carat</option>
            <option value="20K">20 Carat</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Images
          </label>

          <label
            htmlFor="product-images"
            className="flex flex-col items-center justify-center w-full h-36
                       border-2 border-dashed border-pink-200 rounded-2xl cursor-pointer
                       bg-pink-50 hover:bg-pink-100 transition"
          >
            <p className="text-sm font-semibold text-gray-700">
              Click to upload images
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or JPEG (multiple allowed)
            </p>
          </label>

          <input
            id="product-images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            className="hidden"
          />

          {/* Preview */}
          {images.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-xl border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-pink-400 text-white py-3 rounded-xl
                     font-medium hover:bg-pink-500 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
