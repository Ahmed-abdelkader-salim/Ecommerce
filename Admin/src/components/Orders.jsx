import { useState, useEffect } from 'react'
import axios from 'axios'
import { Package, RefreshCw } from 'lucide-react'

const statusOptions = [
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
]

const statusColors = {
  'Order Placed': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Packing': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Shipped': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Out for Delivery': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Delivered': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Cancelled': 'bg-red-500/20 text-red-300 border-red-500/30',
}

const Orders = () => {
    const [orders, setOrders] = useState([])
const [loading, setLoading] = useState(true)
const [refresh, setRefresh] = useState(false) 

const updateStatus = async (orderId, status) => {
    try {
        await axios.put(
            `${import.meta.env.VITE_API_URL}/api/order/status`,
            { orderId, status },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                },
            }
        )
        setRefresh(prev => !prev) 
    } catch (err) {
        console.log(err)
    }
}

useEffect(() => {
    const fetchOrders = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/order/list`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
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
    fetchOrders()
}, [refresh]) 

  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">طلبات العملاء</h1>
        <button
          onClick={() => setRefresh(prev => ! prev)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          تحديث
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
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
              <div className="flex flex-col lg:flex-row gap-6 justify-between">

                {/* Order Info */}
                <div className="flex gap-4">
                  <div className="p-3 bg-white/10 rounded-xl h-fit">
                    <Package className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400">رقم الطلب</p>
                    <p className="text-sm font-mono text-cyan-400">{order._id}</p>

                    {/* Items */}
                    <div className="mt-2 flex flex-col gap-1">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-sm text-gray-200">
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1 text-sm text-gray-300">
                  <p className="text-xs text-gray-400 mb-1">بيانات الشحن</p>
                  <p>{order.address?.name}</p>
                  <p>{order.address?.street}</p>
                  <p>{order.address?.city}</p>
                  <p>{order.address?.phone}</p>
                </div>

                {/* Amount + Payment */}
                <div className="flex flex-col gap-2 text-sm shrink-0">
                  <p className="text-xs text-gray-400">الإجمالي</p>
                  <p className="text-2xl font-extrabold">${order.amount}</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border w-fit ${
                    order.payment
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {order.payment ? 'تم الدفع' : 'لم يتم الدفع'}
                  </span>
                  <span className="text-xs text-gray-400">{order.paymentMethod}</span>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2 shrink-0">
                  <p className="text-xs text-gray-400">حالة الطلب</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border w-fit ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="bg-white/10 border border-white/20 text-white text-sm px-3 py-2 rounded-xl outline-none focus:border-cyan-400 transition-all cursor-pointer"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status} className="text-black">
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Date */}
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
                تاريخ الطلب: {new Date(order.date).toLocaleDateString('ar-EG', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders