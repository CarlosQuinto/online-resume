import { useState } from 'react'
import PinGate from '../components/admin/PinGate'
import Editor from '../components/admin/Editor'
import { usePortfolio } from '../hooks/usePortfolio'
import { isUnlocked } from '../lib/admin'

export default function Admin() {
  const [unlocked, setUnlocked] = useState(isUnlocked())
  const { data, ready } = usePortfolio()

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />
  if (!ready) return <main className="grid min-h-screen place-items-center text-fg-muted">Cargando…</main>
  return <Editor initial={data} onLock={() => setUnlocked(false)} />
}
