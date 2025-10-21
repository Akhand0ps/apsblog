import { apiClient } from '../lib/apiClient.js'

export async function fetchBlogs(params = {}) {
  const { data } = await apiClient.get('/api/v1/blog/blogs', { params })
  return data
}

export async function fetchBlogBySlug(slug) {
  const { data } = await apiClient.get(`/api/v1/blog/${slug}`)
  return data
}

export async function searchBlogs(query) {
  const { data } = await apiClient.get('/api/v1/blog/search', {
    params: { q: query },
  })
  return data
}

export async function createBlog(payload) {
  const { data } = await apiClient.post('/api/v1/blog/create', payload)
  return data
}

export async function updateBlog(slug, payload) {
  const { data } = await apiClient.put(`/api/v1/blog/update/${slug}`, payload)
  return data
}

export async function deleteBlog(slug) {
  const { data } = await apiClient.delete(`/api/v1/blog/delete/${slug}`)
  return data
}
