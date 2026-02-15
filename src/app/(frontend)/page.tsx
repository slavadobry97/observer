import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getArticles, getAnnouncements } from './lib/payload-data'
import ObserverApp from './components/ObserverApp'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const [articles, ads] = await Promise.all([
      getArticles(payload),
      getAnnouncements(payload),
    ])

    return <ObserverApp initialArticles={articles} initialAds={ads} />
  } catch (error) {
    // During "Generating import map", Payload re-evaluates all pages
    // before config is fully initialized. This is expected — return empty state.
    const msg = (error as Error).message
    const isImportMapPhase = msg?.includes('includes') || msg?.includes('undefined')
    if (!isImportMapPhase) {
      console.warn('HomePage: Payload error, returning empty state:', msg)
    }
    return <ObserverApp initialArticles={[]} initialAds={[]} />
  }
}
