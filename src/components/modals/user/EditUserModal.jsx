import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useMutation, useQuery } from "@tanstack/react-query"
import { updateUserByAdmin } from "@/services/user"
import { getAllDepartments, getAllRoles } from "@/services/masterData"
import { toast } from "sonner"

const EditUserModal = ({ open, onOpenChange, onSuccess, user }) => {
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

  // Sinkronisasi data awal agar form langsung terisi data lama user
  useEffect(() => {
    if (user && open) {
      setError("")
      
      // 1. Cari & pasang ID department berdasarkan departmentName dari objek user
      const matchedDept = departments.find((d) => d.name === user.departmentName)
      setDepartmentId(matchedDept ? matchedDept.id : "")

      // 2. Petakan string roleNames ("ADMIN, REQUESTER") menjadi array ID numerik untuk checkbox
      if (user.roleNames && roles.length > 0) {
        const userRoleNames = user.roleNames.split(",").map((name) => name.trim())
        const matchedRoleIds = roles
          .filter((role) => userRoleNames.includes(role.name))
          .map((role) => role.id)
        setSelectedRoles(matchedRoleIds)
      } else {
        setSelectedRoles([])
      }
    }
  }, [user, departments, roles, open])

  // Mutasi diarahkan ke fungsi update admin yang baru
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateUserByAdmin(data),
    onSuccess: () => {
      toast.success("User berhasil diupdate oleh Admin!")
      onOpenChange(false)
      onSuccess()
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Gagal mengupdate user"
      setError(message)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (selectedRoles.length === 0) {
      setError("User minimal harus memiliki 1 role!")
      return
    }

    mutate({
      id: user.id,
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
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Ubah penugasan role dan department user</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
          <div className="space-y-2">
            <Label>Nama</Label>
            <p className="text-sm py-2 px-3 rounded-md border bg-gray-50 text-gray-500 select-none">
              {user?.name || "-"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm py-2 px-3 rounded-md border bg-gray-50 text-gray-500 select-none">
              {user?.email || "-"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Username</Label>
            <p className="text-sm py-2 px-3 rounded-md border bg-gray-50 text-gray-500 select-none">
              {user?.username || "-"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-department">Department</Label>
            <select
              id="edit-department"
              value={departmentId}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            <div className="space-y-1.5 border rounded-md p-3">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center gap-2 cursor-pointer text-sm py-0.5 hover:text-blue-600 transition-colors">
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

export default EditUserModal