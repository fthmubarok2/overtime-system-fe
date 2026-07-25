import { useState, useEffect } from "react"
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
} from "@/services/overtimeApproval"
import ApprovalDetailModal from "@/components/approval/ApprovalDetailModal"
import ApproveModal from "@/components/approval/ApproveModal"
import RejectModal from "@/components/approval/RejectModal"
import StatsCard from "@/components/ui/StatsCard"

const OvertimeApprovalPage = () => {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const user = useAuthStore((state) => state.user)

  // Modal state
  const [detailModal, setDetailModal] = useState({ open: false, request: null })
  const [approveModal, setApproveModal] = useState({ open: false, request: null })
  const [rejectModal, setRejectModal] = useState({ open: false, request: null })

  useEffect(() => {
    fetchRequest()
  }, [])

  const fetchRequest = async () => {
    const roleNames = user?.roleNames || []
    const isValidator = roleNames.includes("VALIDATOR")
    const isApprover = roleNames.includes("APPROVER")

    try {
      setIsLoading(true)
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
      } else {
        setError("Akses ditolak")
        setIsLoading(false)
        return
      }
      setRequests(data || [])
    } catch (err) {
      setError("Gagal memuat data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (request, note) => {
    try {
      await processApproval(request.id, { decision: "APPROVE", note: note || undefined })
      toast.success("Request berhasil di-approve!")
      setApproveModal({ open: false, request: null })
      setDetailModal({ open: false, request: null })
      fetchRequest()
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal approve request")
    }
  }

  const handleReject = async (request, note) => {
    try {
      await processApproval(request.id, { decision: "REJECT", note })
      toast.success("Request berhasil ditolak!")
      setRejectModal({ open: false, request: null })
      setDetailModal({ open: false, request: null })
      fetchRequest()
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal reject request")
    }
  }

  const pendingCount = requests.filter(
    (r) => r.status === "PENDING" || r.status === "PARTIALLY_APPROVED"
  ).length
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length

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
      ) : error ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchRequest} className="mt-4">
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
                      onClick={() => setDetailModal({ open: true, request: item })}
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
                            onClick={() => setApproveModal({ open: true, request: item })}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3"
                            onClick={() => setRejectModal({ open: true, request: item })}
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

      {/* Modals */}
      <ApprovalDetailModal
        open={detailModal.open}
        onOpenChange={(open) => {
          if (!open) setDetailModal({ open: false, request: null })
        }}
        request={detailModal.request}
      />

      <ApproveModal
        open={approveModal.open}
        onOpenChange={(open) => {
          if (!open) setApproveModal({ open: false, request: null })
        }}
        request={approveModal.request}
        onApprove={handleApprove}
      />

      <RejectModal
        open={rejectModal.open}
        onOpenChange={(open) => {
          if (!open) setRejectModal({ open: false, request: null })
        }}
        request={rejectModal.request}
        onReject={handleReject}
      />
    </div>
  )
}

export default OvertimeApprovalPage
