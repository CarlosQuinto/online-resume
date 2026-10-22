// Publica la semilla en Firestore y, la primera vez, crea el PIN del panel /admin.
// Uso:  node scripts/seed-firestore.mjs [PIN]
//   - Sin PIN existente: crea config/admin con un PIN (el dado o uno aleatorio de 6 dígitos) y publica la semilla.
//   - Con PIN existente: pásalo como argumento para desbloquear y republicar la semilla.
// Usa el SDK público y las mismas reglas que el sitio; requiere Auth anónimo habilitado y el .env configurado.
import { createHash, randomInt } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const env = Object.fromEntries(
  readFileSync(resolve(root, '.env'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => l.split('=').map((s) => s.trim())),
)
const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})
const auth = getAuth(app)
const db = getFirestore(app)
const pinArg = process.argv[2]
const out = {}

try {
  const { user } = await signInAnonymously(auth)
  const { seed } = await import('../src/data/seed.ts')
  const pin = pinArg || String(randomInt(100000, 999999))
  const pinHash = createHash('sha256').update(pin).digest('hex')

  // 1) Bootstrap del PIN (solo funciona si config/admin no existe todavía)
  let created = false
  if (!pinArg) {
    try {
      await setDoc(doc(db, 'config', 'admin'), { pinHash, updatedAt: serverTimestamp() })
      created = true
      out.pin = pin
      out.note = 'PIN creado. Guárdalo: no se puede recuperar, solo cambiar desde /admin > Ajustes.'
    } catch (e) {
      throw new Error('config/admin ya existe. Vuelve a ejecutar pasando el PIN actual como argumento. (' + (e.code || e.message) + ')')
    }
  }
  // 2) Desbloqueo
  await setDoc(doc(db, 'unlock', user.uid), { pin, at: serverTimestamp() })
  // 3) Semilla
  await setDoc(doc(db, 'portfolio', 'main'), seed)
  out.pinCreated = created
  out.seedPublished = true
  out.experience = seed.experience.length
  out.recommendations = seed.recommendations.length
} catch (e) {
  out.error = e.code || e.message
  if (String(out.error).includes('operation-not-allowed')) out.hint = 'Habilita Authentication > Métodos de acceso > Anónimo en la consola de Firebase.'
  if (String(out.error).includes('permission-denied')) out.hint = 'PIN incorrecto o reglas no desplegadas (firebase deploy --only firestore:rules).'
}
console.log(JSON.stringify(out, null, 1))
process.exit(out.error ? 1 : 0)
