import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Loader2, Clock, CheckCircle, XCircle } from "lucide-react"
import { getMyrequest, cancelOvertimeRequest } from "@/services/request"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStatusBadge } from "@/lib/statusBadge"
import CreateRequestModal from "@/components/modals/request/CreateRequestModal"
import DetailRequestModal from "@/components/modals/request/DetailRequestModal"
import ActionModal from "@/components/modals/common/ActionModal"
import StatsCard from "@/components/ui/StatsCard"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const fetchRequests = async () => {
  const result = await getMyrequest()
  return result.data || []
}

const OvertimeRequestPage = () => {
  const queryClient = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    request: null,
  })

  const {
    data: requests = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })

  const cancelMutation = useMutation({
    mutationFn: cancelOvertimeRequest,
    onSuccess: () => {
      toast.success("Request berhasil dibatalkan!")
      setDeleteModal({ open: false, request: null })
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      queryClient.invalidateQueries({ queryKey: ["detail-request"] })
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Gagal membatalkan request"
      toast.error(message)
    },
  })

  const handleRowClick = (item) => {
    setSelectedRequest(item)
    setIsDetailOpen(true)
  }

  const handleDeleteClick = (e, item) => {
    e.stopPropagation()
    setDeleteModal({ open: true, request: item })
  }

  const handleConfirmDelete = () => {
    const item = deleteModal.request
    cancelMutation.mutate(item.id)
  }

  const pendingCount = requests.filter(
    (r) => r.status === "PENDING" || r.status === "PARTIALLY_APPROVED"
  ).length
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length
  const rejectedCount = requests.filter(
    (r) => r.status === "REJECTED" || r.status === "CANCELLED"
  ).length

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold">My Overtime Requests</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Submit and track your overtime requests</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">New OT Request</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCard
        isLoading={isLoading}
        stats={[
          {
            icon: <Clock className="h-4 w-4 text-amber-600" />,
            count: pendingCount,
            label: "Pending",
            bgColor: "bg-amber-50",
          },
          {
            icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
            count: approvedCount,
            label: "Approved",
            bgColor: "bg-emerald-50",
          },
          {
            icon: <XCircle className="h-4 w-4 text-red-600" />,
            count: rejectedCount,
            label: "Rejected",
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
              <p className="text-muted-foreground">Memuat data request...</p>
            </div>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">{error?.message || "Gagal memuat data"}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No overtime requests yet. Create your first request!</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Reason</TableHead>
                    <TableHead className="text-center">Total Hours</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell className="text-center">{item.reason}</TableCell>
                      <TableCell className="text-center">{item.totalHoursDisplay}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-center">
                        {item.status === "PENDING" && (
                          <div className="flex justify-center">
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              title="Cancel Request"
                              onClick={(e) => handleDeleteClick(e, item)}
                              disabled={cancelMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
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
      <CreateRequestModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["requests"] })}
      />

      <DetailRequestModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        request={selectedRequest}
        source="requester"
      />

      <ActionModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        actionType="cancel"
        item={deleteModal.request}
        onConfirm={handleConfirmDelete}
        isLoading={cancelMutation.isPending}
      />
    </div>
  )
}

export default OvertimeRequestPage