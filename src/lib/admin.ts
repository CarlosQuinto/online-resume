import { signInAnonymously } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseEnabled } from './firebase'

const SESSION_KEY = 'admin:unlocked'

/**
 * Modelo de seguridad del PIN
 * ---------------------------
 * Modo Firebase:
 *   1. Se inicia sesión anónima (Firebase Auth) para obtener un uid.
 *   2. Se escribe `unlock/{uid}` con { pin }. Las reglas de Firestore solo
 *      aceptan la escritura si sha256(pin) coincide con `config/admin.pinHash`
 *      (documento que nadie puede leer desde el cliente).
 *   3. Las reglas permiten escribir `portfolio/main` solo si existe `unlock/{uid}`.
 *   El PIN nunca se guarda en el bundle ni en documentos públicos.
 *
 * Modo local (sin .env de Firebase):
 *   Se compara contra VITE_ADMIN_PIN. Solo para desarrollo.
 */
export async function unlockWithPin(pin: string): Promise<{ ok: boolean; reason?: string }> {
  const clean = pin.trim()
  if (!clean) return { ok: false, reason: 'Escribe tu PIN.' }

  if (!firebaseEnabled || !db || !auth) {
    const expected = import.meta.env.VITE_ADMIN_PIN ?? '2468'
    if (clean === expected) {
      sessionStorage.setItem(SESSION_KEY, '1')
      return { ok: true }
    }
    return { ok: false, reason: 'PIN incorrecto (modo local: revisa VITE_ADMIN_PIN).' }
  }

  try {
    const cred = auth.currentUser ?? (await signInAnonymously(auth)).user
    await setDoc(doc(db, 'unlock', cred.uid), { pin: clean, at: serverTimestamp() })
    sessionStorage.setItem(SESSION_KEY, '1')
    return { ok: true }
  } catch (err) {
    const code = (err as { code?: string }).code ?? ''
    if (code.includes('permission-denied')) return { ok: false, reason: 'PIN incorrecto.' }
    if (code.includes('operation-not-allowed'))
      return { ok: false, reason: 'Activa "Anónimo" en Firebase Auth > Métodos de acceso.' }
    return { ok: false, reason: `Error: ${code || (err as Error).message}` }
  }
}

export function isUnlocked() {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function lock() {
  sessionStorage.removeItem(SESSION_KEY)
}

/** Calcula sha256 en hex. */
export async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Guarda el hash del PIN en `config/admin`.
 * - Primera vez: cualquier sesión anónima puede crearlo (bootstrap); después nadie puede sobreescribirlo
 *   salvo quien ya haya desbloqueado con el PIN vigente.
 * - Tras guardarlo, también desbloquea la sesión actual con el nuevo PIN.
 */
export async function setPin(newPin: string): Promise<{ ok: boolean; reason?: string }> {
  const clean = newPin.trim()
  if (clean.length < 4) return { ok: false, reason: 'Usa al menos 4 caracteres (mejor 8+).' }
  if (!firebaseEnabled || !db || !auth) return { ok: false, reason: 'Modo local: edita VITE_ADMIN_PIN en .env.' }
  try {
    const cred = auth.currentUser ?? (await signInAnonymously(auth)).user
    const pinHash = await sha256Hex(clean)
    await setDoc(doc(db, 'config', 'admin'), { pinHash, updatedAt: serverTimestamp() })
    await setDoc(doc(db, 'unlock', cred.uid), { pin: clean, at: serverTimestamp() })
    sessionStorage.setItem(SESSION_KEY, '1')
    return { ok: true }
  } catch (err) {
    const code = (err as { code?: string }).code ?? ''
    if (code.includes('permission-denied')) return { ok: false, reason: 'Ya existe un PIN: desbloquea con el actual antes de cambiarlo.' }
    return { ok: false, reason: `Error: ${code || (err as Error).message}` }
  }
}
