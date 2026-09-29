import { useState } from 'react'
import axios from 'axios'

const Add = () => {
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    discount: '',
    category: 'Men',
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const onImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('price', data.price)
      formData.append('oldPrice', data.oldPrice)
      formData.append('discount', data.discount)
      formData.append('category', data.category)
      formData.append('image', image)

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data.success) {
        alert('✅ تم إضافة المنتج بنجاح')
        setData({ name: '', description: '', price: '', oldPrice: '', discount: '', category: 'Men' })
        setImage(null)
        setPreview(null)
      }
    } catch (err) {
      console.log(err)
      alert('❌ حدث خطأ أثناء إضافة المنتج')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `w-full px-4 py-3 rounded-xl bg-white/15 text-white
  placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none`

  return (
    <section   dir="rtl" className="relative w-full min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10">

      <form onSubmit={onSubmitHandler}>
        <div className="relative z-10 max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-bold mb-6 text-center">إضافة منتج جديد</h2>

          <div className="space-y-4">

            {/* Image Upload */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">صورة المنتج</label>
              <label className="cursor-pointer block">
                <div className={`w-full h-48 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden hover:border-cyan-400 transition-all`}>
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p className="text-4xl mb-2">📷</p>
                      <p className="text-sm">اضغط لرفع صورة</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="hidden"
                  required
                />
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">اسم المنتج</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                placeholder="أدخل اسم المنتج"
                className={inputClass}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">وصف المنتج</label>
              <textarea
                name="description"
                value={data.description}
                onChange={onChangeHandler}
                placeholder="أدخل وصف المنتج"
                rows={3}
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            {/* Price + OldPrice */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">السعر ($)</label>
                <input
                  type="number"
                  name="price"
                  value={data.price}
                  onChange={onChangeHandler}
                  placeholder="0.00"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">السعر القديم ($)</label>
                <input
                  type="number"
                  name="oldPrice"
                  value={data.oldPrice}
                  onChange={onChangeHandler}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Discount + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">الخصم (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={data.discount}
                  onChange={onChangeHandler}
                  placeholder="0"
                  min={0}
                  max={100}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">الفئة</label>
                <select
                  name="category"
                  value={data.category}
                  onChange={onChangeHandler}
                  className={inputClass}
                >
                  <option value="Men" className="text-black">Men</option>
                  <option value="Women" className="text-black">Women</option>
                  <option value="Kids" className="text-black">Kids</option>
                  <option value="Electronics" className="text-black">Electronics</option>
                  <option value="Cosmetics" className="text-black">Cosmetics</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg text-lg disabled:opacity-50"
            >
              {loading ? 'جارٍ الإضافة...' : 'إضافة المنتج ✅'}
            </button>

          </div>
        </div>
      </form>
    </section>
  )
}

export default Add