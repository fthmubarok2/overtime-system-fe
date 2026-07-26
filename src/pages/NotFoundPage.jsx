import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-300">404</p>
        <h1 className="text-xl font-semibold mt-4">Halaman tidak ditemukan</h1>
        <p className="text-sm text-muted-foreground mt-2">URL yang kamu akses tidak tersedia</p>
        <Button className="mt-6" onClick={() => navigate("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
