import api from "./api";

export const getMyrequest = async () => {
    const response = await api.get("/overtime/my-requests")
    return response.data
}

export const createOvertimeRequest = async (data) => {
    const response = await api.post("/overtime", data)
    return response.data
}

export const getOvertimeDetail = async (id) => {
    const response = await api.get(`/overtime/${id}/details`)
    return response.data
}

export const cancelOvertimeRequest = async (id) => {
    const response = await api.put(`/overtime/${id}/cancel`)
    return response.data
}