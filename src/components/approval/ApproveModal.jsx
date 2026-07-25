import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

const ApproveModal = ({ open, onOpenChange, request, onApprove }) => {
  const [note, setNote] = useState("")

  const handleClose = () => {
    setNote("")
    onOpenChange(false)
  }

  const handleApprove = () => {
    onApprove(request, note || undefined)
    setNote("")
  }

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Approve</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menyetujui request dari{" "}
            <span className="font-medium text-foreground">{request.requesterName}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="p-3 rounded-md bg-gray-50 text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Reason: </span>
              <span className="font-medium">{request.reason}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Total Hours: </span>
              <span className="font-medium">{request.totalHoursDisplay}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approveNote">Catatan (opsional)</Label>
            <Textarea
              id="approveNote"
              placeholder="Tambahkan catatan jika diperlukan..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleApprove}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Ya, Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveModal
