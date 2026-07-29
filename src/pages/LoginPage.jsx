import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "@/store/authStore"
import { login } from "@/services/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const sessionExpired = useAuthStore((state) => state.sessionExpired)
  const setSessionExpired = useAuthStore((state) => state.setSessionExpired)
  const toastId = useRef(null)

  useEffect(() => {
    if (sessionExpired && !toastId.current) {
      toastId.current = toast.error("Sesi anda telah berakhir, silakan login kembali", {
        duration: 4000,
        onAutoClose: () => { toastId.current = null },
      })
      setSessionExpired(false)
      setTimeout(() => {
        if (toastId.current) {
          toast.dismiss(toastId.current)
          toastId.current = null
        }
      }, 4500)
    }
  }, [sessionExpired])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login(username, password)
      const { token, name, roleNames } = result.data
      setAuth(token, { name, roleNames })
      navigate("/dashboard")
    } catch (err) {
      const message = err.response?.data?.message || "Username atau password salah"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Masukkan username anda"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      <p>password123
        admin@company.com<br></br>
andi.pratama@company.com
citra.dewi@company.com
dewi.lestari@company.com
erlangga.hadi@company.com
fitriani.putri@company.com</p>
    </form>
  )
}

export default LoginPage
