import { ShoppingCart } from 'lucide-react';
import heroImage from '../assets/bg.png';
const Hero = () => {
  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white flex items-center">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 flex flex-col-reverse md:flex-row items-center justify-between gap-16 w-full">
        
        {/* Text */}
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            
            تسوق الآن
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-pink-400">
              بأفضل الأسعار
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-xl leading-relaxed">
            اكتشف أحدث المنتجات والعروض الحصرية —{" "}
            خصومات تصل حتى 50% لفترة محدودة{" "}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => window.location.href = '/shop'}
              className="flex items-center gap-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl transition-transform hover:scale-105"
            >
              <ShoppingCart className="w-6 h-6" />
              تسوق الآن
            </button>
            <button
              onClick={() => window.location.href = '/categories'}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl transition-transform hover:scale-105"
            >
              تصفح الفئات
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative w-full max-w-lg">
          <img
            src={heroImage}
            alt="hero"
            className="h-full w-full object-cover rounded-3xl shadow-2xl"
          />
         <div className="absolute top-6 left-6 bg-red-500 text-white px-5 py-3 rounded-full font-bold shadow-lg animate-pulse text-lg">
            خصم 50% لفترة محدودة
          </div>
        </div>
      </div>


      {/* Wave Bottom */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-32"
        >
          <path
            d="M0,0V46.29c47.19,22,103.23,29,158.5,17.33C251,48.21,317.2,8.22,384,1.13c60.86-6.46,118.91,12.08,176,31.49,59.45,20.15,118.85,39.69,179,25.36,62.47-14.92,123-50.71,185-65.92C997,16,1061,23,1120,38.09c61.63,15.83,119.72,37.38,180,51.4V0Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  )
}

export default Hero