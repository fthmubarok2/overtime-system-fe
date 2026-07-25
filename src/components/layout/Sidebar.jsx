import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, FileText, CheckCircle, LogOut, Users, X } from "lucide-react"
import useAuthStore from "@/store/authStore"
import { cn } from "@/lib/utils"

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", roles: ["*"], icon: LayoutDashboard },
    { path: "/requests", label: "Overtime Request", roles: ["REQUESTER"], icon: FileText },
    { path: "/approve", label: "Overtime Approval", roles: ["VALIDATOR", "APPROVER"], icon: CheckCircle },
    { path: "/admin", label: "User Management", roles: ["ADMIN"], icon: Users },
  ]

  const filteredMenu = menuItems.filter((item) => {
    if (item.roles.includes("*")) {
      return true
    }
    return item.roles.some((role) => user.roleNames.includes(role))
  })

  const handleNavClick = () => {
    if (onClose) onClose()
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r bg-white flex flex-col min-h-screen transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">OT Management</h1>
            <p className="text-xs text-muted-foreground">Internal System</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-muted font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Guest"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.roleNames?.join(", ") || ""}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
