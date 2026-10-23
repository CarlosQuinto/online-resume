import { useState } from 'react'
import type { PortfolioData } from '../../data/schema'
import { translationRows, type TranslationMap } from '../../i18n/content'

const SECTION: Record<string, string> = {
  profile: 'Perfil',
  experience: 'Experiencia',
  projects: 'Proyectos',
  pillars: 'Pilares',
  skillGroups: 'Skills',
  certifications: 'Certificaciones',
  education: 'Educación',
  recommendations: 'Recomendaciones',
  hobbies: 'Hobbies',
}
const FIELD: Record<string, string> = {
  headline: 'Titular', tagline: 'Tagline', summary: 'Resumen', location: 'Ubicación', availability: 'Disponibilidad',
  links: 'Enlace', label: 'Etiqueta', role: 'Puesto', title: 'Título', name: 'Nombre', degree: 'Grado', field: 'Área',
  breed: 'Raza', description: 'Descripción', detail: 'Detalle', bio: 'Bio', note: 'Nota', text: 'Texto',
  highlights: 'Logro', kicker: 'Encabezado', tags: 'Etiqueta', meta: 'Bajo las fechas', lists: 'Lista', items: 'Elemento', skills: 'Skill', stack: 'Tecnología', date: 'Fecha',
}

/** "experience/exp-ntt/highlights/0" → "NTT DATA Services · Logro 1" */
function describe(key: string, data: PortfolioData) {
  const [section, id, ...rest] = key.split('/')
  const list = (data as unknown as Record<string, unknown>)[section]
  const parts: string[] = []
  if (Array.isArray(list)) {
    const item = list.find((x) => x?.id === id) as Record<string, string> | undefined
    parts.push(item?.company || item?.title || item?.name || item?.degree || id)
  } else {
    rest.unshift(id)
  }
  for (const p of rest) {
    if (/^\d+$/.test(p) && parts.length) parts[parts.length - 1] += ` ${Number(p) + 1}`
    else parts.push(FIELD[p] ?? p)
  }
  return parts.join(' · ')
}

/**
 * Pestaña Inglés: cada texto del sitio junto a su traducción. Vacío = se muestra el español.
 * Si cambias el español después de traducir, la fila se marca y ofrece la traducción anterior.
 */
export default function TranslationEditor({ data, onChange }: { data: PortfolioData; onChange: (en: TranslationMap) => void }) {
  // "Pendientes" congela la lista al pulsarlo para que una fila no desaparezca mientras se escribe.
  const [onlyKeys, setOnlyKeys] = useState<Set<string> | null>(null)
  const rows = translationRows(data)
  const pending = rows.filter((r) => r.status !== 'ok')
  const shown = onlyKeys ? rows.filter((r) => onlyKeys.has(r.key)) : rows

  const set = (key: string, src: string, text: string) => {
    // Se descartan las rutas que ya no existen (elementos borrados).
    const live = new Set(rows.map((r) => r.key))
    const stored = Object.fromEntries(Object.entries(data.translations?.en ?? {}).filter(([k]) => live.has(k)))
    onChange({ ...stored, [key]: { src, text } })
  }

  let lastSection = ''
  return (
    <div className="grid gap-4">
      <p className="text-sm text-fg-muted">
        El sitio se muestra en inglés por defecto. Escribe aquí la versión en inglés de cada texto; si dejas una vacía se muestra el español.
        Los nombres de tecnologías pueden quedarse iguales. Recuerda pulsar Publicar.
      </p>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-fg-muted">
          {rows.length - pending.length} de {rows.length} traducidos
        </span>
        <span className="mx-1 text-fg-subtle">·</span>
        {(['all', 'pending'] as const).map((f) => {
          const selected = (f === 'pending') === Boolean(onlyKeys)
          return (
            <button
              key={f}
              type="button"
              onClick={() => setOnlyKeys(f === 'all' ? null : new Set(pending.map((r) => r.key)))}
              className={`rounded-full px-3 py-1 ${selected ? 'bg-surface-2 text-fg' : 'text-fg-muted hover:text-fg'}`}
            >
              {f === 'all' ? 'Todos' : `Pendientes (${pending.length})`}
            </button>
          )
        })}
      </div>

      {shown.length === 0 && <p className="rounded-lg border border-border p-4 text-sm text-fg-muted">Todo está traducido ✓</p>}

      <div className="grid gap-3">
        {shown.map((r) => {
          const section = r.key.split('/')[0]
          const header = section !== lastSection
          lastSection = section
          const long = r.src.length > 70
          return (
            <div key={r.key} className="grid gap-3">
              {header && <p className="mt-4 text-sm font-semibold">{SECTION[section] ?? section}</p>}
              <div className={`grid gap-2 rounded-lg border p-3 ${r.status === 'ok' ? 'border-border' : 'border-amber/60'}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="field-label mb-0">{describe(r.key, data)}</span>
                  {r.status !== 'ok' && (
                    <span className="shrink-0 text-xs font-semibold text-amber">{r.status === 'stale' ? 'El español cambió' : 'Sin traducir'}</span>
                  )}
                </div>
                <p lang="es" className="whitespace-pre-line text-sm text-fg-muted">
                  {r.src}
                </p>
                {long ? (
                  <textarea lang="en" value={r.text} onChange={(e) => set(r.key, r.src, e.target.value)} rows={3} className="field" placeholder="English…" />
                ) : (
                  <input lang="en" value={r.text} onChange={(e) => set(r.key, r.src, e.target.value)} className="field" placeholder="English…" />
                )}
                {r.status === 'stale' && (
                  <div className="flex flex-wrap items-baseline gap-2 text-xs text-fg-subtle">
                    <span>Traducción anterior: «{r.previous}»</span>
                    <button type="button" onClick={() => set(r.key, r.src, r.previous)} className="text-accent hover:underline">
                      Usarla como base
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
