import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCcw, Trash2 } from 'lucide-react'
import { deleteBlog, fetchBlogs } from '../services/blogService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { motion } from 'framer-motion'

const MotionCard = motion.div

export function Dashboard() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const loadBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchBlogs({ limit: 100 })
      setBlogs(response.data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const handleDelete = async (slug) => {
    const confirmation = window.confirm('Delete this post permanently?')
    if (!confirmation) return
    try {
      await deleteBlog(slug)
      await loadBlogs()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="glass-panel flex flex-col gap-6 rounded-3xl px-8 py-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Publishing cockpit</h1>
          <p className="text-sm text-white/70">Manage drafts, publish new stories, and keep your archive fresh.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadBlogs}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate('/editor/new')}
            className="gradient-accent inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30"
          >
            <Plus className="h-4 w-4" />
            New post
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center text-white/70">Loading posts...</div>
      ) : blogs.length ? (
        <div className="grid gap-4">
          {blogs.map((post) => {
            const summary = post.content ? post.content.replace(/<[^>]+>/g, '').slice(0, 200) : ''

            return (
              <MotionCard
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-3xl border border-white/5 bg-white/5"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  {post.imageUrl?.[0] ? (
                    <img src={post.imageUrl[0]} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/50">
                      No cover image
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-2xl">
                    <h2 className="text-lg font-semibold text-white">{post.title}</h2>
                    {summary ? <p className="mt-2 text-sm text-white/60">{summary}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="rounded-full border border-white/10 px-4 py-2 text-white/70 transition hover:border-white/30 hover:text-white"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/editor/${post.slug}`)}
                      className="rounded-full border border-white/10 px-4 py-2 text-white/70 transition hover:border-white/30 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.slug)}
                      className="inline-flex items-center gap-2 rounded-full border border-red-400/30 px-4 py-2 text-red-300 transition hover:border-red-400/60 hover:text-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </MotionCard>
            )
          })}
        </div>
      ) : (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-3xl border border-white/5 bg-white/5 p-8 text-center text-white/70">
          <span>No posts yet. Start crafting your first story.</span>
          <button
            type="button"
            onClick={() => navigate('/editor/new')}
            className="gradient-accent inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30"
          >
            <Plus className="h-4 w-4" />
            Create your first post
          </button>
        </div>
      )}
    </div>
  )
}
