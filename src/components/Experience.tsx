import type { Experience as Exp } from '../data/schema'
import Section from './Section'

const fmt = (ym: string | null) => {
  if (!ym) return 'Actual'
  const [y, m] = ym.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${months[Number(m) - 1] ?? ''} ${y}`.trim()
}

/**
 * Cronología compacta: una fila por empleo, los detalles se despliegan al tocar.
 * Así los 7 puestos caben en una pantalla.
 */
export default function Experience({ items }: { items: Exp[] }) {
  return (
    <Section id="experiencia" title="Trayectoria" intro="Siete etapas, un mismo hilo: automatizar bien y entregar con confianza." tone="soft">
      <ol className="card divide-y divide-border">
        {items.map((exp, i) => (
          <li key={exp.id}>
            <details className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-2 md:items-center">
                <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft font-mono text-xs font-bold text-accent md:mt-0">
                  {exp.company.slice(0, 2).toUpperCase()}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:gap-4">
                  <span className="font-semibold">{exp.role}</span>
                  <span className="text-fg-muted">
                    {exp.company} · {exp.location}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-xs text-fg-subtle">
                  {fmt(exp.start)} — {fmt(exp.end)}
                </span>
                <span className="ml-1 shrink-0 text-fg-subtle transition-transform group-open:rotate-180" aria-hidden>
                  ⌄
                </span>
              </summary>
              <div className="px-5 pb-5 pl-[4.25rem]">
                <p className="text-fg-muted">{exp.summary}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {exp.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-sm">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.stack.map((s) => (
                    <span key={s} className="pill">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </Section>
  )
}
