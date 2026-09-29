import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`شكراً لتواصلك معنا، ${formData.name}!`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-indigo-900 via-purple-800 to-pink-900">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-20">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-extrabold text-white">NeoShop</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              متجرك الإلكتروني المفضل للحصول على أفضل المنتجات بأقل الأسعار.
            </p>
            <div className="flex gap-3 mt-2">
              {["f", "t", "in"].map((s) => (
                <div key={s} className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs cursor-pointer hover:bg-white/20 transition-all">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="flex flex-col gap-2">
              {["الرئيسية", "المنتجات", "العروض", "تواصل معنا"].map((link) => (
                <li key={link} className="text-gray-300 text-sm hover:text-white cursor-pointer transition-all">
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">تواصل معنا</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <Mail className="w-4 h-4 text-cyan-400" />
                info@neoshop.com
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <Phone className="w-4 h-4 text-cyan-400" />
                +20 100 000 0000
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400" />
                القاهرة، مصر
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">أرسل رسالة</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="اسمك"
                required
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-all"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="بريدك الإلكتروني"
                required
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-all"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="رسالتك"
                rows={3}
                required
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-all resize-none"
              />
              <button
                type="submit"
                className="bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-medium py-2.5 rounded-xl transition-all active:scale-95"
              >
                إرسال
              </button>
            </form>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 NeoShop. جميع الحقوق محفوظة.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Footer;