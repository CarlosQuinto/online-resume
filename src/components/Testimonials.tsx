import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Recommendation } from '../data/schema'
import Section from './Section'

/** Un testimonio grande a la vez, con rotación automática y selector. */
export default function Testimonials({ items }: { items: Recommendation[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (items.length < 2) return
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 9000)
    return () => clearInterval(t)
  }, [items.length])
  if (items.length === 0) return null
  const r = items[i] ?? items[0]
  const initials = r.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <Section id="recomendaciones" title="Recomendaciones" intro="Lo que dicen las personas con las que he trabajado." tone="soft">
      <div className="mx-auto max-w-3xl text-center">
        <AnimatePresence mode="wait">
          <motion.figure
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-lg font-bold text-accent-ink">{initials}</div>
            <blockquote className="mt-6 text-lg text-fg">“{r.text}”</blockquote>
            <figcaption className="mt-5">
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
        </AnimatePresence>
        {items.length > 1 && (
          <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Recomendaciones">
            {items.map((it, j) => (
              <button
                key={it.id}
                role="tab"
                aria-selected={j === i}
                aria-label={it.name}
                onClick={() => setI(j)}
                className={`h-2.5 rounded-full transition-all ${j === i ? 'w-6 bg-accent' : 'w-2.5 bg-border hover:bg-fg-subtle'}`}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
