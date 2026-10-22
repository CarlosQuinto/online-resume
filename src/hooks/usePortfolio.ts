import { useEffect, useState } from 'react'
import { subscribePortfolio } from '../lib/content'
import { seed } from '../data/seed'
import type { PortfolioData } from '../data/schema'

export type DataSource = 'firestore' | 'local' | 'seed'

export function usePortfolio() {
  const [data, setData] = useState<PortfolioData>(seed)
  const [source, setSource] = useState<DataSource>('seed')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsub = subscribePortfolio((d, s) => {
      setData(d)
      setSource(s)
      setReady(true)
    })
    return unsub
  }, [])

  return { data, source, ready }
}
