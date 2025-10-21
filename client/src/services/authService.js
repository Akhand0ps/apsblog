import { apiClient } from '../lib/apiClient.js'

export async function login(credentials) {
  const { data } = await apiClient.post('/api/v1/auth/login', credentials)
  return data
}

export async function fetchMe() {
  const { data } = await apiClient.get('/api/v1/auth/me')
  return data
}
