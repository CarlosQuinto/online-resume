import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Education, Hobby, Pet } from '../data/schema'
import Section, { fadeUp } from './Section'
import { useLang } from '../i18n/lang'

const accentText: Record<Hobby['accent'], string> = {
  accent: 'text-accent',
  green: 'text-green',
  amber: 'text-amber',
  violet: 'text-violet',
}

export default function About({ hobbies, pets, education }: { hobbies: Hobby[]; pets: Pet[]; education: Education[] }) {
  const { t } = useLang()
  const [active, setActive] = useState<string | null>(hobbies[0]?.id ?? null)
  const current = hobbies.find((h) => h.id === active) ?? hobbies[0]

  return (
    <Section id="panel-sobre-mi" title={t.aboutTitle} intro={t.aboutIntro}>
      {/* Hobbies: 4 iconos circulares + detalle */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="tablist" aria-label="Hobbies">
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
              whileTap={{ scale: 0.97 }}
              className={`card flex flex-col items-center px-4 py-6 text-center transition-colors ${selected ? 'border-accent' : 'hover:border-fg-subtle'}`}
            >
              <span className="icon-circle" aria-hidden>
                {h.emoji}
              </span>
              <span className="mt-3 font-semibold">{h.title}</span>
              <span className="mt-1 text-xs text-fg-subtle">{h.description}</span>
            </motion.button>
          )
        })}
      </div>
      <div className="mx-auto mt-5 max-w-2xl text-center">
        <AnimatePresence mode="wait">
          {current && (
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-fg-muted"
            >
              <span className={`font-semibold ${accentText[current.accent]}`}>{current.title}. </span>
              {current.detail}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Perros + formación en dos columnas */}
      <div className="mt-12 grid gap-8 md:grid-cols-[1.2fr_1fr]">
        {pets.length > 0 && (
          <div>
            <p className="eyebrow mb-3 text-center md:text-left">{t.supportTeam}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {pets.map((p, i) => (
                <motion.div
                  key={p.id}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  whileHover={{ rotate: i % 2 ? 1 : -1 }}
                  className="card px-4 py-4 text-center"
                >
                  <span className="text-3xl" aria-hidden>
                    {p.emoji}
                  </span>
                  <p className="mt-2 font-semibold">{p.name}</p>
                  <p className="text-xs text-fg-subtle">{p.breed}</p>
                  <p className="mt-2 text-xs text-fg-muted">{p.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {education.length > 0 && (
          <div>
            <p className="eyebrow mb-3 text-center md:text-left">{t.education}</p>
            <ul className="card divide-y divide-border">
              {education.map((e) => (
                <li key={e.id} className="px-4 py-3.5">
                  <p className="font-semibold">
                    {t.degreeIn(e.degree, e.field)}
                  </p>
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
      </div>
    </Section>
  )
}
