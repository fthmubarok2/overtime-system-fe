import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMyProfile, updateMyProfile } from "@/services/user"
import useAuthStore from "@/store/authStore"
import { toast } from "sonner"

/**
 * Custom Hook untuk manajemen data profil user
 * @param {boolean} enabled - Kontrol apakah query aktif (misal saat modal terbuka)
 */
export const useMyProfile = (enabled = true) => {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)
  const storeUser = useAuthStore((state) => state.user)

  // Fetch profil (queryKey ["my-profile"])
  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
    enabled: enabled && Boolean(token),
    staleTime: 1000 * 60 * 30, // Profil diset fresh selama 30 menit
  })

  // Update profil mutation
  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (responseBody, variables) => {
      toast.success("Profil berhasil diupdate!")
      const updatedUser = responseBody?.data

      // Update global auth store
      setAuth(token, {
        ...storeUser,
        name: updatedUser?.name || variables.name,
        email: updatedUser?.email || variables.email,
        username: updatedUser?.username || variables.username,
      })

      // Invalidate cache profil agar selalu sinkron
      queryClient.invalidateQueries({ queryKey: ["my-profile"] })
    },
  })

  return {
    ...profileQuery,
    user: profileQuery.data?.data,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  }
}
