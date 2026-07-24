import { CheckCircle, XCircle, Clock } from "lucide-react"

const ApprovePage = () => {
  return (
    <div className="space-y-6">
      <div>
        {/* TODO: ganti judul berdasarkan role (Validator: Pending Requests, Approver: Partially Approved) */}
        <h2 className="text-2xl font-bold">Approval Queue</h2>
        <p className="text-sm text-muted-foreground">Review dan proses overtime request</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-xl bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              {/* TODO: isi dari API */}
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="border rounded-xl bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Approved Today</p>
            </div>
          </div>
        </div>
        <div className="border rounded-xl bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Rejected Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left px-4 py-3 font-medium">Pemohon</th>
              <th className="text-left px-4 py-3 font-medium">Tanggal</th>
              <th className="text-left px-4 py-3 font-medium">Alasan</th>
              <th className="text-left px-4 py-3 font-medium">Total Jam</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: map data dari API (pending/partially-approved) ke row */}

            {/* Contoh row */}
            <tr className="border-b hover:bg-muted/50 cursor-pointer">
              <td className="px-4 py-3">Andi Pratama</td>
              <td className="px-4 py-3">23 Jul 2025</td>
              <td className="px-4 py-3 max-w-[200px] truncate">Critical bug fixes before release</td>
              <td className="px-4 py-3">3j 0m</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="h-3 w-3" />
                  Pending
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-1 justify-end">
                  {/* TODO: onClick → panggil API approve */}
                  <button className="h-8 px-3 rounded-md bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 hover:bg-emerald-600 transition-colors">
                    <CheckCircle className="h-3 w-3" />
                    Approve
                  </button>
                  {/* TODO: onClick → buka dialog reject */}
                  <button className="h-8 px-3 rounded-md bg-red-500 text-white text-xs font-medium flex items-center gap-1 hover:bg-red-600 transition-colors">
                    <XCircle className="h-3 w-3" />
                    Reject
                  </button>
                </div>
              </td>
            </tr>

            {/* Empty state — tampilkan jika tidak ada data */}
            {/* <tr>
              <td colSpan="6" className="text-center py-12 text-muted-foreground">
                Tidak ada request yang perlu diproses.
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>

      {/* TODO: Reject Dialog — muncul saat klik Reject, ada input note */}
    </div>
  )
}

export default ApprovePage
