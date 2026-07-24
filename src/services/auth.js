import api from "./api"

export const login = async (username, password) => {
   const response = await api.post("/auth/login", { username, password })
   return response.data
}

// export const logout = () => {
//   return api.post("/auth/logout")
// }
