import { motion } from 'framer-motion'
import type { Experience as Exp } from '../data/schema'
import Section, { fadeUp } from './Section'

const fmt = (ym: string | null) => {
  if (!ym) return 'Actual'
  const [y, m] = ym.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${months[Number(m) - 1] ?? ''} ${y}`.trim()
}

export default function Experience({ items }: { items: Exp[] }) {
  return (
    <Section
      id="experiencia"
      eyebrow="Experiencia"
      title="Trayectoria"
      intro="Equipos, productos y la calidad que ayudé a construir en cada etapa."
    >
      <ol className="relative border-l border-border pl-8">
        {items.map((exp, i) => (
          <motion.li
            key={exp.id}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="relative mb-12 last:mb-0"
          >
            <span
              aria-hidden
              className="absolute -left-[2.3rem] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-accent"
            />
            <div className="card p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{exp.role}</h3>
                <span className="font-mono text-sm text-fg-subtle">
                  {fmt(exp.start)} — {fmt(exp.end)}
                </span>
              </div>
              <p className="mt-1 text-fg-muted">
                {exp.company} · {exp.location}
              </p>
              <p className="mt-4 text-fg-muted">{exp.summary}</p>
              {exp.highlights.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-fg">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              {/* Proximidad: el stack se agrupa visualmente al final de cada tarjeta */}
              <div className="mt-6 flex flex-wrap gap-2">
                {exp.stack.map((s) => (
                  <span key={s} className="pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}
