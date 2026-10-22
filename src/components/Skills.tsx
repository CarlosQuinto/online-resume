import { motion } from 'framer-motion'
import type { Certification, SkillGroup } from '../data/schema'
import Section, { fadeUp } from './Section'

export default function Skills({ groups, certifications }: { groups: SkillGroup[]; certifications: Certification[] }) {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Herramientas y práctica"
      intro="Agrupadas por proximidad: cada bloque es un dominio, cada pastilla una herramienta que uso a diario."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <motion.div
            key={g.id}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="card p-6"
          >
            <h3 className="font-semibold">{g.name}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.skills.map((s) => (
                <span key={s} className="pill transition-colors hover:border-accent hover:text-fg">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {certifications.length > 0 && (
        <div className="mt-12">
          <p className="eyebrow mb-4">Validaciones</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {certifications.map((c) => (
              <li key={c.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <span className="mt-0.5 text-accent" aria-hidden>
                  ✓
                </span>
                <div>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer" className="font-medium hover:text-accent">
                      {c.name}
                    </a>
                  ) : (
                    <span className="font-medium">{c.name}</span>
                  )}
                  <p className="text-sm text-fg-muted">
                    {c.issuer} · {c.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
