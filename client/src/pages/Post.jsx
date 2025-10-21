import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchBlogBySlug } from '../services/blogService.js'
import { format } from 'date-fns'

export function Post() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        const response = await fetchBlogBySlug(slug)
        if (!ignore) {
          setPost(response.data)
          setError(null)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="glass-panel mx-auto mt-16 max-w-4xl rounded-3xl px-8 py-12 text-center text-white/70">
        Loading story...
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="glass-panel mx-auto mt-16 max-w-3xl rounded-3xl px-8 py-12 text-center text-white/70">
        {error ?? 'Post not found.'}
      </div>
    )
  }

  const formattedDate = post.createdAt ? format(new Date(post.createdAt), 'PPP') : 'Draft'

  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-white/5 bg-white/5 px-8 py-10 text-white">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
          <span>APS BLOG</span>
          <span>{formattedDate}</span>
        </div>
        <h1 className="text-3xl font-semibold md:text-4xl">{post.title}</h1>
        <p className="text-white/70">{post.excerpt ?? ''}</p>
        {post.imageUrl?.[0] ? (
          <img
            src={post.imageUrl[0]}
            alt={post.title}
            className="mt-6 w-full rounded-3xl border border-white/10 object-cover"
          />
        ) : null}
      </header>

      <section className="blog-content">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </section>

      {post.imageUrl?.length > 1 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {post.imageUrl.slice(1).map((url) => (
            <img key={url} src={url} alt={post.title} className="w-full rounded-3xl border border-white/10 object-cover" />
          ))}
        </div>
      ) : null}
    </article>
  )
}
