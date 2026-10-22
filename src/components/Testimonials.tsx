import { motion } from 'framer-motion'
import type { Recommendation } from '../data/schema'
import Section, { fadeUp } from './Section'

export default function Testimonials({ items }: { items: Recommendation[] }) {
  if (items.length === 0) return null
  return (
    <Section
      id="recomendaciones"
      eyebrow="Recomendaciones"
      title="Lo que dicen de mi trabajo"
      intro="Recomendaciones recibidas en LinkedIn de colegas y líderes con los que he trabajado."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((r, i) => (
          <motion.figure
            key={r.id}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="card flex flex-col p-6 md:p-8"
          >
            <span className="font-serif text-3xl leading-none text-accent" aria-hidden>
              “
            </span>
            <blockquote className="mt-2 flex-1 text-fg-muted">{r.text}</blockquote>
            <figcaption className="mt-6 border-t border-border pt-4">
              {r.url ? (
                <a href={r.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-accent">
                  {r.name}
                </a>
              ) : (
                <span className="font-semibold">{r.name}</span>
              )}
              {r.role && <p className="text-sm text-fg-subtle">{r.role}</p>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  )
}
