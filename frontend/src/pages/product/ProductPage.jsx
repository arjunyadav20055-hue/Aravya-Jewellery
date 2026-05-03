import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);

  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`); // ✅ fetch single product by ID
        const prod = res.data;
        if (!prod) {
          toast.error("Product not found");
          return;
        }
        setProduct(prod);
        setSelectedImage(prod.images?.[0]);
        setReviews(prod.reviews || []);
      } catch {
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  /* ================= WISHLIST ================= */
  useEffect(() => {
    if (!user) return;
    const checkWishlist = async () => {
      try {
        const res = await api.get("/wishlist", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setInWishlist(res.data.some((item) => item._id === id));
      } catch {}
    };
    checkWishlist();
  }, [id, user]);

  if (!product) return <p className="p-6">Loading...</p>;

  const handleWishlist = async () => {
    if (!user) return toast.error("Please login");

    try {
      if (inWishlist) {
        await api.delete(`/wishlist/remove/${product._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setInWishlist(false);
      } else {
        await api.post(
          `/wishlist/add/${product._id}`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setInWishlist(true);
      }
    } catch {
      toast.error("Wishlist failed");
    }
  };

  const handleAddToCart = async () => {
    if (!user) return toast.error("Please login");

    try {
      await api.post(
        `/cart/add/${product._id}`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Added to cart");
    } catch {
      toast.error("Add to cart failed");
    }
  };

  /* ================= REVIEW ================= */
  const handleReviewSubmit = async () => {
    if (!user) return toast.error("Login to write a review");
    if (!review.trim()) return;

    try {
      const res = await api.post(
        `/products/${product._id}/review`,
        { comment: review },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setReviews((prev) => [res.data, ...prev]);
      setReview("");
      toast.success("Review added");
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="bg-pink-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* ================= PRODUCT ================= */}
        <div className="bg-white rounded-3xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* IMAGES */}
          <div>
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[420px] object-cover rounded-2xl"
            />

            <div className="flex gap-3 mt-4">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl object-cover cursor-pointer border
                    ${
                      selectedImage === img
                        ? "border-pink-400"
                        : "border-gray-200"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {product.name}
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                {product.category}
              </p>

              <p className="text-2xl font-bold text-pink-500 mt-4">
                ₹{product.price}
              </p>

              <p className="text-gray-600 mt-6 leading-relaxed">
                {product.description}
              </p>

              <div className="text-sm text-gray-600 mt-6 space-y-1">
                <p>Stock Available: {product.stock}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                className="bg-pink-400 text-white py-3 rounded-xl
                           font-medium hover:bg-pink-500 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                className={`py-3 rounded-xl font-medium transition
                  ${
                    inWishlist
                      ? "bg-red-400 text-white"
                      : "bg-pink-100 text-pink-700"
                  }`}
              >
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* ================= REVIEWS ================= */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Customer Reviews
          </h2>

          {/* Write Review */}
          <div className="bg-white rounded-2xl p-6 mb-8">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full border border-gray-300 rounded-xl p-4
                         focus:outline-none focus:ring-2 focus:ring-pink-300"
              rows="3"
            />

            <button
              onClick={handleReviewSubmit}
              className="mt-4 bg-pink-400 text-white px-6 py-2 rounded-xl
                         hover:bg-pink-500 transition"
            >
              Submit Review
            </button>
          </div>

          {/* Review List */}
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-xl p-4">
                  <p className="text-sm text-gray-700">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {r.user?.name || "User"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
