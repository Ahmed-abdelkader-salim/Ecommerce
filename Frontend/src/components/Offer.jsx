import { useState, useEffect, useContext } from "react";
import { all_products } from "../assets/data";
import { ShoppingBag } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 min-w-17.5">
    <span className="text-3xl font-extrabold text-white">
      {String(value ?? 0).padStart(2, "0")}
    </span>
    <span className="text-xs text-gray-300 mt-1">{label}</span>
  </div>
);
const Offer = () => {
  const { addToCart } = useContext(ShopContext);
  const [timeLeft, setTimeLeft] = useState({});
  const [products] = useState(all_products.slice(0, 12)); // أول 12 منتج كمثال


  // عداد تنازلي لتعرض التخفيضات
  useEffect(() => {
    const stored = localStorage.getItem("offerEndDate");
    
    let targetDate;
    if (stored) {
        // لو موجود خد منه
        targetDate = new Date(stored);
    } else {
        // لو مش موجود اعمل واحد جديد واحفظه
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 5);
        localStorage.setItem("offerEndDate", targetDate.toISOString());
    }

    const interval = setInterval(() => {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(interval);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
}, []);

 
  return (
    <section className="py-20 px-6 sm:px-10 bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 animate-pulse">
            🔥 عروض محدودة الوقت
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            العروض الحصرية
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            انتهز الفرصة قبل انتهاء العرض
          </p>

          {/* Countdown */}
          <div className="flex justify-center items-center gap-3">
            <TimeBox value={timeLeft.days} label="يوم" />
            <span className="text-white text-2xl font-bold">:</span>
            <TimeBox value={timeLeft.hours} label="ساعة" />
            <span className="text-white text-2xl font-bold">:</span>
            <TimeBox value={timeLeft.minutes} label="دقيقة" />
            <span className="text-white text-2xl font-bold">:</span>
            <TimeBox value={timeLeft.seconds} label="ثانية" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl
              overflow-hidden hover:scale-105 hover:shadow-cyan-400/30 hover:shadow-2xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative w-full h-56 flex items-center justify-center bg-linear-to-b from-purple-800/40 to-transparent">
                <img
                  src={product.image}
                  className="object-contain w-44 h-44 transition-transform duration-500 hover:scale-105"
                />
                {product.discount && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-white font-semibold text-sm mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-white">${product.price}</p>
                    {product.oldPrice && (
                      <p className="text-xs text-gray-400 line-through">${product.oldPrice}</p>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="flex items-center gap-2 bg-linear-to-r from-cyan-400 to-blue-500
                    hover:from-cyan-500 hover:to-blue-600 text-white px-3 py-2 rounded-xl
                    text-xs font-medium transition-all active:scale-95 shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    أضف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Offer;