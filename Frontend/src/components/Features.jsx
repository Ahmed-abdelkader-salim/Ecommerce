import { Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

const featuresData = [
  {
    Icon: Truck,
    title: "شحن مجاني",
    desc: "على جميع الطلبات فوق $100 في جميع أنحاء العالم.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    Icon: ShieldCheck,
    title: "ضمان المنتجات",
    desc: "استبدال أو استرجاع مجاني خلال 14 يوم.",
    color: "from-green-400 to-emerald-500",
  },
  {
    Icon: RefreshCcw,
    title: "إرجاع سهل",
    desc: "إجراءات بسيطة وسريعة خلال دقائق.",
    color: "from-purple-500 to-pink-500",
  },
  {
    Icon: Headphones,
    title: "دعم 24/7",
    desc: "فريقنا جاهز لمساعدتك في أي وقت.",
    color: "from-yellow-400 to-orange-500",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-6 sm:px-10 bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-white">لماذا تختارنا؟</h2>
          <p className="text-gray-400 mt-3 text-lg">نقدم لك تجربة تسوق لا مثيل لها</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map(({ Icon, title, desc, color }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-5 p-8 rounded-3xl
              bg-white/10 backdrop-blur-md border border-white/10
              hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div className={`p-4 rounded-2xl bg-linear-to-br ${color} shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Features