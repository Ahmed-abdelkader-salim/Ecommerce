import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

// ====== عدّل الإعدادات دي حسب الباك إند بتاعك ======
const API = import.meta.env.VITE_API_URL || "http://localhost:4000"
const ENDPOINTS = {
  orders: "/api/order/list",
  products: "/api/product/list",
  users: "/api/user/list",
}
// حقول الأوردر عندك: amount, orderStatus, createdAt, userId (populated), paymentMethod, payment
const CURRENCY = "USD" // Stripe عندك بيخصم بالدولار. غيّرها لـ "EGP" لو عايز جنيه
const LOW_STOCK_LIMIT = 5
const PAYMENTS_ROWS = 8
// =====================================================

const STATUS = {
  pending: { label: "قيد المراجعة", color: "#c98a1b" },
  processing: { label: "قيد التجهيز", color: "#2f6fb0" },
  shipped: { label: "تم الشحن", color: "#7b6fe0" },
  delivered: { label: "تم التسليم", color: "#2e8b6a" },
  cancelled: { label: "ملغي", color: "#d05a5a" },
}

const PAY_STATUS = {
  paid: { label: "مدفوع", color: "#4ade80" },
  unpaid: { label: "غير مدفوع", color: "#facc15" },
  cancelled: { label: "ملغي", color: "#f87171" },
}

const PAYMENT_METHODS = {
  cod: "الدفع عند الاستلام",
  card: "بطاقة",
  stripe: "Stripe",
  paypal: "PayPal",
  vodafone: "فودافون كاش",
  instapay: "إنستا باي",
}

const toArray = (d) =>
  Array.isArray(d) ? d : d?.orders || d?.products || d?.users || d?.data || []

const num = (n) => new Intl.NumberFormat("ar-EG").format(n || 0)

const FALLBACK_COLORS = ["#2f6fb0", "#7b6fe0", "#2e8b6a", "#c98a1b", "#8a6f5b", "#607d8b"]

const money = (n) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n || 0)

const dateFmt = (d) =>
  d ? new Date(d).toLocaleDateString("ar-EG", { day: "numeric", month: "short" }) : "-"

// ===== helpers مربوطة بشكل الأوردر في الباك إند =====
const amountOf = (o) => Number(o.amount ?? o.totalPrice ?? 0)

const statusOf = (o) => {
  const raw = String(o.orderStatus ?? o.status ?? "").trim()
  return STATUS[raw.toLowerCase()] ? raw.toLowerCase() : raw
}

const isCancelled = (o) =>
  ["cancelled", "canceled", "ملغي"].includes(statusOf(o).toLowerCase())

// userId بيجي populated من listOrders: { name, email, phone }
const customerOf = (o) => o.userId?.name || o.user?.name || "-"

// بيطلّع بيانات الدفع من الأوردر بشكل مرن حسب شكل الداتا عندك
const getPayment = (o) => {
  const raw = o.paymentMethod ?? o.payment?.method ?? ""
  const method = PAYMENT_METHODS[String(raw).toLowerCase()] || raw || "-"

  let paid = false
  if (typeof o.isPaid === "boolean") paid = o.isPaid
  else if (typeof o.payment === "boolean") paid = o.payment
  else if (o.paymentStatus)
    paid = ["paid", "succeeded", "completed"].includes(String(o.paymentStatus).toLowerCase())

  const status = isCancelled(o) ? "cancelled" : paid ? "paid" : "unpaid"
  return { method, status }
}

// ===== Tailwind classes مشتركة =====
const PAGE =
  "min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10"
// const CARD = "rounded-xl border border-gray-700 bg-gray-800"
const TH = "pb-3 text-start font-medium text-gray-400 border-b border-white/10"
const TD = "py-3 pe-4 border-b border-white/10"

