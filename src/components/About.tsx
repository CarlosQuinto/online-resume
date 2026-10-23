import { motion } from 'framer-motion'
import type { Education, Hobby } from '../data/schema'
import Section, { fadeUp } from './Section'
import { CoverImage, shade } from './gallery'
import { useLang } from '../i18n/lang'

const accentText: Record<Hobby['accent'], string> = {
  accent: 'text-accent',
  green: 'text-green',
  amber: 'text-amber',
  violet: 'text-violet',
}

/** Tarjeta de hobby: imagen con etiqueta, encabezado de color, título con ícono, texto y etiquetas. */
function HobbyCard({ h, i }: { h: Hobby; i: number }) {
  const badge = h.description.replace(/\.$/, '')
  const color = h.color || '#115E59'
  return (
    <motion.article
      variants={fadeUp}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="card group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[21/9] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          {h.coverUrl ? (
            <CoverImage item={h} label={h.title} />
          ) : (
            // Sin imagen: degradado del color de respaldo con el emoji grande.
            <div
              className="grid h-full w-full place-items-center text-6xl text-white"
              style={{ background: `linear-gradient(135deg, ${color}, ${shade(color)})` }}
              aria-hidden
            >
              {h.emoji}
            </div>
          )}
        </div>
        {badge && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 font-mono text-[11px] text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {h.kicker && <p className={`font-mono text-[11px] font-semibold tracking-[0.12em] uppercase ${accentText[h.accent]}`}>{h.kicker}</p>}
        <div className="mt-1 flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight">{h.title}</h3>
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-lg ${accentText[h.accent]}`} aria-hidden>
            {h.emoji}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">{h.detail}</p>
        {h.tags && h.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {h.tags.map((tag) => (
              <li key={tag} className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-fg-subtle">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  )
}

export default function About({ hobbies, education }: { hobbies: Hobby[]; education: Education[] }) {
  const { t } = useLang()

  return (
    <Section id="panel-sobre-mi" title={t.aboutTitle} intro={t.aboutIntro}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {hobbies.map((h, i) => (
          <HobbyCard key={h.id} h={h} i={i} />
        ))}
      </div>

      {education.length > 0 && (
        <div className="mt-12 max-w-3xl">
          <p className="eyebrow mb-3">{t.education}</p>
          <ul className="card divide-y divide-border">
            {education.map((e) => (
              <li key={e.id} className="px-4 py-3.5">
                <p className="font-semibold">{t.degreeIn(e.degree, e.field)}</p>
                <p className="text-sm text-fg-muted">{e.institution}</p>
                <p className="mt-0.5 font-mono text-xs text-fg-subtle">
                  {e.start.slice(0, 4)} — {e.end ? e.end.slice(0, 4) : t.present}
                  {e.note ? ` · ${e.note}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
