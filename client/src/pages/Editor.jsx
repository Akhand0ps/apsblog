import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchBlogBySlug, createBlog, updateBlog } from '../services/blogService.js'
import { uploadImage } from '../services/uploadService.js'
import { motion } from 'framer-motion'

const MotionIntro = motion.div

function sanitizeContent(raw) {
  return raw.replace(/\n/g, '<br />')
}

const normalizeUploadError = (error) => {
  const responseData = error?.response?.data
  if (responseData) {
  if (typeof responseData === 'object') {
    return responseData.error ?? responseData.message ?? error.message
  }

  if (typeof responseData === 'string') {
    if (/file too large/i.test(responseData)) {
    return 'File too large — please choose an image under 5 MB.'
    }

    const match = responseData.match(/MulterError:\s*([^<\n]+)/i)
    if (match?.[1]) {
    return match[1].trim()
    }

    const stripped = responseData.replace(/<[^>]*>/g, '').trim()
    if (stripped) return stripped
  }
  }

  if (/file too large/i.test(error?.message ?? '')) {
  return 'File too large — please choose an image under 5 MB.'
  }

  return error?.message ?? 'Upload failed. Please try again.'
}

export function Editor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isNew = slug === 'new'

  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: [],
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: null, message: '' })

  useEffect(() => {
    let ignore = false

    async function load() {
      if (isNew) return
      try {
        setLoading(true)
        const response = await fetchBlogBySlug(slug)
        if (ignore) return
        const data = response.data
        setForm({
          title: data.title ?? '',
          content: data.content ?? '',
          imageUrl: data.imageUrl ?? [],
        })
      } catch (err) {
        setFeedback({ type: 'error', message: err.message })
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [slug, isNew])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddImage = (url) => {
    const clean = url.trim()
    if (!clean) return
    setForm((prev) => ({
      ...prev,
      imageUrl: prev.imageUrl.includes(clean) ? prev.imageUrl : [...prev.imageUrl, clean],
    }))
  }

  const handleRemoveImage = (index) => {
    setForm((prev) => ({ ...prev, imageUrl: prev.imageUrl.filter((_, idx) => idx !== index) }))
  }

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setFeedback({ type: null, message: '' })
  const response = await uploadImage(file)
  const uploadedUrl = response?.url ?? response?.data?.url ?? response?.data?.uri
      if (uploadedUrl) {
        handleAddImage(uploadedUrl)
        setFeedback({ type: 'success', message: 'Image uploaded to Cloudinary.' })
      } else {
        setFeedback({ type: 'error', message: 'Upload succeeded but no image URL was returned.' })
      }
    } catch (err) {
      console.error('Image upload failed', err)
      setFeedback({ type: 'error', message: normalizeUploadError(err) })
    } finally {
      event.target.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFeedback({ type: null, message: '' })
    try {
      const payload = {
        title: form.title,
        content: form.content.includes('<') ? form.content : sanitizeContent(form.content),
        imageUrl: form.imageUrl,
      }

      if (isNew) {
        await createBlog(payload)
        setFeedback({ type: 'success', message: 'Post published successfully.' })
      } else {
        await updateBlog(slug, payload)
        setFeedback({ type: 'success', message: 'Post updated successfully.' })
      }

      navigate('/dashboard')
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-panel mx-auto max-w-4xl rounded-3xl px-8 py-12 text-center text-white/70">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="glass-panel mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl px-8 py-8 text-white">
      <MotionIntro initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-semibold">{isNew ? 'Compose a new post' : 'Edit post'}</h1>
        <p className="mt-2 text-sm text-white/70">
          Title, rich content, and visuals flow through the API and Cloudinary integration you configured.
        </p>
      </MotionIntro>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/70">Title</span>
          <input
            type="text"
            required
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
            placeholder="Designing a sovereign publishing flow"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/70">Content (HTML or Markdown-style)</span>
          <textarea
            rows={12}
            required
            value={form.content}
            onChange={(event) => handleChange('content', event.target.value)}
            className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-relaxed text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
            placeholder="Craft your narrative here..."
          />
          <span className="text-xs text-white/50">
            If you paste Markdown, basic formatting gets transformed into HTML line breaks automatically.
          </span>
        </label>

        <div className="grid gap-4 rounded-3xl border border-white/10 bg-black/15 p-5">
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-white/70">Image gallery</span>
            <div className="flex flex-wrap gap-3">
              {form.imageUrl.length ? (
                form.imageUrl.map((url, index) => (
                  <div
                    key={url}
                    className="group relative h-24 w-24 overflow-hidden rounded-2xl border border-white/10"
                  >
                    <img src={url} alt="uploaded" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute inset-0 hidden items-center justify-center bg-black/70 text-xs font-semibold text-white transition group-hover:flex"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-white/50">No images yet.</span>
              )}
            </div>
          </div>

          <label className="flex flex-col gap-2 text-sm">
            <span className="text-white/70">Upload from device</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-white/30 focus:outline-none"
            />
          </label>
        </div>

        {feedback.message ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${feedback.type === 'error' ? 'border border-red-400/20 bg-red-400/10 text-red-300' : 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-200'}`}
          >
            {feedback.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="gradient-accent inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : isNew ? 'Publish post' : 'Update post'}
          </button>
        </div>
      </form>
    </div>
  )
}
