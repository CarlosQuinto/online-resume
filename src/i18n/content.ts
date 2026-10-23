import type { PortfolioData, Translation } from '../data/schema'
import { bundledEn } from './en'

/**
 * Traducción del contenido editable. El español es el original; el inglés se guarda en
 * `translations.en` como { ruta: { src, text } }. La ruta usa ids (no índices) donde existen,
 * y `src` recuerda el texto español traducido para detectar cuando cambia.
 */
export type TranslationMap = Record<string, Translation>

/** Campos que nunca se traducen: técnicos, nombres propios y fechas en formato máquina. */
const SKIP = new Set([
  'id', 'url', 'phone', 'repoUrl', 'liveUrl', 'coverUrl', 'avatarUrl', 'color', 'start', 'end',
  'emoji', 'accent', 'cover', 'avatarCover', 'photoUrl', 'photoCover', 'featured', 'version', 'updatedAt', 'translations',
])
const SKIP_IN: Record<string, string[]> = {
  profile: ['name'],
  recommendations: ['name'],
  experience: ['company'],
  education: ['institution'],
  certifications: ['name', 'issuer'],
}

/** Orden de secciones y campos para que el admin las liste como en el sitio. */
const ORDER = [
  'profile', 'experience', 'projects', 'pillars', 'skillGroups', 'certifications', 'education', 'recommendations', 'hobbies',
  'headline', 'tagline', 'summary', 'location', 'availability', 'links', 'label',
  'role', 'title', 'name', 'degree', 'field', 'breed', 'description', 'detail', 'bio', 'note', 'text',
  'meta', 'kicker', 'highlights', 'lists', 'items', 'skills', 'tags', 'stack', 'date',
]
const rank = (k: string) => {
  const i = ORDER.indexOf(k)
  return i < 0 ? ORDER.length : i
}

const skip = (path: string[], k: string) => SKIP.has(k) || (SKIP_IN[path[0]]?.includes(k) ?? false)
const segment = (x: unknown, i: number) =>
  x && typeof x === 'object' && typeof (x as { id?: unknown }).id === 'string' ? (x as { id: string }).id : String(i)

/** Recorre el documento y reemplaza cada texto traducible con `fn(ruta, texto)`. */
function mapStrings(v: unknown, path: string[], fn: (key: string, s: string) => string): unknown {
  if (typeof v === 'string') return v.trim() ? fn(path.join('/'), v) : v
  if (Array.isArray(v)) return v.map((x, i) => mapStrings(x, [...path, segment(x, i)], fn))
  if (v && typeof v === 'object') {
    const obj = v as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(obj).sort((a, b) => rank(a) - rank(b))) {
      out[k] = skip(path, k) ? obj[k] : mapStrings(obj[k], [...path, k], fn)
    }
    return out
  }
  return v
}

/** Todos los textos traducibles, en orden de sitio. */
export function collectStrings(data: PortfolioData) {
  const out: { key: string; src: string }[] = []
  mapStrings(data, [], (key, src) => {
    out.push({ key, src })
    return src
  })
  return out
}

/**
 * Devuelve la traducción vigente o '' si no hay: primero la guardada para esa ruta si el
 * original no cambió (vacía = mostrar el español); si no, cualquier traducción del mismo
 * texto, guardada o de fábrica.
 */
export function makeTranslator(stored: TranslationMap = {}) {
  const memory = new Map<string, string>(bundledEn)
  for (const e of Object.values(stored)) if (e.text) memory.set(e.src, e.text)
  return (key: string, src: string) => {
    const e = stored[key]
    if (e && e.src === src) return e.text
    return memory.get(src) ?? ''
  }
}

export type TranslationStatus = 'ok' | 'stale' | 'missing'

/** Filas para el admin: texto vigente y, si el español cambió, la traducción anterior. */
export function translationRows(data: PortfolioData) {
  const stored = data.translations?.en ?? {}
  const tr = makeTranslator(stored)
  return collectStrings(data).map(({ key, src }) => {
    const text = tr(key, src)
    const prev = stored[key]
    const stale = !text && !!prev && prev.src !== src && !!prev.text
    const status: TranslationStatus = text ? 'ok' : stale ? 'stale' : 'missing'
    return { key, src, text, status, previous: stale ? prev.text : '' }
  })
}

/**
 * Guarda por ruta cada traducción vigente que solo existía en la memoria de fábrica. El admin
 * lo aplica al cargar: así, si después cambia el español, la fila conserva la traducción anterior.
 */
export function materialize(data: PortfolioData): PortfolioData {
  const stored = { ...data.translations?.en }
  for (const r of translationRows(data)) {
    if (r.status === 'ok' && stored[r.key]?.src !== r.src) stored[r.key] = { src: r.src, text: r.text }
  }
  return { ...data, translations: { ...data.translations, en: stored } }
}

/** Copia del contenido en inglés; lo que no está traducido se queda en español. */
export function localize(data: PortfolioData): PortfolioData {
  const tr = makeTranslator(data.translations?.en)
  return mapStrings(data, [], (key, src) => tr(key, src) || src) as PortfolioData
}
