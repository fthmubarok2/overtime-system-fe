import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, XCircle, Ban } from "lucide-react"

const getStatusBadge = (status) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3" />
          Approved
        </Badge>
      )
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      )
    case "PARTIALLY_APPROVED":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      )
    case "REJECTED":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>
      )
    case "CANCELLED":
      return (
        <Badge className="bg-gray-100 text-gray-700 border-gray-200">
          <Ban className="w-3 h-3" />
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export { getStatusBadge }
