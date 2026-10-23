import { motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { useLang } from '../i18n/lang'

export interface TabDef {
  id: string
  label: string
}

/** Lee la pestaña activa del hash de la URL y la mantiene sincronizada. */
export function useTab(tabs: TabDef[], fallback: string) {
  const valid = (h: string) => tabs.some((t) => t.id === h)
  const fromHash = () => {
    const h = window.location.hash.replace('#', '')
    return valid(h) ? h : fallback
  }
  const [active, setActive] = useState<string>(fromHash)
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '')
      if (valid(h)) setActive(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const select = (id: string) => {
    setActive(id)
    history.replaceState(null, '', `#${id}`)
  }
  return { active, select }
}

/** Barra de pestañas tipo pastilla, pegajosa bajo el nav, con un extra opcional a la derecha. */
export default function Tabs({
  tabs,
  active,
  onSelect,
  right,
}: {
  tabs: TabDef[]
  active: string
  onSelect: (id: string) => void
  right?: ReactNode
}) {
  const { t } = useLang()
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur">
      <div className="container-wide flex items-center justify-between gap-4 py-2">
        <div role="tablist" aria-label={t.tabsLabel} className="-mx-1 flex overflow-x-auto px-1">
          {tabs.map((t) => {
            const selected = t.id === active
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => onSelect(t.id)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  selected ? 'text-fg' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-surface-2"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            )
          })}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  )
}
