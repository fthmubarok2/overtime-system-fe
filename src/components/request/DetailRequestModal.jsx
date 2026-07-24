import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOvertimeDetail } from "@/services/overtime"
import { getStatusBadge } from "@/lib/statusBadge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

const DetailRequestModal = ({ open, onOpenChange, request }) => {
  const [detailData, setDetailData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const cacheRef = useRef({})

  useEffect(() => {
    if (open && request) {
      if (cacheRef.current[request.id]) {
        setDetailData(cacheRef.current[request.id])
      } else {
        fetchDetails()
      }
    }
  }, [open, request])

  const fetchDetails = async () => {
    try {
      setIsLoading(true)
      const result = await getOvertimeDetail(request.id)
      cacheRef.current[request.id] = result.data
      setDetailData(result.data)
    } catch (err) {
      console.error("Gagal ambil detail:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!request) return null

  const details = detailData?.details || []
  const approvals = detailData?.approvals || []

  const getApprovalLevelLabel = (level) => {
    return level === 1 ? "Validator" : "Approver"
  }

  const getApprovalIcon = (status) => {
    if (status === "APPROVED" || status === "PARTIALLY_APPROVED") {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    if (status === "REJECTED") {
      return <XCircle className="w-4 h-4 text-red-500" />
    }
    return <Clock className="w-4 h-4 text-yellow-500" />
  }

  const getApprovalStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "Disetujui"
      case "PARTIALLY_APPROVED":
        return "Disetujui"
      case "REJECTED":
        return "Ditolak"
      default:
        return "Menunggu"
    }
  }

  const getNextWaitingInfo = () => {
    if (request.status === "PENDING") {
      return { level: 1, label: "Validator", text: "Menunggu persetujuan" }
    }
    if (request.status === "PARTIALLY_APPROVED") {
      return { level: 2, label: "Approver", text: "Menunggu persetujuan" }
    }
    return null
  }

  const nextWaiting = getNextWaitingInfo()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-none w-[95vw] sm:w-[50vw] h-[90vh] sm:h-[75vh]  flex flex-col">
        <DialogHeader>
          <DialogTitle>Detail Request</DialogTitle>
          <DialogDescription>Detail overtime request</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reason</span>
            <span className="font-medium">{request.reason}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Hours</span>
            <span className="font-medium">{request.totalHoursDisplay}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Status</span>
            <div className="flex items-center gap-2">
              {getStatusBadge(request.status)}
            </div>
          </div>

          {(approvals.length > 0 || nextWaiting) && (
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Approval Chain</h4>
              <div className="space-y-2">
                {approvals.map((approval) => (
                  <div
                    key={approval.level}
                    className="flex items-center gap-3 p-2 rounded-md bg-gray-100"
                  >
                    {getApprovalIcon(approval.status)}
                    <div className="flex-1 text-sm">
                      <span className="font-medium">
                        Level {approval.level} ({getApprovalLevelLabel(approval.level)})
                      </span>
                      <span className="text-muted-foreground mx-2">-</span>
                      <span>{getApprovalStatusText(approval.status)}</span>
                      <span className="text-muted-foreground mx-2">oleh</span>
                      <span className="font-medium">{approval.approverName}</span>
                      {approval.note && (
                        <div className="text-xs text-muted-foreground mt-1">
                          "{approval.note}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {nextWaiting && (
                  <div className="flex items-center gap-3 p-2 rounded-md bg-yellow-50 border border-yellow-200">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <div className="flex-1 text-sm">
                      <span className="font-medium">
                        Level {nextWaiting.level} ({nextWaiting.label})
                      </span>
                      <span className="text-muted-foreground mx-2">-</span>
                      <span className="text-yellow-600">{nextWaiting.text}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Details</h4>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : details.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada detail</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Date</TableHead>
                      <TableHead className="text-center">Start</TableHead>
                      <TableHead className="text-center">End</TableHead>
                      <TableHead className="text-center">Duration</TableHead>
                      <TableHead className="text-center">Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell className="text-center text-xs">{detail.overtimeDate}</TableCell>
                        <TableCell className="text-center text-xs">{detail.startTime}</TableCell>
                        <TableCell className="text-center text-xs">{detail.endTime}</TableCell>
                        <TableCell className="text-center text-xs">{detail.durationDisplay}</TableCell>
                        <TableCell className="text-center text-xs">{detail.activity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DetailRequestModal