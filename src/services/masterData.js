import api from "./api"

export const getAllDepartments = async () => {
  const response = await api.get("/departments")
  return response.data
}

export const getAllRoles = async () => {
  const response = await api.get("/roles")
  return response.data
}