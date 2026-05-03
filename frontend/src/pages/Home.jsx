import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

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

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  /* ================= SEARCH + CATEGORY FILTER ================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    let filtered = products;

    if (searchQuery) {
      const value = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(value) ||
          p.category.toLowerCase().includes(value)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [location.search, products, selectedCategory]);

  return (
    <div className="bg-[#fffafb]">

      {/* ================= RESPONSIVE BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
  <div
    className="
      relative overflow-hidden rounded-3xl
      h-[160px]
      sm:h-[220px]
      md:h-[280px]
      lg:h-[320px]
    "
  >
    <img
      src="https://cdnss.caratlane.us/e1597c3d-5e7c-4b01-a191-bfcbe1827055/cdn.caratlane.us/media/mageplaza/bannerslider/banner/image/g/o/golden_month_.jpg"
      alt="Jewellery Banner"
      className="w-full h-full object-cover"
    />
  </div>
</section>

      {/* ================= CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-xl font-medium text-gray-800 mb-12 text-center">
          Shop by Category
        </h2>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full
              flex items-center justify-center
              text-xs sm:text-sm font-medium tracking-wide
              transition-all duration-300
              ${
                selectedCategory === cat
                  ? "bg-[#f9c5d1] text-white shadow-lg"
                  : "bg-[#fdecef] text-gray-700 hover:bg-[#f9c5d1] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <p className="text-center mt-10 text-gray-600">
            Showing results for{" "}
            <span className="font-semibold text-gray-800">
              {selectedCategory}
            </span>
          </p>
        )}
      </section>

      {/* ================= PRODUCTS GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-14">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  to={`/product/${product._id}`}
                  className="group block rounded-3xl bg-white
                             border border-[#fdecef]
                             overflow-hidden hover:shadow-2xl transition"
                >
                  {/* Image */}
                  <div className="overflow-hidden">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="
                          w-full
                          h-64 sm:h-72 md:h-80
                          object-cover
                          group-hover:scale-105
                          transition duration-500
                        "
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <h3 className="text-[18px] font-[500] tracking-[0.6px] text-gray-800">
                      {product.name}
                    </h3>

                    <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">
                      {product.category}
                    </p>

                    <p className="mt-4 text-lg font-semibold text-gray-900">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
