import useAuthStore from "@/store/authStore"

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Hai, Selamat Datang{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Selamat bekerja dengan sistem Overtime Management
        </p>
      </div>
    </div>
  )
}

export default DashboardPage