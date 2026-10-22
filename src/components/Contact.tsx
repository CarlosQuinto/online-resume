import { motion } from 'framer-motion'
import type { Profile } from '../data/schema'
import Section, { fadeUp } from './Section'

const icon = (label: string) => {
  const l = label.toLowerCase()
  if (l.includes('github')) return '⌥'
  if (l.includes('linkedin')) return 'in'
  if (l.includes('mail')) return '✉'
  return '↗'
}

/** Pestaña Contacto: llamada a la acción y todas las vías de contacto en tarjetas. */
export default function Contact({ profile }: { profile: Profile }) {
  const email = profile.links.find((l) => l.url.startsWith('mailto:'))
  return (
    <Section id="panel-contacto" title="¿Construimos algo con calidad?" intro="Automatización, SDET, IA aplicada a QA… o una partida de ajedrez. Respondo rápido.">
      <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="card flex flex-col justify-between gap-6 p-6 md:p-8">
          <div>
            <p className="eyebrow mb-2">Disponibilidad</p>
            <p className="flex items-center gap-2 text-lg font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              {profile.availability}
            </p>
            <p className="mt-2 text-fg-muted">{profile.location}</p>
          </div>
          {email && (
            <div className="flex flex-wrap items-center gap-3">
              <a href={email.url} className="btn-primary hover:scale-[1.02]">
                Escríbeme
              </a>
              <span className="font-mono text-sm text-fg-muted">{email.url.replace('mailto:', '')}</span>
            </div>
          )}
        </motion.div>
        <ul className="grid gap-3">
          {profile.links.map((l, i) => (
            <motion.li key={l.label} variants={fadeUp} custom={i + 1} initial="hidden" animate="show">
              <a
                href={l.url}
                target={l.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="card flex items-center gap-4 px-5 py-4 transition-colors hover:border-accent"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-sm font-bold text-accent" aria-hidden>
                  {icon(l.label)}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{l.label}</span>
                  <span className="block truncate text-sm text-fg-muted">{l.url.replace(/^mailto:|^https?:\/\//, '')}</span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
