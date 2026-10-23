import { motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { useLang } from '../i18n/lang'

export interface TabDef {
  id: string
  label: string
}

/** Menú tipo pastilla, pegajoso bajo el nav: cada botón lleva a su sección de la página. Extra opcional a la derecha (pantallas anchas). */
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
  const list = useRef<HTMLDivElement>(null)

  // Cuando la barra no cabe (móvil), desplaza la pestaña activa al centro para ver sus vecinas.
  useEffect(() => {
    const el = list.current
    const btn = el?.querySelector<HTMLElement>(`#tab-${active}`)
    if (!el || !btn) return
    const box = el.getBoundingClientRect()
    const b = btn.getBoundingClientRect()
    const left = el.scrollLeft + (b.left - box.left) - (box.width - b.width) / 2
    // Instantáneo: un desplazamiento suave aquí cancelaría el de la página hacia la sección.
    el.scrollTo({ left, behavior: 'auto' })
  }, [active])

  return (
    <div data-tabbar className="sticky top-0 z-30 bg-bg/95 backdrop-blur">
      {/* La línea inferior se alinea con la galería, no con el borde de la ventana (como Dribbble). */}
      <div className="container-wide">
        <div className="flex items-center justify-between gap-4 border-b border-border pt-4 pb-7">
          <nav ref={list} aria-label={t.tabsLabel} className="-mx-1 flex overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => {
              const selected = t.id === active
              return (
                <button
                  key={t.id}
                  aria-current={selected ? 'location' : undefined}
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
          </nav>
          {right && <div className="hidden shrink-0 lg:block">{right}</div>}
        </div>
      </div>
    </div>
  )
}
