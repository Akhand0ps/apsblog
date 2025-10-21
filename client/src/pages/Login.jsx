import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { motion } from 'framer-motion'

const MotionHeader = motion.div

export function Login() {
  const { login, user, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const from = location.state?.from?.pathname ?? '/dashboard'

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Login failed', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 rounded-3xl border border-white/5 bg-white/5 px-8 py-10 text-white">
      <MotionHeader initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-semibold">Admin login</h1>
        <p className="mt-2 text-sm text-white/70">Enter the credentials you configured for the APS Blog API server.</p>
      </MotionHeader>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/70">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
            placeholder="admin@yourdomain.com"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/70">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
            placeholder="Secure password"
          />
        </label>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="gradient-accent inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
