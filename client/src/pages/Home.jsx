import { useEffect, useMemo, useState } from 'react'
import { fetchBlogs } from '../services/blogService.js'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const PAGE_SIZE = 4

const buildExcerpt = (post) => {
  if (post.excerpt?.trim()) return post.excerpt.trim()
  if (post.content) {
    const plain = post.content.replace(/<[^>]+>/g, '').trim()
    if (!plain) return ''
    return plain.length > 220 ? `${plain.slice(0, 220)}…` : plain
  }
  return ''
}

export function Home() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedPosts, setExpandedPosts] = useState(() => new Set())
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const response = await fetchBlogs()
        if (!ignore) {
          setBlogs(response.data ?? [])
        }
      } catch (err) {
        console.error('Failed to fetch blogs', err)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [blogs.length])

  useEffect(() => {
    setExpandedPosts(new Set())
  }, [page])

  useEffect(() => {
    if (!location.hash) return
    const target = document.querySelector(location.hash)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((blogs?.length ?? 0) / PAGE_SIZE))
  }, [blogs])

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return blogs.slice(start, start + PAGE_SIZE)
  }, [blogs, page])

  const toggleExpand = (id) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const goToPage = (nextPage) => {
    setPage((current) => {
      if (nextPage < 1) return current
      if (nextPage > totalPages) return current
      return nextPage
    })
  }

  return (
    <>
      <div id="top" />
      <section className="mx-auto max-w-4xl px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-white/70">Loading posts…</div>
        ) : paginatedPosts.length ? (
          paginatedPosts.map((post) => {
            const postId = post._id ?? post.slug ?? post.title
            const isExpanded = expandedPosts.has(postId)
            const excerpt = buildExcerpt(post)
            const firstImage = post.imageUrl?.[0]

            return (
              <article key={postId} id={post.slug ? `post-${post.slug}` : undefined} className="mb-16">
                <header className="mb-4">
                  <h1 className="text-3xl font-bold text-white">{post.title}</h1>
                  <div className="mt-2 text-sm text-white/60">
                    {post.readTime ?? new Date(post.createdAt ?? Date.now()).toLocaleDateString()}
                  </div>
                </header>
                {firstImage ? (
                  <img src={firstImage} alt={post.title} className="mb-6 w-full rounded-lg object-cover" loading="lazy" />
                ) : null}
                <div className="prose max-w-none text-white/90">
                  {isExpanded ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content ?? '<p>No content</p>' }} />
                  ) : (
                    <p>{excerpt || 'No preview available yet.'}</p>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <button
                    type="button"
                    onClick={() => toggleExpand(postId)}
                    className="rounded-full border border-white/15 px-4 py-1.5 transition hover:border-white/40 hover:text-white"
                  >
                    {isExpanded ? 'Collapse post' : 'Read full post'}
                  </button>
                  {post.slug ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="rounded-full border border-white/15 px-4 py-1.5 transition hover:border-white/40 hover:text-white"
                    >
                      Open dedicated view
                    </button>
                  ) : null}
                  {user && post.slug ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/editor/${post.slug}`)}
                      className="rounded-full border border-white/15 px-4 py-1.5 transition hover:border-white/40 hover:text-white"
                    >
                      Edit post
                    </button>
                  ) : null}
                </div>
              </article>
            )
          })
        ) : (
          <div className="flex items-center justify-center py-16 text-white/70">No posts available.</div>
        )}

        {totalPages > 1 ? (
          <nav className="mt-10 flex items-center justify-center gap-6 text-white/80">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="rounded-full border border-white/15 px-4 py-1.5 transition enabled:hover:border-white/40 enabled:hover:text-white disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="rounded-full border border-white/15 px-4 py-1.5 transition enabled:hover:border-white/40 enabled:hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        ) : null}
      </section>
    </>
  )
}
