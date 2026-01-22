import { getPayload } from 'payload'
import config from '@/payload.config'
import React from 'react'
import { MicrolinkClient } from './MicrolinkClient'

export const metadata = {
  title: 'Microlinks | Referrals',
  description: 'A curated list of tools and services I use and recommend.',
}

export default async function MicrolinkPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const referrals = await payload.find({
    collection: 'referrals',
    where: {
      isShow: {
        equals: true,
      },
    },
    depth: 1,
    limit: 100,
    sort: 'name',
  })

  return <MicrolinkClient referrals={referrals.docs as any} />
}
