import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        data
      )

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token)
        navigate('/admin/dashboard')
      } else {
        setError(response.data.message)
      }

    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `w-full px-4 py-3 rounded-xl bg-white/15 text-white
  placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none border border-white/20`

  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 shadow-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">NeoShop</h1>
          <p className="text-gray-400 mt-2 text-sm">لوحة تحكم المشرف</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">

          <div>
            <label className="text-gray-300 text-sm mb-1 block">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={onChangeHandler}
              placeholder="admin@neoshop.com"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={onChangeHandler}
              placeholder="••••••••"
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-linear-to-r from-cyan-400 to-blue-500
            hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3.5
            rounded-2xl transition-all active:scale-95 shadow-lg text-lg
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول 🔐'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default AdminLogin