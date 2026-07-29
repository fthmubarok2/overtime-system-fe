import api from "./api"

export const register = async (data) => {
  const response = await api.post("/users/register", data)
  return response.data
}

export const getMyProfile = async () => {
  const response = await api.get("/users/my-account")
  return response.data
}

export const updateMyProfile = async (data) => {
  const response = await api.put("/users/profile-update", data)
  return response.data
}

export const getAllUsers = async () => {
  const response = await api.get("/users")
  return response.data
}

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const updateUserByAdmin = async ({ id, ...data }) => {
  const response = await api.put(`/users/${id}`, data)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`)
  return response.data
}

export const restoreUser = async (id) => {
  const response = await api.post(`/users/${id}/restore`)
  return response.data
}