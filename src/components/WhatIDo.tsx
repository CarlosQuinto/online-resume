import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Certification, Pillar, SkillGroup, Stat } from '../data/schema'
import { fadeUp } from './Section'
import Icon from './Icon'
import { useLang } from '../i18n/lang'

/** Rótulo con línea («— LO QUE HAGO») y título del bloque. */
function Heading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="mb-6">
      <p className="flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-accent uppercase">
        <span className="h-px w-6 bg-accent" aria-hidden />
        {kicker}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">{title}</h2>
    </header>
  )
}

function Block({ children, first }: { children: ReactNode; first?: boolean }) {
  return <section className={first ? '' : 'mt-12 border-t border-border pt-10'}>{children}</section>
}

/** Ícono de la credencial según emisor o nombre: GitHub, universidad o medalla. */
const certIcon = (c: Certification) => {
  const s = `${c.name} ${c.issuer}`.toLowerCase()
  if (s.includes('github')) return 'github'
  if (s.includes('universidad') || s.includes('university')) return 'cap'
  return 'award'
}

/** Pestaña «Qué hago»: resumen con cifras, áreas de enfoque, stack con años y credenciales. */
export default function WhatIDo({
  summary,
  stats,
  pillars,
  groups,
  certifications,
}: {
  summary: string
  stats: Stat[]
  pillars: Pillar[]
  groups: SkillGroup[]
  certifications: Certification[]
}) {
  const { t } = useLang()

  return (
    <div>
      <Block first>
        <Heading kicker={t.whatKicker} title={t.whatTitle} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
          <p className="max-w-3xl leading-relaxed text-fg-muted">{summary}</p>
          {stats.length > 0 && (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border lg:border-l lg:border-border">
              {stats.map((s, i) => (
                <motion.li key={s.id} variants={fadeUp} custom={i} initial="hidden" animate="show" className="sm:px-6">
                  <span className="text-accent">
                    <Icon name={s.icon} className="h-7 w-7" />
                  </span>
                  <p className="mt-3 text-xl leading-tight font-bold tracking-tight">{s.value}</p>
                  <p className="mt-1.5 text-sm text-fg-muted">{s.label}</p>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </Block>

      {pillars.length > 0 && (
        <Block>
          <Heading kicker={t.focusKicker} title={t.focusTitle} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {pillars.map((p, i) => (
              <motion.article key={p.id} variants={fadeUp} custom={i} initial="hidden" animate="show" className="card flex gap-4 p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Icon name={p.icon} className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{p.description}</p>
                  {(p.lists[0]?.items.length ?? 0) > 0 && <p className="mt-4 text-sm text-fg-subtle">{p.lists[0].items.join(' · ')}</p>}
                </div>
              </motion.article>
            ))}
          </div>
        </Block>
      )}

      {groups.length > 0 && (
        <Block>
          <Heading kicker={t.stackKicker} title={t.stackTitle} />
          <ul className="divide-y divide-border border-y border-border">
            {groups.map((g) => (
              <li key={g.id} className="grid grid-cols-1 gap-3 py-4 md:grid-cols-[15rem_1fr] md:items-center">
                <p className="flex items-center gap-3 font-semibold">
                  <span className="text-accent">
                    <Icon name={g.icon} className="h-5 w-5" />
                  </span>
                  {g.name}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {g.skills.map((s, i) => {
                    const years = g.years?.[i]
                    return (
                      <li key={s} className="rounded-full bg-surface-2 px-3.5 py-1 text-sm">
                        {s}
                        {years ? <span className="text-fg-subtle"> · {t.years(years)}</span> : null}
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {certifications.length > 0 && (
        <Block>
          <Heading kicker={t.credKicker} title={t.credTitle} />
          <ul className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((c) => {
              const inner = (
                <>
                  <span className="shrink-0 text-accent">
                    <Icon name={certIcon(c)} className="h-8 w-8" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{c.name}</span>
                    <span className="mt-0.5 block text-sm text-fg-muted">
                      {c.issuer}
                      {c.date ? ` · ${c.date}` : ''}
                    </span>
                  </span>
                </>
              )
              return (
                <li key={c.id}>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer" className="flex gap-4 hover:text-accent">
                      {inner}
                    </a>
                  ) : (
                    <div className="flex gap-4">{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </Block>
      )}
    </div>
  )
}
