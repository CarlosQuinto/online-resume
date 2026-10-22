import type { ReactNode } from 'react'

interface Props {
  id: string
  title?: string
  intro?: string
  children: ReactNode
  className?: string
}

/** Bloque dentro de una pestaña: título pequeño a la izquierda y contenido. */
export default function Section({ id, title, intro, children, className = '' }: Props) {
  return (
    <section id={id} className={`py-2 ${className}`}>
      {(title || intro) && (
        <header className="mb-5">
          {title && <h2 className="text-xl font-bold tracking-tight">{title}</h2>}
          {intro && <p className="mt-1 text-fg-muted">{intro}</p>}
        </header>
      )}
      {children}
    </section>
  )
}

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  }),
}
