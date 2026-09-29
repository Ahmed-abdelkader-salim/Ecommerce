import { Route, Routes, Navigate, Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Sidebar from "./components/Sidebar"
import Add from "./components/Add"
import Orders from "./components/Orders"
import List from "./components/List"
import Users from "./components/Users"
import Dashboard from "./components/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLogin from "./components/AdminLogin"

const AdminLayout = () => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
  </div>
)

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add" element={<Add />} />
          <Route path="list" element={<List />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App