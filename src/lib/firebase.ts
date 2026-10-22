import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

const env = import.meta.env

/** True cuando el .env tiene credenciales de Firebase. Si no, el sitio corre en modo local (localStorage). */
export const firebaseEnabled = Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID)

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

if (firebaseEnabled) {
  app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  })
  db = getFirestore(app)
  auth = getAuth(app)
}

export { app, db, auth }
