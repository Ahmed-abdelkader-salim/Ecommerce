import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    products,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const total = getTotalCartAmount();

  const cartProducts = Object.keys(cartItems)
    .map((id) => {
      const product = products.find((p) => p._id === id);
      if (!product) return null;
      return { ...product, quantity: cartItems[id] };
    })
    .filter(Boolean);

  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-950 text-white py-24 px-6 sm:px-10">

      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        <h2 className="text-4xl sm:text-5xl font-semibold mb-12 text-center">
          سلة التسوق
        </h2>

        {/* Empty Cart */}
        {cartProducts.length === 0 ? (
          <div className="text-center text-gray-300 mt-20 space-y-6">
            <ShoppingBag className="mx-auto w-20 h-20 text-gray-400" />
            <p className="text-xl">السلة فارغة الآن 🛒</p>
            <button
              onClick={() => navigate("/")}
              className="bg-linear-to-r from-cyan-500 to-blue-500 px-8 py-3 rounded-2xl text-white hover:opacity-90 transition-all"
            >
              ابدأ التسوق الآن
            </button>
          </div>
        ) : (
          <>
            {/* Cart Products */}
            <div className="space-y-4 mb-12">
              {cartProducts.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-lg"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-xl bg-white/5"
                  />

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-right">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-cyan-400 font-medium">
                      ${item.price}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      الإجمالي:{" "}
                      <span className="text-white font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500 transition-all flex items-center justify-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-lg font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item._id)}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-500 transition-all flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item._id, true)}
                    className="p-2.5 rounded-full bg-red-500/20 hover:bg-red-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Continue Shopping */}
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-semibold mb-4">هل تريد إضافة المزيد؟</h3>
                <p className="text-gray-300 mb-6">
                  تصفح منتجاتنا وأضف المزيد من المنتجات إلى سلة التسوق.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all border border-white/20"
                >
                  متابعة التسوق
                </button>
              </div>

              {/* Total */}
              <div className="w-full lg:w-96 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-semibold mb-6">ملخص الطلب</h3>

                <div className="flex justify-between text-gray-300 mb-3">
                  <span>عدد المنتجات</span>
                  <span>{cartProducts.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </div>

                <div className="flex justify-between text-gray-300 mb-3">
                  <span>المجموع الفرعي</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-300 mb-3">
                  <span>رسوم الشحن</span>
                  <span className="text-cyan-400">$2.00</span>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                  <span>الإجمالي</span>
                  <span>${(total + 2).toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate("/order")}
                  className="w-full mt-6 bg-linear-to-r from-cyan-500 to-blue-500
                  hover:from-cyan-600 hover:to-blue-600 px-6 py-4 rounded-xl
                  font-semibold transition-all active:scale-95"
                >
                  إتمام الطلب 💳
                </button>
              </div>

            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;