import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle } from "lucide-react"

const ApprovalModal = ({ 
  open, 
  onOpenChange, 
  request, 
  type, // "approve" | "reject"
  onConfirm,
  isLoading = false,
}) => {
  const [note, setNote] = useState("")

  const isApprove = type === "approve"

  const handleClose = () => {
    setNote("")
    onOpenChange(false)
  }

  const handleConfirm = () => {
    const payload = {
      status: isApprove ? "APPROVE" : "REJECT",
      note: note || undefined
    }
    onConfirm(request, payload)
    setNote("")
  }

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] max-w-[400px] sm:max-w-[420px] lg:max-w-[440px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-semibold text-center sm:text-xl">
            {isApprove ? "Konfirmasi Approve" : "Tolak Request"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground sm:text-base">
            {isApprove ? (
              <>
                Apakah Anda yakin ingin menyetujui request dari{" "}
                <span className="font-medium text-foreground">{request.requesterName}</span>?
              </>
            ) : (
              <>
                Berikan alasan penolakan untuk request dari{" "}
                <span className="font-medium text-foreground">{request.requesterName}</span>.
              </>
            )}
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
            <Label htmlFor="actionNote">
              {isApprove ? "Catatan (opsional)" : "Alasan Penolakan *"}
            </Label>
            <Textarea
              id="actionNote"
              placeholder={
                isApprove 
                  ? "Tambahkan catatan jika diperlukan..." 
                  : "Masukkan alasan penolakan..."
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={isApprove ? 3 : 4}
            />
          </div>

          <div className="flex flex-row gap-2 pt-6 sm:gap-3">
            {isApprove ? (
              <Button
                variant="default"
                className="flex-1 h-9 text-xs sm:h-10 sm:text-sm lg:h-12 lg:text-base bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleConfirm}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Ya, Approve
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="flex-1 h-9 text-xs sm:h-10 sm:text-sm lg:h-12 lg:text-base"
                onClick={handleConfirm}
                disabled={!note.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Ya, Tolak
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 h-9 text-xs sm:h-10 sm:text-sm lg:h-12 lg:text-base"
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

export default ApprovalModal