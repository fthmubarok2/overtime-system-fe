import axios from "axios"
import { toast } from "sonner"

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      
      toast.error("Sesi anda telah berakhir, silahkan login kembali", {
        duration: 4000,
        position: "top-right",
      })

      if (window.location.pathname !== "/") {
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  }
)

export default api