import { useRef, useState, type PointerEvent } from 'react'
import { CoverImage } from '../Experience'
import { DEFAULT_COVER, type Cover, type Experience } from '../../data/schema'
import { Text } from './fields'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Editor de portada: URL de imagen, color de respaldo y recorte interactivo.
 * Arrastra la imagen para elegir el encuadre y usa el zoom; la vista previa
 * tiene exactamente la proporción 4:3 de la tarjeta.
 */
export default function CoverCropper({ exp, onChange }: { exp: Experience; onChange: (patch: Partial<Experience>) => void }) {
  const cover: Cover = exp.cover ?? DEFAULT_COVER
  const box = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const setCover = (patch: Partial<Cover>) => onChange({ cover: { ...cover, ...patch } })

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!exp.coverUrl) return
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
      <Text label="URL de la imagen (jpg, png, webp)" value={exp.coverUrl ?? ''} onChange={(v) => onChange({ coverUrl: v.trim() })} placeholder="https://…" />
      <label className="flex items-center gap-3 text-sm text-fg-muted">
        <span className="field-label mb-0">Color de respaldo</span>
        <input type="color" value={exp.color ?? '#115E59'} onChange={(e) => onChange({ color: e.target.value })} className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent" />
        <span className="font-mono text-xs">{exp.color ?? '#115E59'}</span>
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
            className={`relative aspect-[4/3] w-full touch-none overflow-hidden rounded-xl border border-border bg-surface-2 shadow-card ${
              exp.coverUrl ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
          >
            <CoverImage exp={exp} />
            {/* Guías de tercios */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-40">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="border border-white/40" />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-white">
              <p className="text-sm font-semibold leading-tight">{exp.role || 'Puesto'}</p>
              <p className="text-[11px] text-white/80">{exp.company || 'Empresa'}</p>
            </div>
          </div>
        </div>
        <div className="grid content-start gap-3">
          <label className="block">
            <span className="field-label">Zoom · {cover.scale.toFixed(2)}×</span>
            <input type="range" min={1} max={3} step={0.05} value={cover.scale} onChange={(e) => setCover({ scale: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" disabled={!exp.coverUrl} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="field-label">Foco X · {Math.round(cover.x)}%</span>
              <input type="range" min={0} max={100} value={cover.x} onChange={(e) => setCover({ x: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" disabled={!exp.coverUrl} />
            </label>
            <label className="block">
              <span className="field-label">Foco Y · {Math.round(cover.y)}%</span>
              <input type="range" min={0} max={100} value={cover.y} onChange={(e) => setCover({ y: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" disabled={!exp.coverUrl} />
            </label>
          </div>
          <button type="button" onClick={() => onChange({ cover: { ...DEFAULT_COVER } })} className="w-fit text-sm text-accent hover:underline">
            Restablecer encuadre
          </button>
          <p className="text-xs text-fg-subtle">
            La imagen se recorta en proporción 4:3 en la galería y 21:9 en el modal, conservando el mismo punto de foco. Sin URL se usa el color de respaldo con el nombre de la empresa.
          </p>
        </div>
      </div>
    </div>
  )
}
