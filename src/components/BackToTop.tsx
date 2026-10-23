import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLang } from '../i18n/lang'

/** Burbuja flotante translúcida que aparece al bajar y lleva de vuelta al inicio. */
export default function BackToTop() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t.backToTop}
          title={t.backToTop}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.2 }}
          // En iPhone respeta la barra inferior (safe area).
          className="fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 grid h-12 w-12 place-items-center rounded-full border border-border/70 bg-surface/60 text-accent shadow-card backdrop-blur-md transition-colors hover:bg-surface/85 md:right-8 md:bottom-8"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
