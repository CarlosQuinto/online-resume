import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import Nav from '../components/Nav'
import ProfileHeader from '../components/ProfileHeader'
import Tabs, { useTab } from '../components/Tabs'
import Experience, { type ExpOrder } from '../components/Experience'
import WhatIDo from '../components/WhatIDo'
import Projects from '../components/Projects'
import Testimonials from '../components/Testimonials'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { usePortfolio } from '../hooks/usePortfolio'
import { useTheme } from '../hooks/useTheme'
import { withSeedDefaults } from '../data/defaults'
import { useLang } from '../i18n/lang'
import { localize } from '../i18n/content'

// Los ids van en el hash de la URL: se quedan en español para no romper enlaces.
const TAB_IDS = ['experiencia', 'proyectos', 'que-hago', 'recomendaciones', 'sobre-mi', 'contacto']

export default function Home() {
  const { data: raw } = usePortfolio()
  const { theme, toggle } = useTheme()
  const { lang, t } = useLang()
  const tabs = TAB_IDS.map((id) => ({ id, label: t.tabs[id] }))
  const { active, select } = useTab(tabs, 'experiencia')
  const [order, setOrder] = useState<ExpOrder>('recent')
  const data = useMemo(() => {
    // Los valores heredados de la semilla se completan antes de traducir, para que también se traduzcan.
    const base = withSeedDefaults(raw)
    return lang === 'en' ? localize(base) : base
  }, [raw, lang])

  const sortSelect =
    active === 'experiencia' ? (
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
    ) : null

  return (
    <>
      <Nav theme={theme} onToggleTheme={toggle} />
      <main>
        <ProfileHeader profile={data.profile} />
        <Tabs tabs={tabs} active={active} onSelect={select} right={sortSelect} />
        <div className="container-wide min-h-[60vh] pt-8 pb-16 lg:pt-12">
          {/* En pantallas estrechas el orden baja bajo la línea de pestañas, sobre la galería. */}
          {sortSelect && <div className="mb-8 lg:hidden">{sortSelect}</div>}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {active === 'experiencia' && <Experience items={data.experience} order={order} />}
              {active === 'proyectos' && <Projects items={data.projects} />}
              {active === 'que-hago' && (
                <div id="panel-que-hago" role="tabpanel" aria-labelledby="tab-que-hago">
                  <WhatIDo
                    summary={data.profile.summary}
                    stats={data.stats ?? []}
                    pillars={data.pillars}
                    groups={data.skillGroups}
                    certifications={data.certifications}
                  />
                </div>
              )}
              {active === 'recomendaciones' && <Testimonials items={data.recommendations ?? []} />}
              {active === 'sobre-mi' && <About hobbies={data.hobbies} education={data.education} />}
              {active === 'contacto' && <Contact profile={data.profile} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer profile={data.profile} updatedAt={data.updatedAt} />
    </>
  )
}
