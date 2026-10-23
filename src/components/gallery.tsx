import { motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { DEFAULT_COVER, type Coverable } from '../data/schema'
import { useLang } from '../i18n/lang'

/** Oscurece un color hex para el degradado de las tarjetas sin imagen. */
export function shade(hex: string, amount = 0.4) {
  const n = parseInt(hex.replace('#', ''), 16)
  if (Number.isNaN(n)) return '#0B0F14'
  const f = (c: number) => Math.round(c * (1 - amount))
  return `rgb(${f((n >> 16) & 255)} ${f((n >> 8) & 255)} ${f(n & 255)})`
}

/** Portada: imagen encuadrada (foco + zoom) o degradado de marca con una etiqueta. */
export function CoverImage({ item, label, className = '' }: { item: Coverable; label: string; className?: string }) {
  const c = item.cover ?? DEFAULT_COVER
  if (item.coverUrl) {
    return (
      <img
        src={item.coverUrl}
        alt=""
        draggable={false}
        className={`h-full w-full select-none object-cover ${className}`}
        style={{ objectPosition: `${c.x}% ${c.y}%`, transform: `scale(${c.scale})`, transformOrigin: `${c.x}% ${c.y}%` }}
      />
    )
  }
  const color = item.color || '#115E59'
  return (
    <div
      className={`grid h-full w-full place-items-center px-6 text-center ${className}`}
      style={{ background: `linear-gradient(135deg, ${color}, ${shade(color)})` }}
    >
      <span
        className={`font-extrabold tracking-tight text-white drop-shadow transition-opacity duration-300 [overflow-wrap:anywhere] group-hover:opacity-0 ${
          label.length > 18 ? 'text-base md:text-lg' : 'text-xl md:text-2xl'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

/** Tarjeta de galería 4:3 con overlay al pasar el cursor y pie de texto. */
export function Tile({
  id,
  item,
  label,
  ariaLabel,
  overlay,
  caption,
  onOpen,
}: {
  id: string
  item: Coverable
  label: string
  ariaLabel: string
  overlay: ReactNode
  caption: ReactNode
  onOpen: () => void
}) {
  return (
    <div>
      <motion.button
        layoutId={id}
        onClick={onOpen}
        aria-label={ariaLabel}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface text-left shadow-card"
      >
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <CoverImage item={item} label={label} />
        </div>
        <div className="absolute inset-0 flex translate-y-2 flex-col justify-end bg-gradient-to-t from-black/85 via-black/50 to-black/10 p-4 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {overlay}
        </div>
      </motion.button>
      <div className="mt-2.5 min-w-0 px-0.5">{caption}</div>
    </div>
  )
}

export function Chips({ items, max = 3 }: { items: string[]; max?: number }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {items.slice(0, max).map((s) => (
        <span key={s} className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm">
          {s}
        </span>
      ))}
    </div>
  )
}

/** Modal que "abre" la tarjeta: la portada crece (layoutId) y el contenido se despliega en 3D. */
export function Modal({
  id,
  item,
  label,
  titleId,
  onClose,
  children,
}: {
  id: string
  item: Coverable
  label: string
  titleId: string
  onClose: () => void
  children: ReactNode
}) {
  const { t } = useLang()
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
        layoutId={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="card flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        <div className="relative aspect-[21/9] shrink-0 overflow-hidden">
          <CoverImage item={item} label={label} />
          <button
            onClick={onClose}
            aria-label={t.close}
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
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
