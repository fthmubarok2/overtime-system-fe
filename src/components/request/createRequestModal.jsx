import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { createOvertimeRequest } from "@/services/overtime"
import { toast } from "sonner"

const CreateRequestModal = ({ open, onOpenChange, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState([
    { overtimeDate: "", startTime: "", endTime: "", activity: "" }
  ])

  const addDetail = () => {
    setDetails([...details, { overtimeDate: "", startTime: "", endTime: "", activity: "" }])
  }

  const removeDetail = (index) => {
    setDetails(details.filter((_, i) => i !== index))
  }

  const updateDetail = (index, field, value) => {
    const updated = details.map((detail, i) =>
      i === index ? { ...detail, [field]: value } : detail
    )
    setDetails(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await createOvertimeRequest({ reason, details })
      toast.success("Request berhasil dibuat!")
      setReason("")
      setDetails([{ overtimeDate: "", startTime: "", endTime: "", activity: "" }])
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      const message = err.response?.data?.message || "Gagal submit request"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (open) => {
    setError("")
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-none w-[95vw] sm:w-[50vw] h-[90vh] sm:h-[75vh]  flex flex-col">
        <DialogHeader>
          <DialogTitle>Create OT Request</DialogTitle>
          <DialogDescription>Submit a new overtime request for approval</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 mt-4">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-2 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Input
              id="reason"
              placeholder="Short reason for overtime..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Details *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addDetail}>
                <Plus className="w-3 h-3 mr-1" />
                Add Day
              </Button>
            </div>

            {details.map((detail, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Day {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-600 bg-amber-50 rounded-md px-2 py-1 text-right leading-tight">
                      Jam lembur: 17:00 - 22:00
                      <br />Min 1 jam/hari
                    </span>
                    {details.length > 1 && (
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeDetail(index)}>
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Date *</Label>
                  <Input
                    type="date"
                    value={detail.overtimeDate}
                    onChange={(e) => updateDetail(index, "overtimeDate", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Start Time *</Label>
                    <Input
                      type="time"
                      value={detail.startTime}
                      onChange={(e) => updateDetail(index, "startTime", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs">End Time *</Label>
                    <Input
                      type="time"
                      value={detail.endTime}
                      onChange={(e) => updateDetail(index, "endTime", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Activity *</Label>
                  <Textarea
                    placeholder="Describe what you did..."
                    rows={2}
                    value={detail.activity}
                    onChange={(e) => updateDetail(index, "activity", e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateRequestModal