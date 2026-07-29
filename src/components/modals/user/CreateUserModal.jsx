import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQuery } from "@tanstack/react-query"
import { register } from "@/services/user"
import { getAllDepartments, getAllRoles } from "@/services/masterData"
import { toast } from "sonner"

const CreateUserModal = ({ open, onOpenChange, onSuccess }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [selectedRoles, setSelectedRoles] = useState([])
  const [error, setError] = useState("")

  // Fetch data master department
  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
    staleTime: 1000 * 60 * 60,
    enabled: open, // Hanya fetch saat modal terbuka
  })

  // Fetch data master roles
  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
    staleTime: 1000 * 60 * 60,
    enabled: open, // Hanya fetch saat modal terbuka
  })

  const departments = departmentsData?.data || []
  const roles = rolesData?.data || []

  // Bersihkan isi form secara total ketika modal dibuka atau ditutup
  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const resetForm = () => {
    setName("")
    setEmail("")
    setUsername("")
    setDepartmentId("")
    setSelectedRoles([])
    setError("")
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => register(data),
    onSuccess: () => {
      toast.success("User berhasil dibuat!")
      resetForm()
      onOpenChange(false)
      if (onSuccess) onSuccess()
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Gagal membuat user"
      setError(message)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Validasi input minimal satu role terpilih
    if (selectedRoles.length === 0) {
      setError("User minimal harus memiliki 1 role!")
      return
    }

    mutate({
      name,
      email,
      username,
      password: "password123",
      departmentId: Number(departmentId),
      roleIds: selectedRoles,
    })
  }

  const handleClose = (isOpen) => {
    if (!isOpen) {
      setError("")
    }
    onOpenChange(isOpen)
  }

  const handleRoleToggle = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Buat User Baru</DialogTitle>
          <DialogDescription>Isi form untuk menambahkan user baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
          <div className="space-y-2">
            <Label htmlFor="create-name">Nama</Label>
            <Input
              id="create-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-username">Username</Label>
            <Input
              id="create-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="create-department">Department</Label>
            <select
              id="create-department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Pilih Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="relative border rounded-md p-3 bg-gray-50/50">
              <div className="space-y-1.5 pr-28 sm:pr-36">
                {roles.map((role) => (
                  <label key={role.id} className="flex items-center gap-2 cursor-pointer text-sm py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {role.name}
                  </label>
                ))}
              </div>
              <span className="absolute top-3 right-3 text-xs text-amber-600 bg-amber-50 rounded-md px-2 py-1 text-right leading-tight">
                Password default: password123
                <br />Dapat diubah via profil
              </span>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => handleClose(false)}>
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserModal