import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="glass-panel mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl px-8 py-12 text-center text-white">
      <span className="text-sm uppercase tracking-[0.3em] text-white/50">404</span>
      <h1 className="text-3xl font-semibold">This page drifted off</h1>
      <p className="text-white/70">
        The URL you opened does not exist. Head back to the dashboard or explore the latest stories.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="gradient-accent inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30"
        >
          Return home
        </button>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
        >
          Dashboard
        </button>
      </div>
    </div>
  )
}
