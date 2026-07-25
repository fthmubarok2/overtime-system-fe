import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Loader2, Clock, CheckCircle, XCircle } from "lucide-react"
import { getMyrequest, cancelOvertimeRequest } from "@/services/overtimeRequest"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStatusBadge } from "@/lib/statusBadge"
import CreateRequestModal from "@/components/request/CreateRequestModal"
import DetailRequestModal from "@/components/request/DetailRequestModal"
import StatsCard from "@/components/ui/StatsCard"
import { toast } from "sonner"

const OvertimeRequestPage = () => {
  const [request, setRequest] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  useEffect(() => {
    fetchRequest()
  }, [])

  const fetchRequest = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await getMyrequest()
      setRequest(result.data || [])
    } catch (err) {
      console.error("Error fetching requests:", err)
      setError("gagal memuat data")
      toast.error("Gagal memuat data request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRowClick = (item) => {
    setSelectedRequest(item)
    setIsDetailOpen(true)
  }

  const handleDelete = async (e, item) => {
    e.stopPropagation()
    if (!confirm(`Yakin batalkan request "${item.reason}"?`)) return

    try {
      await cancelOvertimeRequest(item.id)
      toast.success("Request berhasil dibatalkan!")
      fetchRequest()
    } catch (err) {
      const message = err.response?.data?.message || "Gagal membatalkan request"
      toast.error(message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
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
            count: request.filter((r) => r.status === "PENDING" || r.status === "PARTIALLY_APPROVED").length,
            label: "Pending",
            bgColor: "bg-amber-50",
          },
          {
            icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
            count: request.filter((r) => r.status === "APPROVED").length,
            label: "Approved",
            bgColor: "bg-emerald-50",
          },
          {
            icon: <XCircle className="h-4 w-4 text-red-600" />,
            count: request.filter((r) => r.status === "REJECTED" || r.status === "CANCELLED").length,
            label: "Rejected",
            bgColor: "bg-red-50",
          },
        ]}
      />

      <CreateRequestModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={fetchRequest}
      />

      <DetailRequestModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        request={selectedRequest}
      />

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
      ) : request.length === 0 ? (
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
                  {request.map((item) => (
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
                              onClick={(e) => handleDelete(e, item)}
                            >
                              <Trash2 className="w-3 h-3" />
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
    </div>
  )
}

export default OvertimeRequestPage
