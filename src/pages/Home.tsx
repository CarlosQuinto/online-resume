import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Pillars from '../components/Pillars'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Testimonials from '../components/Testimonials'
import About from '../components/About'
import Footer from '../components/Footer'
import { usePortfolio } from '../hooks/usePortfolio'
import { useTheme } from '../hooks/useTheme'
import { seed } from '../data/seed'

export default function Home() {
  const { data } = usePortfolio()
  const { theme, toggle } = useTheme()
  // Documentos publicados antes de que existieran los pilares usan los de la semilla.
  const pillars = data.pillars?.length ? data.pillars : seed.pillars
  return (
    <>
      <Nav name={data.profile.name} theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero profile={data.profile} />
        <Pillars name={data.profile.name} summary={data.profile.summary} pillars={pillars} />
        <Experience items={data.experience} />
        <Projects items={data.projects} />
        <Testimonials items={data.recommendations ?? []} />
        <Skills groups={data.skillGroups} certifications={data.certifications} />
        <About hobbies={data.hobbies} pets={data.pets} education={data.education} />
      </main>
      <Footer profile={data.profile} updatedAt={data.updatedAt} />
    </>
  )
}
