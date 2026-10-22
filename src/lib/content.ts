import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, firebaseEnabled } from './firebase'
import { seed } from '../data/seed'
import type { PortfolioData } from '../data/schema'

export const PORTFOLIO_PATH = ['portfolio', 'main'] as const
const LOCAL_KEY = 'portfolio:draft'

/** Lee el borrador local (modo sin Firebase). */
export function readLocal(): PortfolioData {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) return JSON.parse(raw) as PortfolioData
  } catch {
    /* localStorage no disponible */
  }
  return seed
}

export function writeLocal(data: PortfolioData) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent('portfolio:local-update'))
  } catch {
    /* ignore */
  }
}

/**
 * Suscribe a los cambios del contenido. En Firebase usa onSnapshot (tiempo real);
 * en modo local escucha un evento de ventana.
 */
export function subscribePortfolio(cb: (data: PortfolioData, source: 'firestore' | 'local' | 'seed') => void) {
  if (firebaseEnabled && db) {
    return onSnapshot(
      doc(db, ...PORTFOLIO_PATH),
      (snap) => {
        if (snap.exists()) cb(snap.data() as PortfolioData, 'firestore')
        else cb(seed, 'seed')
      },
      () => cb(seed, 'seed'),
    )
  }
  cb(readLocal(), 'local')
  const handler = () => cb(readLocal(), 'local')
  window.addEventListener('portfolio:local-update', handler)
  return () => window.removeEventListener('portfolio:local-update', handler)
}

/** Guarda el contenido completo. Requiere haber desbloqueado el admin (ver admin.ts). */
export async function savePortfolio(data: PortfolioData) {
  const payload: PortfolioData = { ...data, updatedAt: new Date().toISOString().slice(0, 10) }
  if (firebaseEnabled && db) {
    await setDoc(doc(db, ...PORTFOLIO_PATH), payload)
  } else {
    writeLocal(payload)
  }
  return payload
}
