import type { PortfolioData } from './schema'
import { seed } from './seed'

/** Completa cada elemento con los campos de la semilla del mismo id que le falten. */
const withDefaults = <T extends { id: string }>(items: T[] = [], defaults: T[]): T[] =>
  items.map((it) => ({ ...defaults.find((d) => d.id === it.id), ...it }))

/**
 * Documentos publicados antes de un campo nuevo (portadas, encabezados de hobbies…)
 * lo heredan de la semilla por id. Lo usan el sitio y el admin, así ambos ven lo mismo.
 */
export function withSeedDefaults(data: PortfolioData): PortfolioData {
  return {
    ...data,
    pillars: data.pillars?.length ? data.pillars : seed.pillars,
    experience: withDefaults(data.experience, seed.experience),
    projects: withDefaults(data.projects, seed.projects),
    hobbies: withDefaults(data.hobbies, seed.hobbies),
  }
}
