import { motion } from 'framer-motion'
import type { Pillar } from '../data/schema'
import { fadeUp } from './Section'

/**
 * Banda de acento con saludo + resumen, y tres tarjetas "montadas" que
 * cruzan el borde inferior de la banda (patrón de mattfarley.ca).
 */
export default function Pillars({ name, summary, pillars }: { name: string; summary: string; pillars: Pillar[] }) {
  const first = name.split(' ')[0]
  return (
    <section id="pilares" className="scroll-mt-16">
      <div className="bg-band pt-16 pb-40 text-band-fg">
        <div className="container-narrow text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold tracking-tight"
          >
            Hola, soy {first}. Un gusto.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-band-fg-muted"
          >
            {summary}
          </motion.p>
        </div>
      </div>

      <div className="container-narrow -mt-28 pb-section">
        <div className="card grid overflow-hidden md:grid-cols-3 md:divide-x md:divide-border">
          {pillars.map((p, i) => (
            <motion.article
              key={p.id}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="flex flex-col items-center px-6 py-10 text-center"
            >
              <span className="icon-circle" aria-hidden>
                {p.emoji}
              </span>
              <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
              <p className="mt-3 text-fg-muted">{p.description}</p>
              {p.lists.map((l) => (
                <div key={l.label} className="mt-6">
                  <p className="text-sm font-semibold text-accent">{l.label}</p>
                  <p className="mt-1 text-sm text-fg">{l.items.join(' · ')}</p>
                </div>
              ))}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
