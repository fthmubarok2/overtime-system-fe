import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const ActionModal = ({
  open,
  onOpenChange,
  actionType,
  item,
  onConfirm,
  isLoading = false,
}) => {
  const getConfig = () => {
    switch (actionType) {
      case "cancel":
        return {
          title: "Batalkan Request",
          description: `Yakin ingin membatalkan request "${item?.reason}"?`,
          confirmText: "Ya, Batalkan",
          variant: "destructive",
        }
      case "delete":
        return {
          title: "Hapus User",
          description: `Yakin ingin menghapus user "${item?.name}"?`,
          confirmText: "Ya, Hapus",
          variant: "destructive",
        }
      case "restore":
        return {
          title: "Restore User",
          description: `Yakin ingin merestore user "${item?.name}"?`,
          confirmText: "Ya, Restore",
          variant: "default",
        }
      case "logout":
        return {
          title: "Konfirmasi Logout",
          description: "Yakin ingin keluar dari aplikasi?",
          confirmText: "Ya, Logout",
          variant: "destructive",
        }
      default:
        return {
          title: "Konfirmasi",
          description: "Apakah Anda yakin?",
          confirmText: "Konfirmasi",
          variant: "destructive",
        }
    }
  }

  const config = getConfig()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[400px] sm:max-w-[420px] lg:max-w-[440px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-semibold text-center sm:text-xl">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground sm:text-base">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-2 pt-6 sm:gap-3">
          <Button
            variant={config.variant}
            className="flex-1 h-9 text-xs sm:h-10 sm:text-sm lg:h-12 lg:text-base"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : config.confirmText}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-9 text-xs sm:h-10 sm:text-sm lg:h-12 lg:text-base"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ActionModal