import { useState, useContext } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { User, Mail, Phone, Lock, Package, ChevronLeft, ShoppingBag, Heart, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { url, token, user } = useContext(ShopContext)
  const navigate = useNavigate()

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    setLoadingProfile(true)
    try {
      const response = await axios.put(
        `${url}/api/user/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) alert('✅ تم تحديث الملف الشخصي')
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingProfile(false)
    }
  }

  const updatePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ كلمة المرور الجديدة غير متطابقة')
      return
    }
    setLoadingPassword(true)
    try {
      const response = await axios.put(
        `${url}/api/user/password`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        alert('✅ تم تغيير كلمة المرور')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingPassword(false)
    }
  }

  const quickLinks = [
    { label: 'طلباتي', icon: Package, path: '/myorders', color: 'from-cyan-400/20 to-blue-500/20 border-cyan-400/30 text-cyan-400' },
    { label: 'سلة التسوق', icon: ShoppingBag, path: '/cart', color: 'from-purple-400/20 to-pink-500/20 border-purple-400/30 text-purple-400' },
    { label: 'المفضلة', icon: Heart, path: '/wishlist', color: 'from-red-400/20 to-pink-500/20 border-red-400/30 text-red-400' },
    { label: 'العناوين', icon: MapPin, path: '/addresses', color: 'from-green-400/20 to-emerald-500/20 border-green-400/30 text-green-400' },
  ]

  const inputClass = `w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
  text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-all`

  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Avatar */}
        <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <div className="w-24 h-24 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{user?.name || 'المستخدم'}</h1>
            <p className="text-gray-400 text-sm flex items-center gap-1 justify-center mt-1">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1 justify-center mt-3">
              <Phone className="w-4 h-4" />
              {user?.phone}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map(({ label, icon: Icon, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-linear-to-br border backdrop-blur-md hover:scale-105 transition-all duration-200 ${color}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* My Orders Banner */}
        <button
          onClick={() => navigate('/myorders')}
          className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-400/20 border border-cyan-400/30 rounded-xl">
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">طلباتي</p>
              <p className="text-xs text-gray-400 mt-0.5">تتبع وإدارة طلباتك</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all" />
        </button>

        {/* Update Profile */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            تعديل الملف الشخصي
          </h2>
          <form onSubmit={updateProfile} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">الاسم</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="اسمك الكامل"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">رقم الهاتف</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="رقم هاتفك"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loadingProfile ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
            </button>
          </form>
        </div>

        {/* Update Password */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            تغيير كلمة المرور
          </h2>
          <form onSubmit={updatePassword} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">كلمة المرور الحالية</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">كلمة المرور الجديدة</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">تأكيد كلمة المرور</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loadingPassword ? 'جارٍ التغيير...' : 'تغيير كلمة المرور'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Profile