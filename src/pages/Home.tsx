import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import Nav from '../components/Nav'
import ProfileHeader from '../components/ProfileHeader'
import Tabs, { useTab } from '../components/Tabs'
import Experience, { type ExpOrder } from '../components/Experience'
import Pillars from '../components/Pillars'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Testimonials from '../components/Testimonials'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { usePortfolio } from '../hooks/usePortfolio'
import { useTheme } from '../hooks/useTheme'
import { seed } from '../data/seed'
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
    const base = { ...raw, pillars: raw.pillars?.length ? raw.pillars : seed.pillars }
    return lang === 'en' ? localize(base) : base
  }, [raw, lang])
  // Documentos publicados antes de las portadas heredan color/encuadre de la semilla por id.
  const withDefaults = <T extends { id: string }>(items: T[], defaults: T[]): T[] =>
    items.map((it) => ({ ...defaults.find((d) => d.id === it.id), ...it }))
  const experience = withDefaults(data.experience, seed.experience)
  const projects = withDefaults(data.projects, seed.projects)

  return (
    <>
      <Nav theme={theme} onToggleTheme={toggle} />
      <main>
        <ProfileHeader profile={data.profile} />
        <Tabs
          tabs={tabs}
          active={active}
          onSelect={select}
          right={
            active === 'experiencia' ? (
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as ExpOrder)}
                aria-label={t.order}
                className="field w-auto py-1.5 text-sm"
              >
                <option value="recent">{t.newest}</option>
                <option value="oldest">{t.oldest}</option>
              </select>
            ) : null
          }
        />
        <div className="container-wide min-h-[60vh] pt-12 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {active === 'experiencia' && <Experience items={experience} order={order} />}
              {active === 'proyectos' && <Projects items={projects} />}
              {active === 'que-hago' && (
                <div className="grid gap-8" id="panel-que-hago" role="tabpanel" aria-labelledby="tab-que-hago">
                  <p className="max-w-4xl text-lg text-fg-muted">{data.profile.summary}</p>
                  <Pillars pillars={data.pillars} />
                  <Skills groups={data.skillGroups} certifications={data.certifications} />
                </div>
              )}
              {active === 'recomendaciones' && <Testimonials items={data.recommendations ?? []} />}
              {active === 'sobre-mi' && <About hobbies={data.hobbies} pets={data.pets} education={data.education} />}
              {active === 'contacto' && <Contact profile={data.profile} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer profile={data.profile} updatedAt={data.updatedAt} />
    </>
  )
}
