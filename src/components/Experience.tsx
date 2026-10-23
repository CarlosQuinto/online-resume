import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Experience as Exp } from '../data/schema'
import { Chips, Modal, Tile } from './gallery'

export const fmt = (ym: string | null) => {
  if (!ym) return 'Actual'
  const [y, m] = ym.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${months[Number(m) - 1] ?? ''} ${y}`.trim()
}

export type ExpOrder = 'recent' | 'oldest'

export default function Experience({ items, order = 'recent' }: { items: Exp[]; order?: ExpOrder }) {
  const [openId, setOpenId] = useState<string | null>(null)
  // "Actual" (end null) va primero en orden reciente; después por fecha de inicio.
  const key = (e: Exp) => (e.end ?? '9999-99') + e.start
  const sorted = [...items].sort((a, b) => (order === 'recent' ? key(b).localeCompare(key(a)) : a.start.localeCompare(b.start)))
  const current = items.find((e) => e.id === openId) ?? null

  return (
    <div id="panel-experiencia" role="tabpanel" aria-labelledby="tab-experiencia">
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Tile
              id={`exp-${exp.id}`}
              item={exp}
              label={exp.company}
              ariaLabel={`${exp.role} en ${exp.company}: ver detalles`}
              onOpen={() => setOpenId(exp.id)}
              overlay={
                <>
                  <p className="font-semibold leading-tight">{exp.role}</p>
                  <p className="clamp-2 mt-1 text-xs leading-snug text-white/85">{exp.summary}</p>
                  <Chips items={exp.stack} />
                </>
              }
              caption={
                <>
                  <p className="truncate font-semibold">{exp.company}</p>
                  <p className="flex items-baseline gap-2 text-sm text-fg-muted">
                    <span className="truncate">{exp.role}</span>
                    <span className="shrink-0 font-mono text-xs text-fg-subtle">
                      {fmt(exp.start)} — {fmt(exp.end)}
                    </span>
                  </p>
                </>
              }
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <Modal id={`exp-${current.id}`} item={current} label={current.company} titleId={`exp-title-${current.id}`} onClose={() => setOpenId(null)}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 id={`exp-title-${current.id}`} className="text-xl font-bold">
                {current.role}
              </h3>
              <span className="font-mono text-xs text-fg-subtle">
                {fmt(current.start)} — {fmt(current.end)}
              </span>
            </div>
            <p className="mt-1 text-fg-muted">
              {current.company} · {current.location}
            </p>
            <p className="mt-4">{current.summary}</p>
            {current.highlights.length > 0 && (
              <>
                <p className="eyebrow mt-6 mb-2">Lo que hice</p>
                <ul className="space-y-2">
                  {current.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="eyebrow mt-6 mb-2">Tecnologías</p>
            <div className="flex flex-wrap gap-1.5">
              {current.stack.map((s) => (
                <span key={s} className="pill">
                  {s}
                </span>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
