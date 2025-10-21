import { Github, Linkedin, Mail, NotebookPen } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionPanel = motion.div

const githubAvatar = 'https://github.com/Akhand0ps.png'
const linkedinAvatar = githubAvatar

const contactLinks = [
  {
    id: 'github',
    href: 'https://github.com/Akhand0ps',
    label: 'GitHub',
    handle: '@Akhand0ps',
    description: 'Source code, experiments, and project history.',
    icon: Github,
    avatar: githubAvatar,
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/akhand-pratap-singh-286770275/',
    label: 'LinkedIn',
    handle: 'Akhand Pratap Singh',
    description: 'Professional updates and collaboration opportunities.',
    icon: Linkedin,
    avatar: linkedinAvatar,
  },
]

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 pb-24">
      <MotionPanel
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="glass-panel relative overflow-hidden rounded-3xl p-8"
      >
        <div className="absolute -right-32 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-500/20 via-cyan-400/20 to-transparent blur-3xl md:block" />
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-xl flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/10">
                <img src={githubAvatar} alt="Akhand Pratap Singh" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                  <NotebookPen className="h-3 w-3" />
                  Author
                </span>
                <h2 className="mt-2 text-3xl font-semibold text-white">Connect with Akhand Pratap Singh</h2>
              </div>
            </div>
            <p className="text-base text-white/70">
              Share feedback, pitch collaborations, or follow along as new features ship.
            </p>
            <a
              href="mailto:akhandps041@gmail.com"
              className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
            >
              <Mail className="h-4 w-4" /> akhandps041@gmail.com
            </a>
          </div>
          <div className="flex w-full flex-col gap-4 md:max-w-sm">
            {contactLinks.map(({ id, href, label, handle, description, icon: Icon, avatar }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-white/30 hover:bg-white/10"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10">
                  <img src={avatar} alt={`${label} avatar`} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-white/80" />
                    <span className="text-sm font-semibold text-white">{label}</span>
                  </div>
                  <span className="text-sm text-white/70">{handle}</span>
                  <span className="text-xs text-white/50">{description}</span>
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-white/50 transition group-hover:text-white/70">Visit</span>
              </a>
            ))}
          </div>
        </div>
      </MotionPanel>
    </section>
  )
}
