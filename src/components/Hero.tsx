import { motion } from 'framer-motion'
import type { Profile } from '../data/schema'
import { fadeUp } from './Section'

export default function Hero({ profile }: { profile: Profile }) {
  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  const primaryLinks = profile.links.filter((l) => /linkedin|github/i.test(l.label)).slice(0, 2)

  return (
    <section id="top" className="bg-bg pt-14 pb-16">
      <motion.div initial="hidden" animate="show" className="container-narrow flex flex-col items-center text-center">
        <motion.h1 variants={fadeUp} custom={0} className="text-3xl font-extrabold tracking-tight">
          {profile.headline}
        </motion.h1>
        <motion.p variants={fadeUp} custom={1} className="mt-4 max-w-2xl text-lg text-fg-muted">
          {profile.tagline}
        </motion.p>

        <motion.div variants={fadeUp} custom={2} className="relative mt-10">
          <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-mint opacity-60 blur-2xl" aria-hidden />
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-40 w-40 rounded-full border-4 border-bg object-cover shadow-card"
            />
          ) : (
            <div className="grid h-40 w-40 place-items-center rounded-full bg-accent text-4xl font-extrabold text-on-accent shadow-card">
              {initials}
            </div>
          )}
        </motion.div>

        <motion.p variants={fadeUp} custom={3} className="mt-6 text-xl font-semibold">
          {profile.name}
        </motion.p>
        <motion.p variants={fadeUp} custom={3} className="mt-1 flex items-center gap-2 text-sm text-fg-subtle">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {profile.availability} · {profile.location}
        </motion.p>

        <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#proyectos" className="btn-primary hover:scale-[1.03]">
            Ver proyectos
          </a>
          {primaryLinks.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="btn-outline hover:bg-accent-soft">
              {l.label}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
