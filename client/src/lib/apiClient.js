import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      error.message = error.response.data?.error ?? error.message
    }
    return Promise.reject(error)
  },
)
