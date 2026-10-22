import { motion } from 'framer-motion'
import type { Pillar } from '../data/schema'
import { fadeUp } from './Section'

/** Tres tarjetas "pilar" (qué hago, con qué, datos clave) en una sola fila. */
export default function Pillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="card grid overflow-hidden md:grid-cols-3 md:divide-x md:divide-border">
      {pillars.map((p, i) => (
        <motion.article
          key={p.id}
          variants={fadeUp}
          custom={i}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center px-6 py-8 text-center"
        >
          <span className="icon-circle" aria-hidden>
            {p.emoji}
          </span>
          <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
          <p className="mt-2 text-fg-muted">{p.description}</p>
          {p.lists.map((l) => (
            <div key={l.label} className="mt-5">
              <p className="text-sm font-semibold text-accent">{l.label}</p>
              <p className="mt-1 text-sm">{l.items.join(' · ')}</p>
            </div>
          ))}
        </motion.article>
      ))}
    </div>
  )
}
