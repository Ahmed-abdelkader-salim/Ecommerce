/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Trash2, Shield, User } from "lucide-react";
import axios from "axios";

const Users = () => {
  const url =   import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const demoteToUser = async (id) => {
    try {
      await axios.put(`${url}/api/user/demote-to-user/${id}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isAdmin: false } : u))
      );
      alert("✅ تم إعادة المستخدم إلى مستخدم عادي بنجاح");
    } catch (error) {
      console.error("❌ خطأ في إعادة الدور:", error);
      alert("حدث خطأ أثناء إعادة الدور");
    }
  };

  const promoteToAdmin = async (id) => {
    try {
      await axios.put(`${url}/api/user/make-admin/${id}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isAdmin: true } : u))
      );
      alert("✅ تم ترقية المستخدم إلى أدمن بنجاح");
    } catch (error) {
      console.error("❌ خطأ في الترقية:", error);
      alert("حدث خطأ أثناء الترقية");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("متأكد إنك عايز تحذف المستخدم ده؟")) return;
    try {
      const response = await axios.delete(`${url}/api/user/delete/${id}`);
      if (response.data && response.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        alert("✅ تم حذف المستخدم بنجاح");
      } else {
        alert("⚠️ فشل حذف المستخدم من السيرفر");
      }
    } catch (error) {
      console.error("❌ خطأ في حذف المستخدم:", error);
      alert("فشل في الحذف");
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${url}/api/user/list`);
        if (ignore) return;
        if (res.data && res.data.success) {
          setUsers(res.data.data || res.data.users || []);
        } else {
          setUsers([]);
        }
      } catch (err) {
        if (!ignore) setUsers([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      ignore = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className=" min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10">
      <div className="max-6xl mx-auto">
    <h2 className="mb-4 text-2xl font-bold text-white">المستخدمين</h2>

      {loading ? (
        <p className="text-gray-400">جاري التحميل...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400">مفيش مستخدمين لسه.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="rounded-xl border border-gray-700 bg-gray-800 p-4 text-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-700">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="truncate text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              <p className="mt-3 text-sm">
                الدور:{" "}
                <span
                  className={
                    user.isAdmin === true ? "text-yellow-400" : "text-gray-300"
                  }
                >
                  {user.isAdmin === true ? "مدير" : "مستخدم"}
                </span>
              </p>

              <div className="mt-2 flex flex-col">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="mt-2 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-semibold transition-all hover:bg-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                  حذف المستخدم
                </button>

                <button
                  onClick={() => promoteToAdmin(user._id)}
                  disabled={user.isAdmin === true}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all mt-2 ${
                    user.isAdmin === true
                      ? "bg-gray-500/40 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  {user.isAdmin === true ? "مدير" : "ترقية إلى أدمن"}
                </button>

                <button
                  onClick={() => demoteToUser(user._id)}
                  disabled={user.isAdmin !== true}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all mt-2 ${
                    user.isAdmin !== true
                      ? "bg-gray-500/40 cursor-not-allowed"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
                >
                  <User className="h-5 w-5" />
                  تخفيض إلى مستخدم
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
  
    </section>
  );
};

export default Users;