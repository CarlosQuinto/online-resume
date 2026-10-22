import { motion } from 'framer-motion'
import type { Project } from '../data/schema'
import Section, { fadeUp } from './Section'

const host = (url: string) => {
  const h = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return h.length > 22 ? 'ver sitio' : h
}

/** Grid de 3 columnas con tarjetas cortas: título, una idea, enlace en pastilla. */
export default function Projects({ items }: { items: Project[] }) {
  const sorted = [...items].sort((a, b) => Number(b.featured) - Number(a.featured))
  return (
    <Section id="proyectos" title="Mis proyectos" intro="Productos propios y trabajo reciente. Cada tarjeta, una idea.">
      <div className={`grid gap-5 sm:grid-cols-2 ${sorted.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {sorted.map((p, i) => (
          <motion.article
            key={p.id}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            whileHover={{ y: -3 }}
            className={`card flex flex-col items-center px-6 py-8 text-center ${p.featured ? 'border-accent/40' : ''}`}
          >
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p className="clamp-3 mt-3 flex-1 text-sm text-fg-muted" title={p.description}>
              {p.description}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-1">
              {p.stack.slice(0, 4).map((s) => (
                <span key={s} className="text-xs text-fg-subtle">
                  {s}
                  <span className="mx-1 last:hidden">·</span>
                </span>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="link-pill">
                  ↗ {host(p.liveUrl)}
                </a>
              )}
              {p.repoUrl && (
                <a href={p.repoUrl} target="_blank" rel="noreferrer" className="link-pill">
                  ⌥ código
                </a>
              )}
              {!p.liveUrl && !p.repoUrl && <span className="pill">privado</span>}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
