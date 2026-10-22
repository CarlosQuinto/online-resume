import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import About from '../components/About'
import Footer from '../components/Footer'
import { usePortfolio } from '../hooks/usePortfolio'

export default function Home() {
  const { data } = usePortfolio()
  return (
    <>
      <Nav name={data.profile.name} />
      <main>
        <Hero profile={data.profile} />
        <Experience items={data.experience} />
        <Skills groups={data.skillGroups} certifications={data.certifications} />
        <Projects items={data.projects} />
        <About summary={data.profile.summary} hobbies={data.hobbies} pets={data.pets} education={data.education} />
      </main>
      <Footer profile={data.profile} updatedAt={data.updatedAt} />
    </>
  )
}
