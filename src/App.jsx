import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import useAuthStore from "@/store/authStore"
import AuthLayout from "@/layouts/AuthLayout"
import DashboardLayout from "@/layouts/DashboardLayout"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import OvertimeRequestPage from "@/pages/OvertimeRequestPage"
import OvertimeApprovalPage from "@/pages/OvertimeApprovalPage"
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
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/requests" element={<OvertimeRequestPage />} />
            <Route path="/approve" element={<OvertimeApprovalPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
