import { useState } from "react"
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStatusBadge } from "@/lib/statusBadge"
import { toast } from "sonner"
import useAuthStore from "@/store/authStore"
import {
  getPendingRequests,
  getPartiallyApprovedRequests,
  processApproval,
} from "@/services/approval"
import DetailRequestModal from "@/components/modals/request/DetailRequestModal"
import ActionApprovalModal from "@/components/modals/approval/ActionApprovalModal"
import StatsCard from "@/components/ui/StatsCard"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const fetchApprovalRequests = async () => {
  const user = useAuthStore.getState().user
  const roleNames = user?.roleNames || []
  const isValidator = roleNames.includes("VALIDATOR")
  const isApprover = roleNames.includes("APPROVER")

  let data = []
  if (isValidator && isApprover) {
    const [pending, partial] = await Promise.all([
      getPendingRequests(),
      getPartiallyApprovedRequests(),
    ])
    data = [...(pending || []), ...(partial || [])]
  } else if (isValidator) {
    data = await getPendingRequests()
  } else if (isApprover) {
    data = await getPartiallyApprovedRequests()
  }
  return data || []
}

const OvertimeApprovalPage = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [actionModal, setActionModal] = useState({
    open: false,
    type: "approve",
    request: null,
  })

  const {
    data: requests = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["approval-requests", user?.roleNames],
    queryFn: fetchApprovalRequests,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!user,
  })

  const approvalMutation = useMutation({
    mutationFn: ({ id, payload }) => processApproval(id, payload),
    onSuccess: (_, variables) => {
      toast.success(
        variables.payload.decision === "APPROVE"
          ? "Request berhasil di-approve!"
          : "Request berhasil ditolak!"
      )
      setActionModal({ open: false, type: "approve", request: null })
      queryClient.invalidateQueries({ queryKey: ["approval-requests"] })
      queryClient.invalidateQueries({ queryKey: ["detail-request"] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Gagal memproses approval")
    },
  })

  const handleRowClick = (item) => {
    setSelectedRequest(item)
    setIsDetailOpen(true)
  }

  const handleActionConfirm = (request, payload) => {
    approvalMutation.mutate({
      id: request.id,
      payload: {
        decision: payload.status,
        note: payload.note || undefined,
      },
    })
  }

  const pendingCount = requests.filter(
    (r) => r.status === "PENDING" || r.status === "PARTIALLY_APPROVED"
  ).length
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length

  const roleNames = user?.roleNames || []
  const isValidator = roleNames.includes("VALIDATOR")
  const isApprover = roleNames.includes("APPROVER")

  if (!isValidator && !isApprover) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">Anda tidak memiliki akses ke halaman ini.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-2xl font-bold">Approval Queue</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Review dan proses overtime request</p>
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
            <p className="text-muted-foreground">Tidak ada request yang perlu diproses.</p>
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
                    <TableHead className="text-center">Department</TableHead>
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
                      <TableCell className="text-center">{item.requesterName}</TableCell>
                      <TableCell className="text-center">{item.departmentName}</TableCell>
                      <TableCell className="text-center max-w-[200px] truncate">
                        {item.reason}
                      </TableCell>
                      <TableCell className="text-center">{item.totalHoursDisplay}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-3"
                            onClick={() =>
                              setActionModal({
                                open: true,
                                type: "approve",
                                request: item,
                              })
                            }
                            disabled={approvalMutation.isPending}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3"
                            onClick={() =>
                              setActionModal({
                                open: true,
                                type: "reject",
                                request: item,
                              })
                            }
                            disabled={approvalMutation.isPending}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
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

      {/* MODALS */}
      <DetailRequestModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        request={selectedRequest}
        source="approver"
      />

      <ActionApprovalModal
        open={actionModal.open}
        onOpenChange={(open) => {
          if (!open) setActionModal({ open: false, type: "approve", request: null })
        }}
        request={actionModal.request}
        type={actionModal.type}
        onConfirm={handleActionConfirm}
        isLoading={approvalMutation.isPending}
      />
    </div>
  )
}

export default OvertimeApprovalPage