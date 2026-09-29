import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { Package } from 'lucide-react'

const statusColors = {
  'Order Placed': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Packing': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Shipped': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Out for Delivery': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Delivered': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Cancelled': 'bg-red-500/20 text-red-300 border-red-500/30',
}

const MyOrders = () => {
  const { url, token } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${url}/api/order/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.data.success) {
          setOrders(response.data.data)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchOrders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div dir='rtl' className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">طلباتي</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
              >
                <div className="flex flex-col sm:flex-row gap-6 justify-between">

                  {/* Items */}
                  <div className="flex gap-4">
                    <div className="p-3 bg-white/10 rounded-xl h-fit">
                      <Package className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">المنتجات</p>
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm text-gray-200">
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <p className="text-xs text-gray-400">الإجمالي</p>
                    <p className="text-2xl font-extrabold">${order.amount}</p>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border w-fit ${
                      order.payment
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}>
                      {order.payment ? 'تم الدفع' : 'لم يتم الدفع'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <p className="text-xs text-gray-400">حالة الطلب</p>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border w-fit ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                    <p className="text-xs text-gray-400">
                      {new Date(order.date).toLocaleDateString('ar-EG', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders