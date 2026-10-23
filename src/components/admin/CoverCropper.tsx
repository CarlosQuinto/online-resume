import { useRef, useState, type PointerEvent } from 'react'
import { CoverImage } from '../gallery'
import { DEFAULT_COVER, type Cover, type Coverable } from '../../data/schema'
import ImageSource from './ImageSource'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Editor de portada: imagen (subida o URL), color de respaldo y recorte interactivo.
 * Arrastra la imagen para elegir el encuadre y usa el zoom; la vista previa
 * tiene exactamente la proporción 4:3 de la tarjeta.
 */
export default function CoverCropper<T extends Coverable>({
  item,
  label,
  sublabel,
  onChange,
  aspect = '4/3',
}: {
  item: T
  /** Texto grande de la tarjeta sin imagen (empresa o proyecto). */
  label: string
  /** Línea secundaria del overlay de la vista previa. */
  sublabel?: string
  onChange: (patch: Partial<Coverable>) => void
  /** Proporción de la tarjeta en el sitio: 4:3 en galerías, 21:9 en hobbies. */
  aspect?: '4/3' | '21/9'
}) {
  const cover: Cover = item.cover ?? DEFAULT_COVER
  const box = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const setCover = (patch: Partial<Cover>) => onChange({ cover: { ...cover, ...patch } })

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!item.coverUrl) return
    drag.current = { x: e.clientX, y: e.clientY, cx: cover.x, cy: cover.y }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !box.current) return
    const r = box.current.getBoundingClientRect()
    // Arrastrar hacia la derecha muestra más del lado izquierdo de la imagen: el foco se mueve en sentido contrario.
    const dx = ((e.clientX - drag.current.x) / r.width) * 100
    const dy = ((e.clientY - drag.current.y) / r.height) * 100
    setCover({ x: clamp(drag.current.cx - dx / cover.scale, 0, 100), y: clamp(drag.current.cy - dy / cover.scale, 0, 100) })
  }
  const onUp = () => {
    drag.current = null
    setDragging(false)
  }

  return (
    <div className="grid gap-4 rounded-lg border border-border p-3">
      <p className="text-sm font-semibold">Portada de la tarjeta</p>
      <ImageSource
        url={item.coverUrl ?? ''}
        maxSide={1000}
        maxBytes={60_000}
        onChange={(url, source) => onChange(source === 'url' ? { coverUrl: url } : { coverUrl: url, cover: { ...DEFAULT_COVER } })}
      />
      <label className="flex items-center gap-3 text-sm text-fg-muted">
        <span className="field-label mb-0">Color de respaldo</span>
        <input type="color" value={item.color ?? '#115E59'} onChange={(e) => onChange({ color: e.target.value })} className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent" />
        <span className="font-mono text-xs">{item.color ?? '#115E59'}</span>
      </label>

      <div className="grid gap-3 md:grid-cols-[18rem_1fr]">
        <div>
          <p className="field-label">Vista previa (arrastra para encuadrar)</p>
          <div
            ref={box}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className={`group relative w-full ${aspect === '21/9' ? 'aspect-[21/9]' : 'aspect-[4/3]'} touch-none overflow-hidden rounded-xl border border-border bg-surface-2 shadow-card ${
              item.coverUrl ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
          >
            <CoverImage item={item} label={label} />
            {/* Guías de tercios */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-40">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="border border-white/40" />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-white">
              <p className="text-sm font-semibold leading-tight">{sublabel || label}</p>
              {sublabel && <p className="text-[11px] text-white/80">{label}</p>}
            </div>
          </div>
        </div>
        <div className="grid content-start gap-3">
          <label className="block">
            <span className="field-label">Zoom · {cover.scale.toFixed(2)}×</span>
            <input type="range" min={1} max={3} step={0.05} value={cover.scale} onChange={(e) => setCover({ scale: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" disabled={!item.coverUrl} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="field-label">Foco X · {Math.round(cover.x)}%</span>
              <input type="range" min={0} max={100} value={cover.x} onChange={(e) => setCover({ x: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" disabled={!item.coverUrl} />
            </label>
            <label className="block">
              <span className="field-label">Foco Y · {Math.round(cover.y)}%</span>
              <input type="range" min={0} max={100} value={cover.y} onChange={(e) => setCover({ y: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" disabled={!item.coverUrl} />
            </label>
          </div>
          <button type="button" onClick={() => onChange({ cover: { ...DEFAULT_COVER } })} className="w-fit text-sm text-accent hover:underline">
            Restablecer encuadre
          </button>
          <p className="text-xs text-fg-subtle">
            {aspect === '21/9'
              ? 'La imagen se recorta en proporción 21:9 en la tarjeta.'
              : 'La imagen se recorta en proporción 4:3 en la galería y 21:9 en el modal, conservando el mismo punto de foco.'} Sin imagen se usa el color de respaldo con el nombre. Las imágenes que subes se comprimen a unos 60 KB.
          </p>
        </div>
      </div>
    </div>
  )
}
