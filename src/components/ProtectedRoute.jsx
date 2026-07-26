import { Navigate, Outlet } from "react-router-dom"
import useAuthStore from "@/store/authStore"

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const setSessionExpired = useAuthStore((state) => state.setSessionExpired)

  if (!token) {
    setSessionExpired(true)
    return <Navigate to="/" replace />
  }

  if (allowedRoles && user?.roleNames) {
    const hasAccess = user.roleNames.some((role) => allowedRoles.includes(role))
    if (!hasAccess) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children || <Outlet />
}

export default ProtectedRoute
