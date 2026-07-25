import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { XCircle } from "lucide-react"

const RejectModal = ({ open, onOpenChange, request, onReject }) => {
  const [note, setNote] = useState("")

  const handleClose = () => {
    setNote("")
    onOpenChange(false)
  }

  const handleReject = () => {
    onReject(request, note)
    setNote("")
  }

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tolak Request</DialogTitle>
          <DialogDescription>
            Berikan alasan penolakan untuk request dari{" "}
            <span className="font-medium text-foreground">{request.requesterName}</span>.
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
            <Label htmlFor="rejectNote">Alasan Penolakan *</Label>
            <Textarea
              id="rejectNote"
              placeholder="Masukkan alasan penolakan..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleReject}
              disabled={!note.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Ya, Tolak
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

export default RejectModal
