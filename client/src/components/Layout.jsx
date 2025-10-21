import { Outlet, useLocation } from 'react-router-dom'
import { Contact } from './Contact.jsx'
import { Footer } from './Footer.jsx'
import { Navbar } from './Navbar.jsx'

export function Layout({ withContact = true }) {
  const location = useLocation()
  const showContact = withContact && location.pathname === '/'

  return (
    <div className="relative isolate min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-line opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#0b0f20] via-[#0e1529] to-[#06070f]" aria-hidden="true" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-8 px-4 pb-10 pt-8 md:px-8">
        <Navbar />
        <main className="flex flex-1 flex-col gap-8">
          <Outlet />
        </main>
        {showContact ? <Contact /> : null}
        <Footer />
      </div>
    </div>
  )
}
