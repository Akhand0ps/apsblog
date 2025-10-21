import { Disclosure } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const profileImage = 'https://github.com/Akhand0ps.png'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const goHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const goContact = () => {
    if (location.pathname === '/') {
      const target = document.querySelector('#contact')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate('/#contact')
    }
  }

  const primaryLabel = user ? 'Dashboard' : 'Login'
  const handlePrimary = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <Disclosure as="nav" className="sticky top-4 z-40 w-full">
      {({ open, close }) => (
        <div className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 text-sm">
          <button
            type="button"
            onClick={goHome}
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="inline-flex h-9 w-9 overflow-hidden rounded-full border border-white/10 shadow-lg">
              <img src={profileImage} alt="Akhand Pratap Singh" className="h-full w-full object-cover" loading="lazy" />
            </span>
            <span className="text-base text-white/90">αρѕ вℓσg </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={goContact}
              className="gradient-accent inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-white shadow-lg shadow-purple-500/30"
            >
              Get in touch
            </button>
            <button
              type="button"
              onClick={handlePrimary}
              className="rounded-full border border-white/10 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
            >
              {primaryLabel}
            </button>
          </div>

          <Disclosure.Button className="flex items-center justify-center rounded-full bg-white/10 p-2 text-white md:hidden">
            <span className="sr-only">Open main menu</span>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Disclosure.Button>

          <Disclosure.Panel className="glass-panel absolute left-0 right-0 top-14 mx-auto mt-3 w-11/12 rounded-3xl px-6 py-6 md:hidden">
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => {
                  goContact()
                  close()
                }}
                className="gradient-accent inline-flex items-center justify-center rounded-2xl px-4 py-2 text-base font-medium text-white"
              >
                Get in touch
              </button>
              <button
                type="button"
                onClick={() => {
                  handlePrimary()
                  close()
                }}
                className="rounded-2xl border border-white/10 px-4 py-2 text-base text-white/80 transition hover:border-white/30 hover:text-white"
              >
                {primaryLabel}
              </button>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
