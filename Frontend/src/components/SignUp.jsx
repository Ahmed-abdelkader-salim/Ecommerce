import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const { setToken, setUser, url } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("❌ كلمة المرور غير متطابقة");
      return;
    }

    if (formData.password.length < 8) {
      setError("❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${url}/api/user/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        navigate("/");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-all";

  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 py-24 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">

        <h2 className="text-3xl font-extrabold text-white text-center mb-8">
          إنشاء حساب جديد
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-gray-300 text-sm mb-1 block">الاسم الكامل</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسمك"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="أدخل بريدك الإلكتروني"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8 أحرف على الأقل"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">تأكيد كلمة المرور</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="أعد كتابة كلمة المرور"
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-linear-to-r from-cyan-400 to-blue-500
            hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3.5
            rounded-2xl transition-all active:scale-95 shadow-lg text-lg
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
          </button>

          <p className="text-center text-gray-400 text-sm mt-2">
            لديك حساب بالفعل؟
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-cyan-400 hover:text-cyan-300 font-medium mr-1 transition-all"
            >
              تسجيل الدخول
            </button>
          </p>

        </form>
      </div>
    </div>
  );
};

export default SignUp;