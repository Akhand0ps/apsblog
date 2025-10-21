export function Footer() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-6xl px-6 pb-12">
      <div className="glass-panel flex flex-col gap-4 rounded-3xl px-6 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} apsblog Akhand Pratap Singh.</span>
        <div className="flex flex-wrap gap-4">
          <a href="#top" className="transition hover:text-white">
            Home
          </a>
          <a href="#posts" className="transition hover:text-white">
            Posts
          </a>
          <a href="#contact" className="transition hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
