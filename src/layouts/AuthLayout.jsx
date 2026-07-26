import { Outlet, Navigate } from "react-router-dom"
import useAuthStore from "@/store/authStore"

const AuthLayout = () => {
  const token = useAuthStore((state) => state.token)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">OT Management</h1>
          <p className="text-sm text-gray-500">Overtime System • Internal</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <Outlet />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 OT Management. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout