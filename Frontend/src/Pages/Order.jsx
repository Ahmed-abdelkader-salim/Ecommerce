import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import axios from "axios";

const Order = () => {
  const { cartItems, products, getTotalCartAmount, token, url } = useContext(ShopContext);
  const navigate = useNavigate();
  const total = getTotalCartAmount();
  const [loading, setLoading] = useState(false);

  const cartProducts = Object.keys(cartItems)
    .map((id) => {
      const product = products.find((p) => p._id === id);
      return product ? { ...product, quantity: cartItems[id] } : null;
    })
    .filter(Boolean);

  const [shipping, setShipping] = useState({
    name: "",
    street: "",
    city: "",
    phone: "",
  });

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    if (!shipping.name || !shipping.street || !shipping.city || !shipping.phone) {
      alert("🚚 يرجى ملء جميع بيانات الشحن");
      return;
    }

    if (!token) {
      alert("يرجى تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartProducts.map((p) => ({
          _id: p._id,
          name: p.name,
          image: p.image,
          price: p.price,
          quantity: p.quantity,
          category: p.category,
        })),
        address: shipping,
        amount: total,
      };

      const res = await axios.post(
        `${url}/api/order/place`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Stripe redirect
        window.location.replace(res.data.session_url);
      } else {
        alert("❌ حدث خطأ أثناء تقديم الطلب");
      }
    } catch (error) {
      console.log(error.message);
      alert("❌ حدث خطأ أثناء تقديم الطلب");
    } finally {
      setLoading(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-gray-300 space-y-6">
          <ShoppingBag className="mx-auto w-20 h-20 text-gray-400" />
          <p className="text-2xl font-semibold text-white">السلة فارغة الآن 🛒</p>
          <p className="text-gray-400">لا يمكن إتمام الطلب بدون منتجات</p>
          <button
            onClick={() => navigate("/")}
            className="bg-linear-to-r from-cyan-500 to-blue-500 px-8 py-3 rounded-2xl text-white font-semibold hover:opacity-90 transition-all"
          >
            العودة للتسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <section dir="rtl" className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 py-20 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-extrabold text-white mb-10 text-center">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Shipping Form */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">بيانات الشحن</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: 'الاسم الكامل', name: 'name', type: 'text', placeholder: 'أدخل اسمك' },
                { label: 'العنوان', name: 'street', type: 'text', placeholder: 'أدخل عنوانك' },
                { label: 'المدينة', name: 'city', type: 'text', placeholder: 'أدخل مدينتك' },
                { label: 'رقم الهاتف', name: 'phone', type: 'tel', placeholder: '010XXXXXXXXX' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="text-gray-300 text-sm mb-1 block">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={shipping[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-6">ملخص الطلب</h2>

            {/* Products */}
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto max-h-72 pl-1">
              {cartProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-4 bg-white/5 rounded-2xl p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-contain rounded-xl bg-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{product.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">الكمية: {product.quantity}</p>
                  </div>
                  <p className="text-cyan-400 font-bold text-sm shrink-0">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-white/10 mt-6 pt-6 flex flex-col gap-3">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>المجموع الفرعي</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300 text-sm">
                <span>رسوم الشحن</span>
                <span className="text-cyan-400">$2.00</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg border-t border-white/10 pt-3">
                <span>الإجمالي</span>
                <span>${(total + 2).toFixed(2)}</span>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="mt-4 w-full bg-linear-to-r from-cyan-400 to-blue-500
                hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3.5 rounded-2xl
                transition-all active:scale-95 shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جارٍ التحويل لـ Stripe...' : 'تأكيد الطلب والدفع 💳'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Order;