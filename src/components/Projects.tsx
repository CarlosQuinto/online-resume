import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Project } from '../data/schema'
import Section from './Section'
import { Chips, Modal, Tile } from './gallery'
import { useLang } from '../i18n/lang'

/** Solo el dominio en el pie de tarjeta: las rutas largas (p. ej. App Store) no aportan. */
const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

/** Galería de proyectos: mismas tarjetas que la experiencia, con enlaces en el modal. */
export default function Projects({ items }: { items: Project[] }) {
  const { t } = useLang()
  const [openId, setOpenId] = useState<string | null>(null)
  const sorted = [...items].sort((a, b) => Number(b.featured) - Number(a.featured))
  const current = items.find((p) => p.id === openId) ?? null

  return (
    <Section id="panel-proyectos" title={t.projectsTitle} intro={t.projectsIntro}>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              ariaLabel={t.viewDetails(p.title)}
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
                    {p.featured && <span className="shrink-0 text-xs font-semibold text-accent">{t.featured}</span>}
                  </p>
                  <p className="truncate text-sm text-fg-muted">
                    {p.liveUrl ? host(p.liveUrl) : p.repoUrl ? t.openSource : t.privateProject}
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
              {current.featured && <span className="pill border-accent/40 text-accent">{t.featured}</span>}
            </div>
            <p className="mt-4 whitespace-pre-line">{current.description}</p>
            <p className="eyebrow mt-6 mb-2">{t.technologies}</p>
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
                    ↗ {t.visitSite}
                  </a>
                )}
                {current.repoUrl && (
                  <a href={current.repoUrl} target="_blank" rel="noreferrer" className="btn-outline text-sm">
                    ⌥ {t.code}
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
