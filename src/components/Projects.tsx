import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Project } from '../data/schema'
import Section from './Section'
import { Chips, Modal, Tile } from './gallery'

const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

/** Galería de proyectos: mismas tarjetas que la experiencia, con enlaces en el modal. */
export default function Projects({ items }: { items: Project[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const sorted = [...items].sort((a, b) => Number(b.featured) - Number(a.featured))
  const current = items.find((p) => p.id === openId) ?? null

  return (
    <Section id="panel-proyectos" title="Mis proyectos" intro="Productos propios y trabajo reciente. Pasa el cursor para ver de qué va, haz clic para los detalles.">
      <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
        {sorted.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Tile
              id={`proj-${p.id}`}
              item={p}
              label={p.title}
              ariaLabel={`${p.title}: ver detalles`}
              featured={p.featured}
              onOpen={() => setOpenId(p.id)}
              overlay={
                <>
                  <p className="font-semibold leading-tight">{p.title}</p>
                  <p className="clamp-2 mt-1 text-xs leading-snug text-white/85">{p.description}</p>
                  <Chips items={p.stack} />
                </>
              }
              caption={
                <>
                  <p className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-semibold">{p.title}</span>
                    {p.featured && <span className="shrink-0 text-xs font-semibold text-accent">Destacado</span>}
                  </p>
                  <p className="truncate text-sm text-fg-muted">
                    {p.liveUrl ? host(p.liveUrl) : p.repoUrl ? 'código abierto' : 'proyecto privado'}
                  </p>
                </>
              }
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <Modal id={`proj-${current.id}`} item={current} label={current.title} titleId={`proj-title-${current.id}`} onClose={() => setOpenId(null)}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 id={`proj-title-${current.id}`} className="text-xl font-bold">
                {current.title}
              </h3>
              {current.featured && <span className="pill border-accent/40 text-accent">Destacado</span>}
            </div>
            <p className="mt-4 whitespace-pre-line">{current.description}</p>
            <p className="eyebrow mt-6 mb-2">Tecnologías</p>
            <div className="flex flex-wrap gap-1.5">
              {current.stack.map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
            {(current.liveUrl || current.repoUrl) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {current.liveUrl && (
                  <a href={current.liveUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                    ↗ Ver sitio
                  </a>
                )}
                {current.repoUrl && (
                  <a href={current.repoUrl} target="_blank" rel="noreferrer" className="btn-outline text-sm">
                    ⌥ Código
                  </a>
                )}
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </Section>
  )
}
