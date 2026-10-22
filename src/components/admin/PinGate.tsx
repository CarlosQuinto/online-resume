import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { unlockWithPin } from '../../lib/admin'
import { firebaseEnabled } from '../../lib/firebase'

export default function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await unlockWithPin(pin)
    setBusy(false)
    if (res.ok) onUnlock()
    else {
      setError(res.reason ?? 'PIN incorrecto.')
      setPin('')
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card w-full max-w-sm p-8"
      >
        <p className="eyebrow mb-3">Admin</p>
        <h1 className="text-xl font-bold">Introduce tu PIN</h1>
        <p className="mt-2 text-sm text-fg-muted">
          {firebaseEnabled ? 'Validado contra Firestore.' : 'Modo local: se usa VITE_ADMIN_PIN del .env.'}
        </p>
        <label className="mt-6 block">
          <span className="field-label">PIN</span>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="field font-mono tracking-[0.4em]"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'pin-error' : undefined}
          />
        </label>
        {error && (
          <p id="pin-error" role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !pin}
          className="mt-6 w-full rounded-full bg-accent py-3 font-semibold text-accent-ink disabled:opacity-50"
        >
          {busy ? 'Verificando…' : 'Entrar'}
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-fg-muted hover:text-fg">
          ← Volver al sitio
        </Link>
      </motion.form>
    </main>
  )
}
