import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { DEFAULT_COVER, type Experience as Exp } from '../data/schema'

export const fmt = (ym: string | null) => {
  if (!ym) return 'Actual'
  const [y, m] = ym.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${months[Number(m) - 1] ?? ''} ${y}`.trim()
}

/** Oscurece un color hex para el degradado de las tarjetas sin imagen. */
function shade(hex: string, amount = 0.4) {
  const n = parseInt(hex.replace('#', ''), 16)
  if (Number.isNaN(n)) return '#0B0F14'
  const f = (c: number) => Math.round(c * (1 - amount))
  return `rgb(${f((n >> 16) & 255)} ${f((n >> 8) & 255)} ${f(n & 255)})`
}

/** Portada de una experiencia: imagen encuadrada (foco + zoom) o degradado de marca con el nombre. */
export function CoverImage({ exp, className = '' }: { exp: Exp; className?: string }) {
  const c = exp.cover ?? DEFAULT_COVER
  if (exp.coverUrl) {
    return (
      <img
        src={exp.coverUrl}
        alt=""
        draggable={false}
        className={`h-full w-full select-none object-cover ${className}`}
        style={{ objectPosition: `${c.x}% ${c.y}%`, transform: `scale(${c.scale})`, transformOrigin: `${c.x}% ${c.y}%` }}
      />
    )
  }
  const color = exp.color || '#115E59'
  return (
    <div
      className={`grid h-full w-full place-items-center px-6 text-center ${className}`}
      style={{ background: `linear-gradient(135deg, ${color}, ${shade(color)})` }}
    >
      <span className="text-xl font-extrabold tracking-tight text-white drop-shadow transition-opacity duration-300 group-hover:opacity-0 md:text-2xl">
        {exp.company}
      </span>
    </div>
  )
}

/** Tarjeta de galería con overlay al pasar el cursor. */
function Tile({ exp, onOpen }: { exp: Exp; onOpen: () => void }) {
  return (
    <div>
      <motion.button
        layoutId={`exp-${exp.id}`}
        onClick={onOpen}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface text-left shadow-card"
        aria-label={`${exp.role} en ${exp.company}: ver detalles`}
      >
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <CoverImage exp={exp} />
        </div>
        <div className="absolute inset-0 flex translate-y-2 flex-col justify-end bg-gradient-to-t from-black/85 via-black/50 to-black/10 p-4 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <p className="font-semibold leading-tight">{exp.role}</p>
          <p className="clamp-2 mt-1 text-xs leading-snug text-white/85">{exp.summary}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {exp.stack.slice(0, 3).map((s) => (
              <span key={s} className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </motion.button>
      <div className="mt-2.5 min-w-0 px-0.5">
        <p className="truncate font-semibold">{exp.company}</p>
        <p className="flex items-baseline gap-2 text-sm text-fg-muted">
          <span className="truncate">{exp.role}</span>
          <span className="shrink-0 font-mono text-xs text-fg-subtle">
            {fmt(exp.start)} — {fmt(exp.end)}
          </span>
        </p>
      </div>
    </div>
  )
}

/** Modal que "abre" la tarjeta: la portada crece (layoutId) y el contenido se despliega en 3D. */
function Modal({ exp, onClose }: { exp: Exp; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`exp-${exp.id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`exp-title-${exp.id}`}
        className="card flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        <div className="relative aspect-[21/9] shrink-0 overflow-hidden">
          <CoverImage exp={exp} />
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
          >
            ✕
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, rotateX: -14, y: 8, transformPerspective: 900 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'top center' }}
          className="overflow-y-auto p-6 md:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 id={`exp-title-${exp.id}`} className="text-xl font-bold">
              {exp.role}
            </h3>
            <span className="font-mono text-xs text-fg-subtle">
              {fmt(exp.start)} — {fmt(exp.end)}
            </span>
          </div>
          <p className="mt-1 text-fg-muted">
            {exp.company} · {exp.location}
          </p>
          <p className="mt-4">{exp.summary}</p>
          {exp.highlights.length > 0 && (
            <>
              <p className="eyebrow mt-6 mb-2">Lo que hice</p>
              <ul className="space-y-2">
                {exp.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="eyebrow mt-6 mb-2">Tecnologías</p>
          <div className="flex flex-wrap gap-1.5">
            {exp.stack.map((s) => (
              <span key={s} className="pill">
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export type ExpOrder = 'recent' | 'oldest'

export default function Experience({ items, order = 'recent' }: { items: Exp[]; order?: ExpOrder }) {
  const [openId, setOpenId] = useState<string | null>(null)
  // "Actual" (end null) va primero en orden reciente; después por fecha de inicio.
  const key = (e: Exp) => (e.end ?? '9999-99') + e.start
  const sorted = [...items].sort((a, b) => (order === 'recent' ? key(b).localeCompare(key(a)) : a.start.localeCompare(b.start)))
  const current = items.find((e) => e.id === openId) ?? null

  return (
    <div id="panel-experiencia" role="tabpanel" aria-labelledby="tab-experiencia">
      <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
        {sorted.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Tile exp={exp} onOpen={() => setOpenId(exp.id)} />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{current && <Modal exp={current} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </div>
  )
}
