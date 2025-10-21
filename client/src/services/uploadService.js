import { apiClient } from '../lib/apiClient.js'

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  const { data } = await apiClient.post('/api/v1/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data
}
