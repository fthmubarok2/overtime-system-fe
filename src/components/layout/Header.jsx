import { useLocation } from "react-router-dom"
import useAuthStore from "@/store/authStore"

const Header = () => {
  const location = useLocation()
  const { user } = useAuthStore()

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('dashboard')) return 'Dashboard'
    if (path.includes('requests/new')) return 'New Request'
    if (path.includes('requests')) return 'My Requests'
    if (path.includes('approve')) return 'Approval Queue'
    return 'OT Management'
  }

  return (
    <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold">{getPageTitle()}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Halo, {user?.name || "Guest"}
        </span>
      </div>
    </header>
  )
}

export default Header