const Dashboard = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({ orders: [], products: [], users: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token || token === "null" || token === "undefined") {
      navigate("/admin/login", { replace: true })
      return
    }

    const request = async (path) => {
      const res = await fetch(API + path, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        localStorage.removeItem("adminToken")
        navigate("/admin/login", { replace: true })
        throw new Error("unauthorized")
      }
      if (!res.ok) throw new Error(path)
      return toArray(await res.json())
    }

    // optional: لو فشل ميوقفش الداشبورد كلها (بيرجع null)
    const get = async (path, optional = false) => {
      try {
        return await request(path)
      } catch (e) {
        if (optional && e.message !== "unauthorized") return null
        throw e
      }
    }

    Promise.all([get(ENDPOINTS.orders), get(ENDPOINTS.products), get(ENDPOINTS.users, true)])
      .then(([orders, products, users]) => setData({ orders, products, users }))
      .catch(
        (e) =>
          e.message !== "unauthorized" &&
          setError("تعذر تحميل البيانات. تأكد إن السيرفر شغال والمسارات صحيحة.")
      )
      .finally(() => setLoading(false))
  }, [navigate])

  const stats = useMemo(() => {
    const { orders, products } = data
    const active = orders.filter((o) => !isCancelled(o))
    const revenue = active.reduce((s, o) => s + amountOf(o), 0)
    const collected = active
      .filter((o) => getPayment(o).status === "paid")
      .reduce((s, o) => s + amountOf(o), 0)

    // بنجمّع حسب القيم الفعلية الموجودة في الداتا، فيشتغل مهما كانت أسماء الحالات
    const counts = {}
    orders.forEach((o) => {
      const k = statusOf(o) || "unknown"
      counts[k] = (counts[k] || 0) + 1
    })
    const known = Object.keys(STATUS).filter((k) => counts[k])
    const others = Object.keys(counts).filter((k) => !STATUS[k])
    const byStatus = [...known, ...others].map((k, i) => ({
      key: k,
      count: counts[k],
      label: STATUS[k]?.label || (k === "unknown" ? "غير محدد" : k),
      color: STATUS[k]?.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    }))

    // المنتج عندك فيه inStock (true/false) مش رقم stock
    const lowStock = products.filter(
      (p) => p.inStock === false || (typeof p.stock === "number" && p.stock <= LOW_STOCK_LIMIT)
    )

    const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return {
      revenue,
      collected,
      pending: revenue - collected,
      byStatus,
      lowStock,
      recent: sorted.slice(0, 6),
      payments: sorted.slice(0, PAYMENTS_ROWS),
      total: orders.length,
    }
  }, [data])

  if (loading)
    return (
      <main className={PAGE} dir="rtl">
        <p className="text-gray-300">جارٍ التحميل...</p>
      </main>
    )

  if (error)
    return (
      <main className={PAGE} dir="rtl">
        <p className="text-red-300">{error}</p>
      </main>
    )

  const cards = [
    { label: "إجمالي المبيعات", value: money(stats.revenue), note: "بدون الأوردرات الملغية", accent: true },
    { label: "إجمالي الأوردرات", value: num(stats.total) },
    { label: "إجمالي المنتجات", value: num(data.products.length) },
    { label: "إجمالي العملاء", value: data.users === null ? "-" : num(data.users.length) },
  ]

  return (
    <main className={PAGE} dir="rtl">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">لوحة التحكم</h1>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className={`rounded-xl border p-4 ${
                c.accent ? "border-indigo-500 bg-indigo-600" : "border-gray-700 bg-gray-800"
              }`}
            >
              <p className={`text-sm ${c.accent ? "text-indigo-100" : "text-gray-400"}`}>{c.label}</p>
              <p className="mt-1.5 text-2xl font-bold">{c.value}</p>
              {c.note && <p className="mt-1 text-xs text-indigo-100">{c.note}</p>}
            </div>
          ))}
        </div>

        {/* Order status */}
        <section className="mt-10">
          <h2 className="mb-3.5 text-lg font-bold">حالة الأوردرات</h2>
          {stats.total === 0 ? (
            <p className="text-gray-300">لا توجد أوردرات بعد.</p>
          ) : (
            <>
              <div className="flex h-3.5 gap-0.5 overflow-hidden rounded" role="img" aria-label="توزيع حالات الأوردرات">
                {stats.byStatus.map((s) => (
                  <span
                    key={s.key}
                    style={{ flex: s.count, background: s.color }}
                    title={`${s.label}: ${s.count}`}
                  />
                ))}
              </div>
              <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                {stats.byStatus.map((s) => (
                  <li key={s.key} className="flex items-center gap-1.5">
                    <i className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.label} <b>{s.count}</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Recent orders + out of stock */}
        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <section className="lg:col-span-3">
            <h2 className="mb-3.5 text-lg font-bold">آخر الأوردرات</h2>
            {stats.recent.length === 0 ? (
              <p className="text-gray-300">لا توجد أوردرات بعد.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-sm">
                  <thead>
                    <tr>
                      <th className={TH}>العميل</th>
                      <th className={TH}>التاريخ</th>
                      <th className={TH}>الحالة</th>
                      <th className={TH}>الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent.map((o) => (
                      <tr key={o._id}>
                        <td className={TD}>{customerOf(o)}</td>
                        <td className={TD}>{dateFmt(o.createdAt)}</td>
                        <td className={TD}>
                          <i
                            className="me-2 inline-block h-2 w-2 rounded-full"
                            style={{ background: STATUS[statusOf(o)]?.color || "#999" }}
                          />
                          {STATUS[statusOf(o)]?.label || statusOf(o) || "-"}
                        </td>
                        <td className={TD}>{money(amountOf(o))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="lg:col-span-2">
            <h2 className="mb-3.5 text-lg font-bold">منتجات غير متوفرة</h2>
            {stats.lowStock.length === 0 ? (
              <p className="text-gray-300">كل المنتجات متوفرة.</p>
            ) : (
              <ul>
                {stats.lowStock.slice(0, 8).map((p) => {
                  const out = p.inStock === false || p.stock === 0
                  return (
                    <li key={p._id} className="flex justify-between border-b border-white/10 py-3 text-sm">
                      <span>{p.name}</span>
                      <b className={out ? "font-bold text-red-400" : "font-medium text-yellow-400"}>
                        {out ? "نفد" : `${p.stock} متبقي`}
                      </b>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Payments */}
        <section className="mt-10">
          <h2 className="mb-3.5 text-lg font-bold">المدفوعات</h2>
          {stats.total === 0 ? (
            <p className="text-gray-300">لا توجد مدفوعات بعد.</p>
          ) : (
            <>
              <p className="mb-3.5 text-sm text-gray-300">
                تم تحصيل <b className="text-white">{money(stats.collected)}</b> · لم يُحصَّل بعد{" "}
                <b className="text-white">{money(stats.pending)}</b>
              </p>
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-sm">
                  <thead>
                    <tr>
                      <th className={TH}>رقم الأوردر</th>
                      <th className={TH}>العميل</th>
                      <th className={TH}>التاريخ</th>
                      <th className={TH}>طريقة الدفع</th>
                      <th className={TH}>حالة الدفع</th>
                      <th className={TH}>المبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.payments.map((o) => {
                      const pay = getPayment(o)
                      const ps = PAY_STATUS[pay.status]
                      return (
                        <tr key={o._id}>
                          <td className={`${TD} tabular-nums text-gray-400`}>#{String(o._id).slice(-6)}</td>
                          <td className={TD}>{customerOf(o)}</td>
                          <td className={TD}>{dateFmt(o.createdAt)}</td>
                          <td className={TD}>{pay.method}</td>
                          <td className={TD}>
                            <span
                              className="inline-block rounded-full border px-2.5 py-0.5 text-xs"
                              style={{ color: ps.color, borderColor: ps.color }}
                            >
                              {ps.label}
                            </span>
                          </td>
                          <td className={TD}>{money(amountOf(o))}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default Dashboard