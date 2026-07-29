import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMyProfile } from "@/hooks/useMyProfile"

const ProfileModal = ({ open, onOpenChange }) => {
  const { user: apiUser, isLoading, updateProfile, isUpdating } = useMyProfile(open)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  })
  const [password, setPassword] = useState("")
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [error, setError] = useState("")

  // Sinkronisasi data lama dari API ke Form State
  useEffect(() => {
    if (open && apiUser) {
      setFormData({
        name: apiUser.name || "",
        email: apiUser.email || "",
        username: apiUser.username || "",
      })
    }
  }, [apiUser, open])

  const handleChange = (e) => {
    const { id, value } = e.target
    const fieldName = id.replace("profile-", "")
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    const isDataChanged =
      formData.name !== apiUser?.name ||
      formData.email !== apiUser?.email ||
      formData.username !== apiUser?.username ||
      Boolean(password)

    if (!isDataChanged) {
      handleClose(false)
      return
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      username: formData.username,
    }

    if (password) {
      payload.password = password
    }

    updateProfile(payload, {
      onSuccess: () => {
        handleClose(false)
      },
      onError: (err) => {
        const message = err.response?.data?.message || "Gagal mengupdate profil"
        setError(message)
      },
    })
  }

  const handleClose = (isOpen) => {
    if (!isOpen) {
      setError("")
      setShowPasswordField(false)
      setPassword("")
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profil Saya</DialogTitle>
          <DialogDescription>Ubah data pribadi anda</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
            <span>Memuat data profil...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nama</Label>
              <Input
                id="profile-name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-username">Username</Label>
              <Input
                id="profile-username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-password">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowPasswordField(!showPasswordField)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {showPasswordField ? "Batal" : "Ganti Password"}
                </button>
              </div>
              {showPasswordField && (
                <Input
                  id="profile-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                />
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={isUpdating}>
                {isUpdating ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => handleClose(false)}>
                Batal
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProfileModal