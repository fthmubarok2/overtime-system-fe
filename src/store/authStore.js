import { create } from "zustand"

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),

  checkAuth: () => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (token) {
      set({
        token,
        user: user ? JSON.parse(user) : null,
      })
    }
  },

  setAuth: (token, user) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    set({ token: null, user: null })
  },
}))

export default useAuthStore