import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  id: string
  title: string
  intro?: string
  children: ReactNode
  tone?: 'plain' | 'soft' | 'band'
  className?: string
}

/**
 * Sección compacta y centrada. `tone` controla el fondo:
 * plain (blanco), soft (gris muy claro) o band (color de acento con texto claro).
 */
export default function Section({ id, title, intro, children, tone = 'plain', className = '' }: Props) {
  const bg = tone === 'band' ? 'bg-band text-band-fg' : tone === 'soft' ? 'bg-surface-2' : 'bg-bg'
  const introColor = tone === 'band' ? 'text-band-fg-muted' : 'text-fg-muted'
  return (
    <section id={id} className={`${bg} py-section scroll-mt-16 ${className}`}>
      <div className="container-narrow">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {intro && <p className={`mt-3 text-lg ${introColor}`}>{intro}</p>}
        </motion.header>
        {children}
      </div>
    </section>
  )
}

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
}
