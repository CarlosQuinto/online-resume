import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  id: string
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
}

/**
 * Región común (Gestalt): cada sección es un bloque con su propio
 * espacio macro, cabecera y contenido. Las animaciones solo se disparan
 * al entrar en viewport para mantener la carga cognitiva baja.
 */
export default function Section({ id, eyebrow, title, intro, children }: Props) {
  return (
    <section id={id} className="py-macro scroll-mt-20">
      <div className="container-narrow">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 max-w-2xl"
        >
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {intro && <p className="mt-4 text-lg text-fg-muted">{intro}</p>}
        </motion.header>
        {children}
      </div>
    </section>
  )
}

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  }),
}
