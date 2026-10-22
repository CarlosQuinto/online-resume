/**
 * Primitivas de formulario del CMS. Mantienen la jerarquía visual del sitio
 * (misma escala tipográfica, mismos tokens) para que editar se sienta coherente.
 */
export function Text({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="field" placeholder={placeholder} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="field" placeholder={placeholder} />
      )}
    </label>
  )
}

/** Lista de strings editada como texto separado por comas (stack, skills, highlights por línea). */
export function Tags({
  label,
  value,
  onChange,
  separator = ',',
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  separator?: ',' | '\n'
}) {
  const text = value.join(separator === ',' ? ', ' : '\n')
  const parse = (s: string) =>
    s
      .split(separator)
      .map((x) => x.trim())
      .filter(Boolean)
  return (
    <label className="block">
      <span className="field-label">
        {label} <span className="text-fg-subtle">({separator === ',' ? 'separa con comas' : 'una por línea'})</span>
      </span>
      {separator === ',' ? (
        <input value={text} onChange={(e) => onChange(parse(e.target.value))} className="field" />
      ) : (
        <textarea value={text} onChange={(e) => onChange(parse(e.target.value))} rows={4} className="field" />
      )}
    </label>
  )
}

export function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm text-fg-muted">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
      {label}
    </label>
  )
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: T[]
  onChange: (v: T) => void
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="field">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

/** Editor genérico de listas: tarjeta por ítem, con añadir / eliminar / reordenar. */
export function ListEditor<T extends { id: string }>({
  items,
  onChange,
  create,
  title,
  render,
}: {
  items: T[]
  onChange: (items: T[]) => void
  create: () => T
  title: (item: T) => string
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode
}) {
  const update = (i: number, patch: Partial<T>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <details key={item.id} className="card group p-4" open={i === 0}>
          <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium">
            <span className="truncate">{title(item) || '(sin título)'}</span>
            <span className="flex shrink-0 gap-1 text-sm text-fg-muted">
              <button type="button" onClick={(e) => (e.preventDefault(), move(i, -1))} className="rounded px-2 hover:bg-surface-2" aria-label="Subir">
                ↑
              </button>
              <button type="button" onClick={(e) => (e.preventDefault(), move(i, 1))} className="rounded px-2 hover:bg-surface-2" aria-label="Bajar">
                ↓
              </button>
              <button
                type="button"
                onClick={(e) => (e.preventDefault(), onChange(items.filter((_, j) => j !== i)))}
                className="rounded px-2 text-danger hover:bg-surface-2"
                aria-label="Eliminar"
              >
                ✕
              </button>
            </span>
          </summary>
          <div className="mt-4 grid gap-4">{render(item, (patch) => update(i, patch))}</div>
        </details>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, create()])}
        className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-fg-muted hover:border-accent hover:text-accent"
      >
        + Añadir
      </button>
    </div>
  )
}

export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`
