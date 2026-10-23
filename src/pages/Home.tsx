import { useEffect, useMemo, useRef, useState } from 'react'
import Nav from '../components/Nav'
import ProfileHeader from '../components/ProfileHeader'
import Tabs from '../components/Tabs'
import Experience, { type ExpOrder } from '../components/Experience'
import WhatIDo from '../components/WhatIDo'
import Projects from '../components/Projects'
import Testimonials from '../components/Testimonials'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import { usePortfolio } from '../hooks/usePortfolio'
import { useTheme } from '../hooks/useTheme'
import { withSeedDefaults } from '../data/defaults'
import { useLang } from '../i18n/lang'
import { localize } from '../i18n/content'

// Los ids van en el hash de la URL: se quedan en español para no romper enlaces.
const TAB_IDS = ['experiencia', 'proyectos', 'que-hago', 'recomendaciones', 'sobre-mi', 'contacto']

// Separación entre secciones (solo espacio: una línea aquí se doblaría con la del menú fijo).
const SECTION = 'mt-24'

/**
 * Menú de una sola página: un clic baja suavemente a la sección y la pestaña activa
 * sigue al desplazamiento. El hash de la URL (#proyectos…) abre directamente esa sección.
 */
function useScrollSpy(ids: string[]) {
  const fromHash = () => {
    const h = window.location.hash.replace('#', '')
    return ids.includes(h) ? h : ids[0]
  }
  const [active, setActive] = useState(fromHash)
  // Mientras dura el desplazamiento animado de un clic, el espía no cambia la pestaña.
  const lockUntil = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      if (Date.now() < lockUntil.current) return
      const bar = document.querySelector('[data-tabbar]')?.getBoundingClientRect().bottom ?? 0
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - bar - 80 <= 0) current = id
      }
      // Al final de la página, la última sección (corta) se marca aunque no llegue arriba.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1]
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const h = window.location.hash.replace('#', '')
    if (ids.includes(h) && h !== ids[0]) {
      lockUntil.current = Date.now() + 600
      setTimeout(() => {
        const el = document.getElementById(h)
        const bar = document.querySelector<HTMLElement>('[data-tabbar]')?.offsetHeight ?? 0
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - bar - 32, behavior: 'auto' })
      }, 300)
    }
    return () => window.removeEventListener('scroll', onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const select = (id: string) => {
    setActive(id)
    lockUntil.current = Date.now() + 900
    const el = document.getElementById(id)
    const bar = document.querySelector<HTMLElement>('[data-tabbar]')?.offsetHeight ?? 0
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - bar - 32, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }
  return { active, select }
}

export default function Home() {
  const { data: raw } = usePortfolio()
  const { theme, toggle } = useTheme()
  const { lang, t } = useLang()
  const tabs = TAB_IDS.map((id) => ({ id, label: t.tabs[id] }))
  const { active, select } = useScrollSpy(TAB_IDS)
  const [order, setOrder] = useState<ExpOrder>('recent')
  const data = useMemo(() => {
    // Los valores heredados de la semilla se completan antes de traducir, para que también se traduzcan.
    const base = withSeedDefaults(raw)
    return lang === 'en' ? localize(base) : base
  }, [raw, lang])

  const sortSelect = (
      // Flecha propia: la nativa queda pegada al borde y no admite margen.
      <span className="relative inline-flex">
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as ExpOrder)}
          aria-label={t.order}
          className="field w-auto cursor-pointer appearance-none py-1.5 pr-10 pl-3.5 text-sm"
        >
          <option value="recent">{t.newest}</option>
          <option value="oldest">{t.oldest}</option>
        </select>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="pointer-events-none absolute top-1/2 right-3.5 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </span>
  )

  return (
    <>
      <Nav theme={theme} onToggleTheme={toggle} />
      <main>
        <ProfileHeader profile={data.profile} />
        <Tabs tabs={tabs} active={active} onSelect={select} />
        <div className="container-wide pt-8 pb-16 lg:pt-12">
          <section id="experiencia">
            <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold tracking-tight">{t.tabs.experiencia}</h2>
              {sortSelect}
            </header>
            <Experience items={data.experience} order={order} />
          </section>
          <section id="proyectos" className={SECTION}>
            <Projects items={data.projects} />
          </section>
          <section id="que-hago" className={SECTION}>
            <WhatIDo
              summary={data.profile.summary}
              stats={data.stats ?? []}
              pillars={data.pillars}
              groups={data.skillGroups}
              certifications={data.certifications}
            />
          </section>
          <section id="recomendaciones" className={SECTION}>
            <Testimonials items={data.recommendations ?? []} />
          </section>
          <section id="sobre-mi" className={SECTION}>
            <About hobbies={data.hobbies} education={data.education} />
          </section>
          <section id="contacto" className={SECTION}>
            <Contact profile={data.profile} />
          </section>
        </div>
      </main>
      <Footer profile={data.profile} updatedAt={data.updatedAt} />
      <BackToTop />
    </>
  )
}
