import { motion } from 'framer-motion'
import type { Profile } from '../data/schema'
import Section, { fadeUp } from './Section'
import { useLang } from '../i18n/lang'

const icon = (label: string) => {
  const l = label.toLowerCase()
  if (l.includes('github')) return '⌥'
  if (l.includes('linkedin')) return 'in'
  if (l.includes('mail')) return '✉'
  if (l.includes('tel') || l.includes('phone')) return '☎'
  return '↗'
}

/** Pestaña Contacto: un solo bloque con la disponibilidad y la llamada a la acción a un lado y las vías de contacto al otro. */
export default function Contact({ profile }: { profile: Profile }) {
  const { t } = useLang()
  const email = profile.links.find((l) => l.url.startsWith('mailto:'))
  // El teléfono va al final de la lista; tel: usa solo dígitos y el +, y se muestra tal como se escribió.
  const phone = profile.phone?.trim()
  const links: { label: string; url: string; shown?: string }[] = [
    ...profile.links,
    ...(phone ? [{ label: t.phone, url: `tel:${phone.replace(/[^\d+]/g, '')}`, shown: phone }] : []),
  ]
  return (
    <Section id="panel-contacto" title={t.contactTitle} intro={t.contactIntro}>
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="show"
        className="card grid grid-cols-1 overflow-hidden md:grid-cols-[1.1fr_1fr] md:divide-x md:divide-border"
      >
        <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
          <div>
            <p className="eyebrow mb-2">{t.availability}</p>
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
            <a href={email.url} className="btn-primary w-fit hover:scale-[1.02]">
              {t.emailMe}
            </a>
          )}
        </div>
        <ul className="divide-y divide-border border-t border-border md:border-t-0">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.url}
                target={l.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-2 md:px-8"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-sm font-bold text-accent" aria-hidden>
                  {icon(l.label)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{l.label}</span>
                  <span className="block truncate text-sm text-fg-muted">{l.shown ?? l.url.replace(/^mailto:|^https?:\/\//, '')}</span>
                </span>
                <span className="text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden>
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </Section>
  )
}
