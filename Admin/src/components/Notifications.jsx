import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Bell, Check, Trash2 } from "lucide-react"

// ====== عدّل الإعدادات دي حسب الـ router بتاعك ======
const API = import.meta.env.VITE_API_URL || "http://localhost:4000"
const ENDPOINTS = {
    list: "/api/notification/list", // GET
    read: (id) => `/api/notification/read/${id}`, // PUT
    remove: (id) => `/api/notification/delete/${id}`, // DELETE
    clear: "/api/notification/clear", // DELETE
}
const POLL_MS = 30000 // تحديث تلقائي كل 30 ثانية
// =====================================================

const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
})

const timeFmt = (d) =>
    d
        ? new Date(d).toLocaleString("ar-EG", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
        })
        : ""

const PAGE =
    "min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10"

const Notifications = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all") // all | unread

    useEffect(() => {
        let ignore = false

        const load = async () => {
            try {
                const res = await axios.get(API + ENDPOINTS.list, authConfig())
                if (!ignore) setNotifications(res.data?.data || [])
            } catch (err) {
                console.error("Fetch notifications error:", err)
            } finally {
                if (!ignore) setLoading(false)
            }
        }

        load()
        const timer = setInterval(load, POLL_MS)

        return () => {
            ignore = true
            clearInterval(timer)
        }
    }, [])

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications]
    )

    const visible = useMemo(
        () => (filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications),
        [notifications, filter]
    )

    const markAsRead = async (id) => {
        try {
            await axios.put(API + ENDPOINTS.read(id), {}, authConfig())
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            )
        } catch (err) {
            console.error("Mark as read error:", err)
            alert("حدث خطأ أثناء التحديث")
        }
    }

    const deleteNotification = async (id) => {
        try {
            await axios.delete(API + ENDPOINTS.remove(id), authConfig())
            setNotifications((prev) => prev.filter((n) => n._id !== id))
        } catch (err) {
            console.error("Delete notification error:", err)
            alert("فشل في الحذف")
        }
    }

    const clearAll = async () => {
        if (!window.confirm("متأكد إنك عايز تمسح كل الإشعارات؟")) return
        try {
            await axios.delete(API + ENDPOINTS.clear, authConfig())
            setNotifications([])
        } catch (err) {
            console.error("Clear notifications error:", err)
            alert("فشل مسح الإشعارات")
        }
    }

    return (
        <main className={PAGE} dir="rtl">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">الإشعارات</h1>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-bold text-gray-900">
                                {unreadCount} جديد
                            </span>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold transition-all hover:bg-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                            مسح الكل
                        </button>
                    )}
                </div>

                {/* Filter */}
                <div className="mb-5 flex gap-2 text-sm">
                    {[
                        { key: "all", label: "الكل" },
                        { key: "unread", label: "غير مقروء" },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`rounded-lg px-4 py-1.5 font-semibold transition-all ${filter === f.key
                                    ? "bg-indigo-500"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <p className="text-gray-300">جاري التحميل...</p>
                ) : visible.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-700 bg-gray-800 py-14 text-gray-400">
                        <Bell className="h-8 w-8" />
                        <p>{filter === "unread" ? "مفيش إشعارات جديدة." : "مفيش إشعارات لسه."}</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {visible.map((n) => (
                            <li
                                key={n._id}
                                className={`flex items-start gap-3 rounded-xl border p-4 ${n.isRead
                                        ? "border-gray-700 bg-gray-800/60 text-gray-300"
                                        : "border-indigo-500 bg-gray-800 text-white"
                                    }`}
                            >
                                <span
                                    className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${n.isRead ? "bg-gray-600" : "bg-yellow-400"
                                        }`}
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="break-words text-sm leading-relaxed">{n.message}</p>
                                    <p className="mt-1.5 text-xs text-gray-400">
                                        {n.user && n.user !== "UNKNOWN" ? `${n.user} · ` : ""}
                                        {timeFmt(n.createdAt)}
                                    </p>
                                </div>

                                <div className="flex shrink-0 gap-2">
                                    {!n.isRead && (
                                        <button
                                            onClick={() => markAsRead(n._id)}
                                            title="تحديد كمقروء"
                                            className="rounded-lg bg-indigo-500 p-2 transition-all hover:bg-indigo-600"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(n._id)}
                                        title="حذف"
                                        className="rounded-lg bg-red-500 p-2 transition-all hover:bg-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    )
}

export default Notifications