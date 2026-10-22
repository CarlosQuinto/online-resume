/**
 * Esquema del documento Firestore `portfolio/main`.
 * Todo el contenido editable del sitio vive en este único documento.
 */
export interface Profile {
  name: string
  headline: string
  tagline: string
  location: string
  summary: string
  avatarUrl: string
  availability: string
  links: { label: string; url: string }[]
}

export interface Experience {
  id: string
  company: string
  role: string
  start: string // YYYY-MM
  end: string | null // null = actual
  location: string
  summary: string
  highlights: string[]
  stack: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  start: string
  end: string | null
  note: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url: string
}

export interface SkillGroup {
  id: string
  name: string
  skills: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  stack: string[]
  repoUrl: string
  liveUrl: string
  featured: boolean
}

export interface Hobby {
  id: string
  title: string
  emoji: string
  description: string
  detail: string
  accent: 'accent' | 'green' | 'amber' | 'violet'
}

export interface Pet {
  id: string
  name: string
  breed: string
  emoji: string
  bio: string
}

/** Tarjeta "pilar" montada sobre la banda: qué hago, con qué, y datos clave. */
export interface Pillar {
  id: string
  title: string
  emoji: string
  description: string
  lists: { label: string; items: string[] }[]
}

export interface Recommendation {
  id: string
  name: string
  role: string
  url: string
  text: string
}

export interface PortfolioData {
  version: number
  updatedAt: string
  profile: Profile
  experience: Experience[]
  education: Education[]
  certifications: Certification[]
  pillars: Pillar[]
  skillGroups: SkillGroup[]
  projects: Project[]
  recommendations: Recommendation[]
  hobbies: Hobby[]
  pets: Pet[]
}
