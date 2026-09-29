import { useParams } from "react-router-dom";
import { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { ShoppingBag, Star } from "lucide-react";

const Product = () => {
  const { productId } = useParams();
  const { addToCart, products } = useContext(ShopContext);
  const product = products.find((p) => p._id === productId);

  const [selectedColor, setSelectedColor] = useState("Red");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900">
        <p className="text-2xl font-bold">😕 المنتج غير موجود</p>
      </section>
    );
  }

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    alert(`✅ تمت إضافة ${quantity} قطعة من ${product.name} إلى السلة!`);
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 py-24 px-6 sm:px-10 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 flex items-center justify-center min-h-96">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-sm object-contain drop-shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">

            {/* Category */}
            <span className="text-cyan-400 text-sm font-medium">{product.category}</span>

            {/* Name */}
            <h1 className="text-3xl font-extrabold text-white leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-gray-400 text-sm mr-2">(124 تقييم)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <p className="text-4xl font-extrabold text-white">${product.price}</p>
              {product.oldPrice && (
                <p className="text-xl text-gray-400 line-through">${product.oldPrice}</p>
              )}
              {product.discount && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">{product.description}</p>

            {/* Colors */}
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">
                اللون: <span className="text-white">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {["Red", "Blue", "Black", "White", "Green"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? "border-cyan-400 scale-110" : "border-white/20"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">
                المقاس: <span className="text-white">{selectedSize}</span>
              </p>
              <div className="flex gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selectedSize === size
                        ? "bg-linear-to-r from-cyan-400 to-blue-500 border-transparent text-white"
                        : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">الكمية</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-lg transition-all"
                >
                  −
                </button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-lg transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 bg-linear-to-r from-cyan-400 to-blue-500
              hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 rounded-2xl
              transition-all active:scale-95 shadow-lg text-lg mt-2"
            >
              <ShoppingBag className="w-6 h-6" />
              أضف إلى السلة
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;