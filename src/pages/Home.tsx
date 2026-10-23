import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
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

const TABS = [
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'que-hago', label: 'Qué hago' },
  { id: 'recomendaciones', label: 'Recomendaciones' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'contacto', label: 'Contacto' },
]

export default function Home() {
  const { data } = usePortfolio()
  const { theme, toggle } = useTheme()
  const { active, select } = useTab(TABS, 'experiencia')
  const [order, setOrder] = useState<ExpOrder>('recent')
  const pillars = data.pillars?.length ? data.pillars : seed.pillars
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
          tabs={TABS}
          active={active}
          onSelect={select}
          right={
            active === 'experiencia' ? (
              <label className="flex items-center gap-2 text-sm text-fg-muted">
                <span className="hidden sm:inline">Orden</span>
                <select value={order} onChange={(e) => setOrder(e.target.value as ExpOrder)} className="field w-auto py-1.5 text-sm">
                  <option value="recent">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                </select>
              </label>
            ) : null
          }
        />
        <div className="container-narrow min-h-[60vh] py-8">
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
                  <p className="max-w-3xl text-lg text-fg-muted">{data.profile.summary}</p>
                  <Pillars pillars={pillars} />
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
