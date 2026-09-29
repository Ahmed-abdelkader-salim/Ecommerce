import { useState } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { PlusCircle, List,Shield, ClipboardCheck, Menu, X, LogOut, LayoutDashboard } from "lucide-react"

const Sidebar = () => {
    const [open, setIsOpen] = useState(true)
    const navigate = useNavigate()

    const menuItems = [
        { to: "/admin/dashboard", label: 'الرئيسية', Icon: LayoutDashboard },
        { to: "/admin/add", label: 'إضافة منتج', Icon: PlusCircle },
        { to: "/admin/list", label: 'قائمة المنتجات', Icon: List },
        { to: '/admin/orders', label: 'طلبات العملاء', Icon: ClipboardCheck },
        { to: '/admin/users', label: 'إدارة المستخدمين', Icon: Shield },
    ]

    const handleLogout = () => {
        localStorage.removeItem("adminToken")
        navigate("/admin/login")
    }

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!open)}
                className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 p-3 rounded-xl text-white shadow-lg hover:scale-105 transition-transform focus:outline-none"
            >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay mobile */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-linear-to-b from-indigo-900 via-purple-900 to-pink-950
            text-white flex flex-col z-40 transition-transform duration-300
            ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

                {/* Logo */}
                <div className="px-6 py-8 border-b border-white/10">
                    <h1 className="text-2xl font-extrabold">NeoShop</h1>
                    <p className="text-gray-400 text-xs mt-1">لوحة تحكم المشرف</p>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                    {menuItems.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                ${isActive
                                    ? 'bg-linear-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 text-cyan-400'
                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-4 py-6 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        تسجيل الخروج
                    </button>
                </div>

            </aside>

            {/* Spacer for layout */}
            <div className="hidden md:block w-64 shrink-0" />
        </>
    )
}

export default Sidebar