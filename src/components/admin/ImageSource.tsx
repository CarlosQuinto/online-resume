import { useRef, useState, type ChangeEvent } from 'react'
import { compressImage, dataUrlBytes, formatKB } from '../../lib/image'

/**
 * Origen de una imagen del admin: subir desde el equipo (se comprime y se guarda en el
 * documento), pegar una URL externa o quitarla. Lo comparten la foto de perfil y las portadas.
 */
export default function ImageSource({
  url,
  onChange,
  maxSide,
  maxBytes,
  clearLabel = 'Quitar imagen',
}: {
  url: string
  /** `upload` y `clear` cambian de imagen (conviene reiniciar el encuadre); `url` es la escritura en el campo. */
  onChange: (url: string, source: 'upload' | 'url' | 'clear') => void
  maxSide: number
  maxBytes: number
  clearLabel?: string
}) {
  const file = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const uploaded = url.startsWith('data:')

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setBusy(true)
    try {
      setError('')
      onChange(await compressImage(f, { maxSide, maxBytes }), 'upload')
    } catch (err) {
      setError((err as Error).message)
    }
    setBusy(false)
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => file.current?.click()} disabled={busy} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
          {busy ? 'Procesando…' : 'Subir desde mi equipo'}
        </button>
        {url && (
          <button type="button" onClick={() => onChange('', 'clear')} className="btn-outline px-4 py-2 text-sm">
            {clearLabel}
          </button>
        )}
        <input ref={file} type="file" accept="image/*" onChange={onFile} className="hidden" />
      </div>
      <label className="block">
        <span className="field-label">O pega una URL (jpg, png, webp)</span>
        <input
          value={uploaded ? '' : url}
          onChange={(e) => onChange(e.target.value.trim(), 'url')}
          placeholder={uploaded ? `Imagen subida desde tu equipo · ${formatKB(dataUrlBytes(url))}` : 'https://…'}
          className="field"
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
