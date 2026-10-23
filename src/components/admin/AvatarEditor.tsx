import { useRef, useState, type ChangeEvent, type PointerEvent } from 'react'
import Avatar from '../Avatar'
import { DEFAULT_COVER, type Cover, type Profile } from '../../data/schema'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const MAX_SIDE = 512

/** Reduce la imagen a 512 px de lado mayor y la devuelve como JPEG en data URL (≈30–80 KB). */
function resize(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, MAX_SIDE / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * k)
      canvas.height = Math.round(img.height * k)
      const ctx = canvas.getContext('2d')
      URL.revokeObjectURL(url)
      if (!ctx) return reject(new Error('Tu navegador no permite procesar la imagen.'))
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })
}

/**
 * Editor de la foto de perfil: URL o archivo local, con recorte circular.
 * Arrastra para encuadrar y usa el zoom; la vista previa usa el mismo componente que el sitio.
 */
export default function AvatarEditor({ profile, onChange }: { profile: Profile; onChange: (patch: Partial<Profile>) => void }) {
  const cover: Cover = profile.avatarCover ?? DEFAULT_COVER
  const box = useRef<HTMLDivElement>(null)
  const file = useRef<HTMLInputElement>(null)
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const has = Boolean(profile.avatarUrl)
  const uploaded = profile.avatarUrl?.startsWith('data:') ?? false
  const kb = uploaded ? Math.round((profile.avatarUrl.length * 3) / 4 / 1024) : 0
  const setCover = (patch: Partial<Cover>) => onChange({ avatarCover: { ...cover, ...patch } })

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('El archivo no es una imagen.')
      return
    }
    try {
      setError('')
      onChange({ avatarUrl: await resize(f), avatarCover: { ...DEFAULT_COVER } })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!has) return
    drag.current = { x: e.clientX, y: e.clientY, cx: cover.x, cy: cover.y }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !box.current) return
    const r = box.current.getBoundingClientRect()
    // Igual que en las portadas: el foco se mueve en sentido contrario al arrastre.
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
      <p className="text-sm font-semibold">Foto de perfil</p>
      <div className="grid gap-5 sm:grid-cols-[11rem_1fr]">
        <div className="grid content-start justify-items-center gap-3">
          <div
            ref={box}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className={`touch-none rounded-full ring-2 ring-border ring-offset-4 ring-offset-bg ${has ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
            title={has ? 'Arrastra para encuadrar' : undefined}
          >
            <Avatar url={profile.avatarUrl} cover={cover} name={profile.name} className="h-40 w-40 text-5xl" />
          </div>
          <p className="text-center text-xs text-fg-subtle">{has ? 'Arrastra para encuadrar' : 'Sin foto: se muestran tus iniciales'}</p>
        </div>

        <div className="grid content-start gap-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => file.current?.click()} className="btn-primary px-4 py-2 text-sm">
              Subir desde mi equipo
            </button>
            {has && (
              <button type="button" onClick={() => onChange({ avatarUrl: '', avatarCover: { ...DEFAULT_COVER } })} className="btn-outline px-4 py-2 text-sm">
                Quitar foto
              </button>
            )}
            <input ref={file} type="file" accept="image/*" onChange={onFile} className="hidden" />
          </div>
          <label className="block">
            <span className="field-label">O pega una URL (jpg, png, webp)</span>
            <input
              value={uploaded ? '' : profile.avatarUrl}
              onChange={(e) => onChange({ avatarUrl: e.target.value.trim() })}
              placeholder={uploaded ? `Imagen subida desde tu equipo · ${kb} KB` : 'https://…'}
              className="field"
            />
          </label>
          <label className="block">
            <span className="field-label">Zoom · {cover.scale.toFixed(2)}×</span>
            <input type="range" min={1} max={3} step={0.05} value={cover.scale} onChange={(e) => setCover({ scale: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" disabled={!has} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="field-label">Foco X · {Math.round(cover.x)}%</span>
              <input type="range" min={0} max={100} value={cover.x} onChange={(e) => setCover({ x: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" disabled={!has} />
            </label>
            <label className="block">
              <span className="field-label">Foco Y · {Math.round(cover.y)}%</span>
              <input type="range" min={0} max={100} value={cover.y} onChange={(e) => setCover({ y: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" disabled={!has} />
            </label>
          </div>
          <button type="button" onClick={() => setCover({ ...DEFAULT_COVER })} disabled={!has} className="w-fit text-sm text-accent hover:underline disabled:opacity-50">
            Restablecer encuadre
          </button>
          {error && <p className="text-sm text-danger">{error}</p>}
          <p className="text-xs text-fg-subtle">
            Las fotos que subes se reducen a 512 px y se guardan junto con tu contenido, así que no necesitas alojarlas en otro sitio. Recuerda pulsar Publicar.
          </p>
        </div>
      </div>
    </div>
  )
}
