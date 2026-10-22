import { motion } from 'framer-motion'
import type { Project } from '../data/schema'
import Section, { fadeUp } from './Section'

export default function Projects({ items }: { items: Project[] }) {
  const sorted = [...items].sort((a, b) => Number(b.featured) - Number(a.featured))
  return (
    <Section
      id="proyectos"
      eyebrow="Proyectos"
      title="Cosas que construí"
      intro="Cada proyecto vive en su propia región: borde, fondo y espacio propios para leerse como una unidad."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {sorted.map((p, i) => (
          <motion.article
            key={p.id}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ y: -4 }}
            className={`card group flex flex-col p-6 md:p-8 ${p.featured ? 'md:col-span-1 border-accent/30' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">{p.title}</h3>
              {p.featured && <span className="pill border-accent/40 text-accent">Destacado</span>}
            </div>
            <p className="mt-3 flex-1 text-fg-muted">{p.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
            {(p.repoUrl || p.liveUrl) && (
              <div className="mt-6 flex gap-4 text-sm">
                {p.repoUrl && (
                  <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    Código ↗
                  </a>
                )}
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    Demo ↗
                  </a>
                )}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
