import api from './api'

const extractData = (response) => {
  if (response.data?.data !== undefined) {
    return response.data.data
  }
  return response.data
}

export const processApproval = async (id, data) => {
  const response = await api.post(`/approvals/process/${id}`, data)
  return extractData(response)
}

export const getPendingRequests = async () => {
  const response = await api.get('/approvals/pending')
  return extractData(response)
}

export const getPartiallyApprovedRequests = async () => {
  const response = await api.get('/approvals/partially-approved')
  return extractData(response)
}

export const getApprovalDetail = async (id) => {
  const response = await api.get(`/approvals/${id}/details`)
  return extractData(response)
}