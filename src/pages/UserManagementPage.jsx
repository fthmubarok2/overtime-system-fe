import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Loader2, Users, UserCheck, UserX } from "lucide-react"
import { getAllUsers, deleteUser, restoreUser } from "@/services/user"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ActionModal from "@/components/modals/common/ActionModal"
import StatsCard from "@/components/ui/StatsCard"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const UserManagementPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const queryClient = useQueryClient()

  const fetchUsers = async () => {
    const result = await getAllUsers()
    return result.data || []
  }

  const { 
    data: users = [],  
    isLoading, 
    isError,
    error,
    refetch  
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
    refetchOnWindowFocus: false
  })

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    user: null,
  })

  const [restoreModal, setRestoreModal] = useState({
    open: false,
    user: null,
  })

  const handleDeleteClick = (e, user) => {
    e.stopPropagation()
    setDeleteModal({ open: true, user })
  }

  const handleRestoreClick = (e, user) => {
    e.stopPropagation()
    setRestoreModal({ open: true, user })
  }

  const handleConfirmDelete = async () => {
    const user = deleteModal.user
    try {
      await deleteUser(user.id)
      toast.success("User berhasil dihapus!")
      setDeleteModal({ open: false, user: null }) 
      refetch()
    } catch (err) {
      const message = err.response?.data?.message || "Gagal menghapus user"
      toast.error(message)
    }
  }

  const handleConfirmRestore = async () => {
    const user = restoreModal.user
    try {
      await restoreUser(user.id)
      toast.success("User berhasil direstore!")
      setRestoreModal({ open: false, user: null })
      refetch()  
    } catch (err) {
      const message = err.response?.data?.message || "Gagal merestore user"
      toast.error(message)
    }
  }

  // Hitung statistik
  const totalUsers = users?.length
  const activeUsers = users?.filter((u) => u.isActive).length
  const deletedUsers = users?.filter((u) => !u.isActive).length

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold">User Management</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Kelola user dan role</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">New User</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCard
        isLoading={isLoading}
        stats={[
          {
            icon: <Users className="h-4 w-4 text-blue-600" />,
            count: totalUsers,
            label: "Total Users",
            bgColor: "bg-blue-50",
          },
          {
            icon: <UserCheck className="h-4 w-4 text-emerald-600" />,
            count: activeUsers,
            label: "Active",
            bgColor: "bg-emerald-50",
          },
          {
            icon: <UserX className="h-4 w-4 text-red-600" />,
            count: deletedUsers,
            label: "Deleted",
            bgColor: "bg-red-50",
          },
        ]}
      />

      {/* Table */}
      {isLoading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Memuat data user...</p>
            </div>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              {error?.message || "Gagal memuat data user"}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Belum ada user. Buat user pertama!</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Department</TableHead>
                    <TableHead className="text-center">Roles</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{item.name}</TableCell>
                      <TableCell className="text-center">{item.email}</TableCell>
                      <TableCell className="text-center">{item.departmentName}</TableCell>
                      <TableCell className="text-center">
                        {item.roleNames || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.isActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {item.isActive ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3"
                                // onClick={() => handleEdit(item)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 px-3"
                                onClick={(e) => handleDeleteClick(e, item)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white h-8 px-3"
                              onClick={(e) => handleRestoreClick(e, item)}
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ActionModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        actionType="delete"
        item={deleteModal.user}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />

      <ActionModal
        open={restoreModal.open}
        onOpenChange={(open) => setRestoreModal({ ...restoreModal, open })}
        actionType="restore"
        item={restoreModal.user}
        onConfirm={handleConfirmRestore}
        isLoading={isLoading}
      />
    </div>
  )
}

export default UserManagementPage