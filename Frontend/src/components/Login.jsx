import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser, url } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${url}/api/user/login`, {
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

  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">

        <h2 className="text-3xl font-extrabold text-white text-center mb-8">
          تسجيل الدخول
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-gray-300 text-sm mb-1 block">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="أدخل بريدك الإلكتروني"
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input type="checkbox" className="accent-cyan-400" />
              تذكرني
            </label>
            <button
              type="button"
              className="text-cyan-400 hover:text-cyan-300 transition-all"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-linear-to-r from-cyan-400 to-blue-500
            hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3.5
            rounded-2xl transition-all active:scale-95 shadow-lg text-lg
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>

          <p className="text-center text-gray-400 text-sm mt-2">
            ليس لديك حساب؟
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-cyan-400 hover:text-cyan-300 font-medium mr-1 transition-all"
            >
              إنشاء حساب
            </button>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;