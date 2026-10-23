import { motion } from 'framer-motion'
import type { Recommendation } from '../data/schema'
import Section from './Section'
import { useLang } from '../i18n/lang'

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

/** Recomendaciones de dos en dos, cada una en un globo de diálogo con su autor debajo. */
export default function Testimonials({ items }: { items: Recommendation[] }) {
  const { t } = useLang()
  if (items.length === 0) return null

  return (
    <Section id="panel-recomendaciones" title={t.recsTitle} intro={t.recsIntro}>
      <ul className="grid gap-x-6 gap-y-8 md:grid-cols-2">
        {items.map((r, i) => (
          <motion.li
            key={r.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <figure className="flex h-full flex-col">
              {/* Globo */}
              <blockquote className="card relative flex-1 rounded-2xl p-6 text-fg before:absolute before:-bottom-2.5 before:left-8 before:h-5 before:w-5 before:rotate-45 before:rounded-br-sm before:border-b before:border-r before:border-border before:bg-surface">
                <span aria-hidden className="absolute left-5 top-3 font-serif text-5xl leading-none text-accent/25">
                  “
                </span>
                <p className="relative pl-5 text-base leading-relaxed">{r.text}</p>
              </blockquote>
              {/* Autor */}
              <figcaption className="mt-5 flex items-center gap-3 pl-1">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mint text-sm font-bold text-accent-ink">
                  {initialsOf(r.name)}
                </div>
                <div className="min-w-0">
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-accent">
                      {r.name} <span className="text-xs text-fg-subtle">↗</span>
                    </a>
                  ) : (
                    <span className="font-semibold">{r.name}</span>
                  )}
                  {r.role && <p className="text-sm text-fg-subtle">{r.role}</p>}
                </div>
              </figcaption>
            </figure>
          </motion.li>
        ))}
      </ul>
    </Section>
  )
}
