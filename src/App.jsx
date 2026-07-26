import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import useAuthStore from "@/store/authStore"
import AuthLayout from "@/layouts/AuthLayout"
import DashboardLayout from "@/layouts/DashboardLayout"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import OvertimeRequestPage from "@/pages/OvertimeRequestPage"
import OvertimeApprovalPage from "@/pages/OvertimeApprovalPage"
import NotFoundPage from "@/pages/NotFoundPage"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Toaster } from "sonner"

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/requests" element={
              <ProtectedRoute allowedRoles={["REQUESTER"]}>
                <OvertimeRequestPage />
              </ProtectedRoute>
            } />
            <Route path="/approve" element={
              <ProtectedRoute allowedRoles={["VALIDATOR", "APPROVER"]}>
                <OvertimeApprovalPage />
              </ProtectedRoute>
            } />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
