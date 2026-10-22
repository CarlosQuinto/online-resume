import { motion } from 'framer-motion'
import type { Profile } from '../data/schema'
import { fadeUp } from './Section'

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-macro-lg">
      {/* Halo de acento: profundidad sin ruido */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, var(--color-accent), transparent 70%)' }}
      />
      <div className="container-narrow relative">
        <motion.div initial="hidden" animate="show" className="max-w-3xl">
          <motion.p variants={fadeUp} custom={0} className="eyebrow mb-6 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {profile.name}
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mt-4 text-xl font-semibold text-accent">
            {profile.headline}
          </motion.p>
          <motion.p variants={fadeUp} custom={3} className="mt-6 max-w-2xl text-lg text-fg-muted">
            {profile.tagline}
          </motion.p>
          <motion.div variants={fadeUp} custom={4} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#proyectos"
              className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Ver proyectos
            </a>
            {profile.links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target={l.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="rounded-full border border-border px-5 py-3 text-fg-muted transition-colors hover:border-accent hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} custom={5} className="mt-10 font-mono text-sm text-fg-subtle">
            📍 {profile.location}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
