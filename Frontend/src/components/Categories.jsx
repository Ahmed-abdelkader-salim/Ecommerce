import { useState, useContext } from "react";
import { categories } from "../assets/data"; // ✅ categories بس
import { ShoppingBag } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart, products } = useContext(ShopContext); // ✅ products من context
  const navigate = useNavigate();

  const filteredProducts =
    selectedCategory === "All"
      ? products // ✅
      : products.filter((p) => p.category === selectedCategory); // ✅

  return (
    <section className="py-20 px-6 sm:px-10 bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-center mb-10 text-4xl font-extrabold text-white">
          تصفح المنتجات
        </h2>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-6 py-3 rounded-2xl font-semibold text-lg transition-all shadow-lg
              ${selectedCategory === "All"
                ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-cyan-400/50 scale-105"
                : "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20"
              }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-3 rounded-2xl font-semibold text-lg transition-all shadow-lg
                ${selectedCategory === cat.name
                  ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-cyan-400/50 scale-105"
                  : "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl hover:scale-105 hover:shadow-purple-300/50 transition-all duration-500"
            >
              {/* Image */}
              <div
                onClick={() => navigate(`/product/${product._id}`)}
                className="relative w-full h-56 flex items-center justify-center bg-linear-to-b from-purple-200 to-purple-50 cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain w-44 h-44 hover:scale-105 transition-transform duration-500"
                />
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-gray-900 font-semibold text-sm mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">${product.price}</p>
                    {product.oldPrice > 0 && (
                      <p className="text-xs text-gray-400 line-through">${product.oldPrice}</p>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="flex items-center gap-2 bg-linear-to-r from-cyan-400 to-blue-500
                    hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-xl
                    text-sm font-medium transition-all active:scale-95 shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    أضف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">لا توجد منتجات في هذه الفئة</p>
          </div>
        )}

      </div>
    </section>
  )
}

export default Categories