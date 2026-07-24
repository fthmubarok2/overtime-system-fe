import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, XCircle, FileText, AlertCircle } from "lucide-react"
import { getMyrequest } from "@/services/overtime"
import { getStatusBadge } from "@/lib/statusBadge"
import { useNavigate } from "react-router-dom"

const DashboardPage = () => {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await getMyrequest()
      setRequests(result.data)
    } catch (err) {
      console.error("Gagal ambil data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const total = requests.length
  const pending = requests.filter((r) => r.status === "PENDING").length
  const partiallyApproved = requests.filter((r) => r.status === "PARTIALLY_APPROVED").length
  const approved = requests.filter((r) => r.status === "APPROVED").length
  const rejected = requests.filter((r) => r.status === "REJECTED").length

  const stats = [
    { title: "Total Requests", value: total, icon: FileText, color: "text-blue-500" },
    { title: "Pending", value: pending, icon: Clock, color: "text-yellow-500" },
    { title: "Partially Approved", value: partiallyApproved, icon: AlertCircle, color: "text-blue-500" },
    { title: "Approved", value: approved, icon: CheckCircle, color: "text-green-500" },
    { title: "Rejected", value: rejected, icon: XCircle, color: "text-red-500" },
  ]

  const recentRequests = requests.slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of overtime requests</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "-" : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <button
              onClick={() => navigate("/requests")}
              className="text-sm text-primary hover:underline"
            >
              Lihat Semua
            </button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : recentRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recent requests to display
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Reason</TableHead>
                      <TableHead className="text-center">Total Hours</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRequests.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{item.reason}</TableCell>
                        <TableCell className="text-center">{item.totalHoursDisplay}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
