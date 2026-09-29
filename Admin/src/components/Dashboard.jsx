import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

// ====== عدّل الإعدادات دي حسب الباك إند بتاعك ======
const API = import.meta.env.VITE_API_URL || "http://localhost:4000"
const ENDPOINTS = {
  orders: "/api/order/list",
  products: "/api/product/list",
  // users: "/api/users",
}
// الحقول المتوقعة في الأوردر: totalPrice, status, createdAt, user.name
const LOW_STOCK_LIMIT = 5
// =====================================================

const STATUS = {
  pending: { label: "قيد المراجعة", color: "#c98a1b" },
  processing: { label: "قيد التجهيز", color: "#2f6fb0" },
  shipped: { label: "تم الشحن", color: "#5b4fb0" },
  delivered: { label: "تم التسليم", color: "#2e8b6a" },
  cancelled: { label: "ملغي", color: "#b04a4a" },
}

const toArray = (d) =>
  Array.isArray(d) ? d : d?.orders || d?.products || d?.users || d?.data || []

const money = (n) =>
  new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(n || 0) + " ج.م"

const dateFmt = (d) =>
  d ? new Date(d).toLocaleDateString("ar-EG", { day: "numeric", month: "short" }) : "-"

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

    const get = async (path) => {
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

    Promise.all([get(ENDPOINTS.orders), get(ENDPOINTS.products)])
      .then(([orders, products]) => setData({ orders, products }))
      .catch((e) => e.message !== "unauthorized" && setError("تعذر تحميل البيانات. تأكد إن السيرفر شغال والمسارات صحيحة."))
      .finally(() => setLoading(false))
  }, [navigate])

  const stats = useMemo(() => {
    const { orders, products } = data
    const active = orders.filter((o) => o.status !== "cancelled")
    const revenue = active.reduce((s, o) => s + (o.totalPrice || 0), 0)
    const byStatus = Object.keys(STATUS).map((k) => ({
      key: k,
      count: orders.filter((o) => o.status === k).length,
    }))
    const lowStock = products
      .filter((p) => typeof p.stock === "number" && p.stock <= LOW_STOCK_LIMIT)
      .sort((a, b) => a.stock - b.stock)
    const recent = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
    return { revenue, byStatus, lowStock, recent, total: orders.length }
  }, [data])

  if (loading) return <main className="dash"><Styles /><p className="muted">جارٍ التحميل...</p></main>
  if (error) return <main className="dash"><Styles /><p className="err">{error}</p></main>

  return (
    <main className="dash">
      <Styles />

      <header className="hero">
        <p className="muted">إجمالي المبيعات (بدون الأوردرات الملغية)</p>
        <h1>{money(stats.revenue)}</h1>
        {/* <p className="muted">
          من {stats.total} أوردر · {data.products.length} منتج · {data.users.length} عميل
        </p> */}
      </header>

      <section>
        <h2>حالة الأوردرات</h2>
        {stats.total === 0 ? (
          <p className="muted">لا توجد أوردرات بعد.</p>
        ) : (
          <>
            <div className="bar" role="img" aria-label="توزيع حالات الأوردرات">
              {stats.byStatus.map(
                (s) =>
                  s.count > 0 && (
                    <span
                      key={s.key}
                      style={{ flex: s.count, background: STATUS[s.key].color }}
                      title={`${STATUS[s.key].label}: ${s.count}`}
                    />
                  )
              )}
            </div>
            <ul className="legend">
              {stats.byStatus.map((s) => (
                <li key={s.key}>
                  <i style={{ background: STATUS[s.key].color }} />
                  {STATUS[s.key].label} <b>{s.count}</b>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <div className="cols">
        <section>
          <h2>آخر الأوردرات</h2>
          {stats.recent.length === 0 ? (
            <p className="muted">لا توجد أوردرات بعد.</p>
          ) : (
            <table>
              <thead>
                <tr><th>العميل</th><th>التاريخ</th><th>الحالة</th><th>الإجمالي</th></tr>
              </thead>
              <tbody>
                {stats.recent.map((o) => (
                  <tr key={o._id}>
                    <td>{o.user?.name || "-"}</td>
                    <td>{dateFmt(o.createdAt)}</td>
                    <td>
                      <i className="dot" style={{ background: STATUS[o.status]?.color || "#999" }} />
                      {STATUS[o.status]?.label || o.status}
                    </td>
                    <td>{money(o.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2>منتجات مخزونها قليل</h2>
          {stats.lowStock.length === 0 ? (
            <p className="muted">كل المنتجات مخزونها كافي.</p>
          ) : (
            <ul className="stock">
              {stats.lowStock.slice(0, 8).map((p) => (
                <li key={p._id}>
                  <span>{p.name}</span>
                  <b className={p.stock === 0 ? "out" : ""}>{p.stock === 0 ? "نفد" : `${p.stock} متبقي`}</b>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

const Styles = () => (
  <style>{`
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap");
    .dash { --ink:#1d2a33; --mute:#6b7780; --line:#dfe5e9; --bg:#f6f8f9;
      font-family:"IBM Plex Sans Arabic",system-ui,sans-serif; color:var(--ink);
      background:var(--bg); min-height:100vh; padding:32px clamp(16px,4vw,48px); direction:rtl; }
    .dash h1 { font-size:clamp(2.2rem,6vw,3.6rem); font-weight:700; margin:4px 0 8px; letter-spacing:-0.01em; }
    .dash h2 { font-size:1.05rem; font-weight:700; margin:0 0 14px; }
    .dash section { margin-top:40px; }
    .dash .muted { color:var(--mute); margin:0; }
    .dash .err { color:#b04a4a; }
    .dash .hero { padding-bottom:8px; }
    .dash .bar { display:flex; height:14px; gap:2px; border-radius:3px; overflow:hidden; }
    .dash .legend { display:flex; flex-wrap:wrap; gap:6px 22px; list-style:none; padding:0; margin:14px 0 0; }
    .dash .legend li { display:flex; align-items:center; gap:6px; font-size:.92rem; }
    .dash .legend i, .dash .dot { width:9px; height:9px; border-radius:50%; display:inline-block; }
    .dash .dot { margin-inline-end:8px; }
    .dash .cols { display:grid; grid-template-columns:minmax(0,3fr) minmax(0,2fr); gap:0 48px; }
    .dash table { width:100%; border-collapse:collapse; font-size:.93rem; }
    .dash th { text-align:start; color:var(--mute); font-weight:500; padding:0 0 10px; border-bottom:1px solid var(--line); }
    .dash td { padding:12px 0; border-bottom:1px solid var(--line); }
    .dash .stock { list-style:none; padding:0; margin:0; }
    .dash .stock li { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--line); font-size:.93rem; }
    .dash .stock b { color:#c98a1b; font-weight:500; }
    .dash .stock b.out { color:#b04a4a; font-weight:700; }
    @media (max-width:820px) { .dash .cols { grid-template-columns:1fr; } }
  `}</style>
)

export default Dashboard