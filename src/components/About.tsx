import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Education, Hobby, Pet } from '../data/schema'
import Section, { fadeUp } from './Section'

const accentClass: Record<Hobby['accent'], string> = {
  accent: 'text-accent border-accent/40',
  green: 'text-green border-green/40',
  amber: 'text-amber border-amber/40',
  violet: 'text-violet border-violet/40',
}

export default function About({
  summary,
  hobbies,
  pets,
  education,
}: {
  summary: string
  hobbies: Hobby[]
  pets: Pet[]
  education: Education[]
}) {
  const [active, setActive] = useState<string | null>(hobbies[0]?.id ?? null)
  const current = hobbies.find((h) => h.id === active) ?? hobbies[0]

  return (
    <Section id="sobre-mi" eyebrow="Sobre mí" title="Fuera del IDE" intro={summary}>
      {/* Hobbies: tarjetas seleccionables + panel de detalle */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid grid-cols-2 gap-4" role="tablist" aria-label="Hobbies">
          {hobbies.map((h, i) => {
            const selected = h.id === current?.id
            return (
              <motion.button
                key={h.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(h.id)}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`card p-5 text-left transition-colors ${
                  selected ? accentClass[h.accent] : 'hover:border-fg-subtle'
                }`}
              >
                <span className="text-xl" aria-hidden>
                  {h.emoji}
                </span>
                <h3 className="mt-3 font-semibold text-fg">{h.title}</h3>
                <p className="mt-1 text-sm text-fg-muted">{h.description}</p>
              </motion.button>
            )
          })}
        </div>

        <div className="card relative min-h-[14rem] overflow-hidden p-8" role="tabpanel">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-3xl" aria-hidden>
                  {current.emoji}
                </span>
                <h3 className={`mt-4 text-xl font-bold ${accentClass[current.accent].split(' ')[0]}`}>{current.title}</h3>
                <p className="mt-4 text-lg text-fg-muted">{current.detail}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Perros */}
      {pets.length > 0 && (
        <div className="mt-16">
          <p className="eyebrow mb-4">El equipo de soporte</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {pets.map((p, i) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ rotate: i % 2 ? 1 : -1, y: -3 }}
                className="card p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-xl" aria-hidden>
                    {p.emoji}
                  </span>
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-fg-subtle">{p.breed}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-fg-muted">{p.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Educación */}
      {education.length > 0 && (
        <div className="mt-16">
          <p className="eyebrow mb-4">Formación</p>
          <ul className="grid gap-4 md:grid-cols-2">
            {education.map((e) => (
              <li key={e.id} className="card p-6">
                <h3 className="font-semibold">
                  {e.degree} en {e.field}
                </h3>
                <p className="mt-1 text-fg-muted">{e.institution}</p>
                <p className="mt-2 font-mono text-sm text-fg-subtle">
                  {e.start.slice(0, 4)} — {e.end ? e.end.slice(0, 4) : 'Actual'}
                </p>
                {e.note && <p className="mt-3 text-sm text-fg-muted">{e.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
