import { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2 } from "lucide-react"

const List = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const load = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/product/list`
            )
            if (response.data.success) {
                setProducts(response.data.data)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }
    load()
}, [])

  const deleteProduct = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف المنتج؟')) return
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      )
      if (response.data.success) {
        alert('✅ تم حذف المنتج')
      
      }
    } catch (err) {
      console.log(err)
      alert('❌ حدث خطأ أثناء الحذف')
    }
  }



  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">قائمة المنتجات</h1>
        <span className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm">
          {products.length} منتج
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">لا توجد منتجات بعد</p>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-[60px_1fr_1fr_100px_100px_100px] gap-4 px-6 py-4 bg-white/10 border-b border-white/10 text-sm text-gray-300 font-medium">
            <span>صورة</span>
            <span>اسم المنتج</span>
            <span>الفئة</span>
            <span>السعر</span>
            <span>الخصم</span>
            <span className="text-center">إجراءات</span>
          </div>

          {/* Rows */}
          {products.map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-[60px_1fr_1fr_100px_100px_100px] gap-4 px-6 py-4 border-b border-white/10 hover:bg-white/5 transition-all items-center last:border-0"
            >
              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-contain rounded-xl bg-white/10"
              />

              {/* Name */}
              <p className="text-sm font-medium truncate">{product.name}</p>

              {/* Category */}
              <span className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full w-fit">
                {product.category}
              </span>

              {/* Price */}
              <div>
                <p className="text-sm font-bold">${product.price}</p>
                {product.oldPrice > 0 && (
                  <p className="text-xs text-gray-400 line-through">${product.oldPrice}</p>
                )}
              </div>

              {/* Discount */}
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
                product.discount > 0
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {product.discount > 0 ? `-${product.discount}%` : 'لا يوجد'}
              </span>

              {/* Actions */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500 border border-red-500/30 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default List