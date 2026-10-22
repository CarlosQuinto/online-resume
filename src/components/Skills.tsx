import type { Certification, SkillGroup } from '../data/schema'
import Section from './Section'

/** Stack completo en una sola tarjeta densa + certificaciones como fila de chips. */
export default function Skills({ groups, certifications }: { groups: SkillGroup[]; certifications: Certification[] }) {
  return (
    <Section id="skills" title="Stack y validaciones" intro="Todo lo que uso, agrupado por dominio, y las certificaciones que lo respaldan.">
      <div className="card divide-y divide-border">
        {groups.map((g) => (
          <div key={g.id} className="grid gap-2 px-5 py-3.5 md:grid-cols-[11rem_1fr] md:items-center">
            <p className="text-sm font-semibold text-accent">{g.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {g.skills.map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {certifications.length > 0 && (
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {certifications.map((c) => (
            <li key={c.id}>
              <a
                href={c.url || undefined}
                target={c.url ? '_blank' : undefined}
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm transition-colors hover:border-accent"
                title={`${c.issuer} · ${c.date}`}
              >
                <span className="text-accent" aria-hidden>
                  ✓
                </span>
                <span className="font-medium">{c.name}</span>
                <span className="text-fg-subtle">· {c.issuer}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
