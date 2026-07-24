import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { getMyrequest, cancelOvertimeRequest } from "@/services/overtime"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStatusBadge } from "@/lib/statusBadge"
import CreateRequestModal from "@/components/request/createRequestModal"
import DetailRequestModal from "@/components/request/DetailRequestModal"
import { toast } from "sonner"

const MyRequestsPage = () => {
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
      const result = await getMyrequest()
      setRequest(result.data)
    } catch (err) {
      setError("gagal memuat data")
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold">My Overtime Requests</h2>
          <p className="text-sm text-muted-foreground">Submit and track your overtime requests</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New OT Request
        </Button>
      </div>

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

      {request.length === 0 ? (
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
                      className="cursor-pointer"
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

export default MyRequestsPage
