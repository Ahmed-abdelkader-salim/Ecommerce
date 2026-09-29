import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url, clearCart, token } = useContext(ShopContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          `${url}/api/order/verify`,
          { orderId, success },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (res.data.success) {
          clearCart()
          setStatus("success")
        } else {
          setStatus("failed")
        }
      } catch (error) {
        console.log(error.message)
        setStatus("failed")
      }
    }

    if (orderId && token) {
      verifyPayment()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ orderId, success, token, url])

  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white px-6">
      <div className="text-center flex flex-col items-center gap-6">

        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-20 h-20 animate-spin text-cyan-400" />
            <p className="text-xl font-semibold mt-4 animate-pulse">
              جارٍ التحقق من الدفع...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10">
            <CheckCircle className="w-24 h-24 text-green-400" />
            <h2 className="text-3xl font-extrabold">تم الدفع بنجاح! 🎉</h2>
            <p className="text-gray-300">شكراً لطلبك، سيتم شحن منتجاتك قريباً.</p>
            {orderId && (
              <p className="text-sm text-gray-400">
                رقم الطلب:{" "}
                <span className="text-cyan-400 font-medium">{orderId}</span>
              </p>
            )}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => navigate("/myorders")}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-2xl transition-all active:scale-95"
              >
                طلباتي
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-2xl transition-all active:scale-95"
              >
                الرئيسية
              </button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10">
            <XCircle className="w-24 h-24 text-red-400" />
            <h2 className="text-3xl font-extrabold">فشل الدفع ❌</h2>
            <p className="text-gray-300">حدث خطأ، يرجى المحاولة مرة أخرى.</p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => navigate("/cart")}
                className="bg-linear-to-r from-cyan-400 to-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all active:scale-95"
              >
                العودة للسلة
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-2xl transition-all"
              >
                الرئيسية
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Verify;